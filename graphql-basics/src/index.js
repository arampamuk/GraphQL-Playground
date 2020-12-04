import { GraphQLServer } from 'graphql-yoga';

// Type definition (scheme)
const typeDefs = `
    type Query {
        hello: String!
        name: String!
        location: String!
        about: String!
    }
`;

// Resolvers
const resolvers = {
    Query: {
        hello() {
            return 'This is hello query!';
        },
        name() {
            return 'Aram Pamuk';
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