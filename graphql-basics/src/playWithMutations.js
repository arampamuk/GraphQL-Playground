import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

import { postDatas, userDatas } from './staticDatas'


// Type definition (scheme)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
    }

    type Mutation {
        createUser(name: String!, email: String! age: Int): User!
        createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }
`;

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) {
                return userDatas;
            }
z
            return userDatas.filter((user) => {
                return user.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase());
            })
        },
        posts(parent, args, ctx, info) {
            if(!args.query) {
                return postDatas;
            }

            return postDatas.filter((post) => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
                return isTitleMatch || isBodyMatch;
            });
        }
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = userDatas.some((user) => user.email === args.email);
            
            if(emailTaken) {
                throw new Error('Email taken.');
            }

            const user = {
                id: uuidv4(),
                ...args
            };

            userDatas.push(user);

            return user;
        },
        createPost(parent, args, ctx, info) {
            const usersExists = userDatas.some((user) => user.id === args.author);

            if(!usersExists) {
                throw new Error('User not found');
            }

            const post = {
                id: uuidv4(),
                ...args
            }

            postDatas.push(post);

            return post;
        }
    },
    //Nested Resolver method
    Post: {
        author(parent, args, ctx, info) {
            return userDatas.find((user) => {
                return user.id === parent.author;
            });
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return postDatas.filter((post) => {
                return post.author === parent.id;
            })
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log('playWithMutations! server is up!');
});