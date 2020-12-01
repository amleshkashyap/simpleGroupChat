const mongoose = require('mongoose');
const StatusValues = ['active', 'hidden', 'deleted'];
const ChatStatusValues = ['sent', 'delivered', 'deleted'];
const ChatTypes = ['text'];

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, enum: StatusValues, default: 'active' }
}, {
    timestamps: {
	createdAt: 'created_at',
	updatedAt: 'updated_at'
    },
    collection: 'users'
});

const chatSchema = new mongoose.Schema({
    group_id: { type: mongoose.Schema.ObjectId, required: true },
    sent_at: { type: Number },
    sent_by: { type: mongoose.Schema.ObjectId, required: true },
    sender_name: { type: String, required: true },
    sender_email: { type: String, required: true },
    chat_type: { type: String, enum: ChatTypes, default: 'text' },
    chat_body: { type: String },
    chat_body_copy: { type: String },
    status: { type: String, enum: ChatStatusValues, default: 'sent' },
}, { 
    timestamps: {
	createdAt: 'created_at',
	updatedAt: 'updated_at'
    },
    collection: 'chats'
});

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    status: { type: String, enum: StatusValues, default: 'active' }
}, {
    timestamps: {
	createdAt: 'created_at',
	updatedAt: 'updated_at'
    },
    collection: 'groups'
});

const ChatModel = mongoose.model('Chat', chatSchema);
const UserModel = mongoose.model('User', userSchema);
const GroupModel = mongoose.model('Group', groupSchema);

module.exports = {
    ChatModel,
    UserModel,
    GroupModel
};
