const mongoose = require('mongoose');
const to = require('await-to-js').default;
const md5Hash = require('md5');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { PubSub, withFilter } = require("graphql-yoga");
const { UserModel, ChatModel, GroupModel } = require('./models');

dotenv.config();

const pubsub = new PubSub();

const resolvers = {
    Query: {
	users: () => UserModel.find({ status: 'active' }),
	chats: () => ChatModel.find({ status: 'sent' }),
/*	chats: async(
	    _,
	    { group_id }
	    ) => {
		const [error, result] = await to(ChatModel.find({ group_id: mongoose.Types.ObjectId(group_id), status: 'sent' }));
		if (error || !result) {
		    return "Something went wrong"
		}
		return result;
	},	*/
	groups: () => GroupModel.find({ status: 'active' })
    },

    Mutation: {
	newUser: async (
	    _,
	    { email, password, username }
	    ) => {
		const user = new UserModel({
		    name: username,
		    email: email,
		    password: md5Hash(password)
		});
		const [error, result] = await to(user.save());
		if(error || !result) {
		    return null
		};

		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

		pubsub.publish("newUser", { text: "Success" });
//		    newUser: user,
//		    token
//		});

		return user;
	},

	userLogin: async (
	    _,
	    { email, password }
	    ) => {

		const [error, result] = await to(UserModel.findOne({'email': email, 'password': md5Hash(password)}));
		if(error || !result) {
		    return null;
		};

		const token = jwt.sign({ _id: result._id }, process.env.JWT_SECRET);

		pubsub.publish("userLogin", { userLogin: "Success", email: email});
//		    {
//		    "Success"
//  		    userLogin: result,
//		    token
//		});

		return result;
	},

	newChat: async (
	    _, 
	    { sender_id, sender_email, sender_name, chat_text, group_id, sent_at } 
	    ) => {
	    const chat = new ChatModel({
		group_id: mongoose.Types.ObjectId(group_id),
		sent_at: sent_at,
		sent_by: mongoose.Types.ObjectId(sender_id),
		sender_email: sender_email,
		sender_name: sender_name,
		chat_type: 'text',
		chat_body: chat_text,
		chat_body_copy: chat_text,
		status: 'sent',
	    });

	    const [error, result] = await to(chat.save());

	    if(error || !result) {
		return "Something went wrong";
	    }

	    pubsub.publish("newChat", {
		newChat: chat,
		group_id, sender_email
	    });

	    return chat;
	}
    },

    Subscription: {
	newChat: {
	    subscribe: withFilter(
		() => pubsub.asyncIterator("newChat"),
		(payload, variables) => {
		    return (variables.group_id.includes(payload.group_id));		// && variables.sender_email !== payload.sender_email);
		}
	    )
	}
    }
};

module.exports = resolvers;
