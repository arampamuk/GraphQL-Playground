import { GraphQLServer } from 'graphql-yoga';

// Scalar types - String, Int, Float, ID, Boolean

// Type definition (scheme)
const typeDefs = `
    type Query {
        id: ID!
        name: String!
        age: Int!
        student: Boolean!
        weight: Float!

        hello: String!
        location: String!
        about: String!
    }
`;

// Resolvers
const resolvers = {
    Query: {
        id() {
            return 'test123';
        },
        name() {
            return 'Aram Pamuk';
        },
        age() {
            return '37';
        },
        student() {
            return false;
        },
        weight() {
            return 120.5;
        },
        hello() {
            return 'This is hello query!';
        },
        location() {
            return 'London';
        },
        about() {
            return 'This is an example for graphQL yoga!'
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log('The server is up!');
});