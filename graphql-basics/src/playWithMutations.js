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
        createUser(data: CreateUserInput!): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput!): Post!
    }

    input CreateUserInput {
        name: String!
        email: String! 
        age: Int
    }
    
    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
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
            const emailTaken = userDatas.some((user) => user.email === args.data.email);
            
            if(emailTaken) {
                throw new Error('Email taken.');
            }

            const user = {
                id: uuidv4(),
                ...args.data
            };

            userDatas.push(user);
            return user;
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = userDatas.findIndex((user) =>  user.id === args.id);

            if (userIndex === -1) {
                throw new Error('User not found');
            }

           const deletedUsers = userDatas.splice(userIndex, 1);
           
           postDatas = postDatas.filter((post) => {
                const match =  post.author === args.id;

                return !match;
           });

           return deletedUsers[0];


        },
        createPost(parent, args, ctx, info) {
            const usersExists = userDatas.some((user) => user.id === args.data.author);

            if(!usersExists) {
                throw new Error('User not found');
            }

            const post = {
                id: uuidv4(),
                ...args.data
            }

            postDatas.push(post);

            return post;
        }
    },
    //Nested Resolver method
    Post: {
        author(parent, args, ctx, info) {
            return userDatas.find((user) => user.id === parent.author);
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return postDatas.filter((post) => post.author === parent.id);
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


