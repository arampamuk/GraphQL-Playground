import { GraphQLServer } from 'graphql-yoga';
import db  from './db';

// Type definition (scheme)
const typeDefs = `
    type Query {
        grades: [Int!]!
        add(numbers: [Float!]!): Float!
        users(query: String): [User!]!
        posts(query: String): [Post!]!
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
        grades(parent, args, ctx, info) {
            return [99, 55, 54];
        },
        add(parent, args, ctx, info) {
           if (args.numbers.lenght === 0) {
               return 0;
           }
            
          return args.numbers.reduce((accumulator, currentValue) => {
                return accumulator + currentValue;
          });
        },
        users(parent, args, ctx, info) {
            if (!args.query) {
                return db.user;
            }
z
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
    //Nested Resolver method
    Post: {
        author(parent, args, ctx, info) {
            return db.user.find((user) => {
                return user.id === parent.author;
            });
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return db.post.filter((post) => {
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
    console.log('playWithArrays! server is up!');
});