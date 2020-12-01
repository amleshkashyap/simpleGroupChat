const mongoose = require('mongoose');
const to = require('await-to-js').default;
const { PubSub, withFilter } = require("graphql-yoga");
const { UserModel, ChatModel, GroupModel } = require('./models');

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
		group_id
	    });

	    return chat;
	}
    },

    Subscription: {
	newChat: {
	    subscribe: withFilter(
		() => pubsub.asyncIterator("newChat"),
		(payload, variables) => {
		    return variables.group_id.includes(payload.group_id);
		}
	    )
	}
    }
};

module.exports = resolvers;
