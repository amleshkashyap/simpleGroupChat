const typeDefs = `
    enum StatusValues {
	active
	hidden
	deleted
    }

    enum ChatStatusValues {
	sent
	delivered
	deleted
    }

    enum ChatTypes {
	text
    }

    type User {
	id: ID!
	name: String!
	email: String!
	password: String!
	status: StatusValues!
    }

    type Chat {
	id: ID!
	group_id: String!
	sent_at: Float!
	sent_by: String!
	sender_email: String!
	sender_name: String!
	chat_type: ChatTypes!
	chat_body: String!
	chat_body_copy: String!
	status: ChatStatusValues!
    }

    type Group {
	id: ID!
	name: String!
	description: String!
	status: StatusValues!
    }

    type Query {
	users: [ User! ]!
	groups: [ Group! ]!
	chats : [ Chat! ]!
    }

    type Mutation {
	newUser(email: String! password: String! name: String!): User
	userLogin(email: String! password: String!): User
	newChat(sender_id: String! sender_email: String! sender_name: String! chat_text: String! group_id: String! sent_at: Float!): Chat!
    }

    type Subscription {
	userLogin (email: String!): String
	newChat (group_id: [ String! ]! sender_email: String): Chat!
    }
`;

module.exports = typeDefs;
