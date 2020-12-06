import { GraphQLServer } from 'graphql-yoga';

// Type definition (scheme)
const typeDefs = `
    type Query {
        sayHello(name: String, age: Int ): String!
        add(a: Float!, b: Float!): Float!
        me: User!
        post:Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`;

// Resolvers
const resolvers = {
    Query: {
        sayHello(parent, args, ctx, info) {
            console.log(args);
            
            if (args.name && args.age) {
                return `Hello ${args.name}! You are ${args.age}!`
            } else {
                return 'Hello!';
            }
          
        },
        add(parent, args, ctx, info) {
            return args.a + args.b
        },
        me() {
            return {
                id: '32432324',
                name: 'Joe',
                email: 'test@test.com',
                age: 12
            }
        },
        post() {
            return {
                id: '332432',
                title: 'Hello from post',
                body: '',
                published: false
            }
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log('CustomType! server is up!');
});