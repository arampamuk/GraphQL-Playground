import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

import db  from './db'


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
        deletePost(id: ID!): Post!
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
                return db.user;
            }

            return db.user.filter((user) => {
                return user.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase());
            })
        },
        posts(parent, args, ctx, info) {
            if(!args.query) {
                return db.post;
            }

            return db.post.filter((post) => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
                return isTitleMatch || isBodyMatch;
            });
        }
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = db.user.some((user) => user.email === args.data.email);
            
            if(emailTaken) {
                throw new Error('Email taken.');
            }

            const user = {
                id: uuidv4(),
                ...args.data
            };

            db.user.push(user);
            return user;
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = db.user.findIndex((user) =>  user.id === args.id);

            if (userIndex === -1) {
                throw new Error('User not found');
            }

           const deletedUsers = db.user.splice(userIndex, 1);
           
           //TODO: Fix below logic dont mutate the array
           const shouldDeletePosts = db.post.filter((post) => {
                const match =  db.post.author === args.id;

                return !match;
           });

           return deletedUsers[0];


        },
        createPost(parent, args, ctx, info) {
            const usersExists = db.user.some((user) => user.id === args.data.author);

            if(!usersExists) {
                throw new Error('User not found');
            }

            const post = {
                id: uuidv4(),
                ...args.data
            }

            db.post.push(post);

            return post;
        },
        deletePost(parent, args, ctx, info) {
            const postIndex  = db.post.findIndex((post) => post.id === args.id);

            if (postIndex === -1) {
                throw new Error('Post not found');
            }

            const deletedPosts = posts.splice(postIndex, 1);

            return deletedPosts[0];
        }
    },
    //Nested Resolver method
    Post: {
        author(parent, args, ctx, info) {
            return db.user.find((user) => user.id === parent.author);
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return db.post.filter((post) => post.author === parent.id);
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


