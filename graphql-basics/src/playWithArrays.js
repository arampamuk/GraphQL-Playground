import { GraphQLServer } from 'graphql-yoga';

const users = [{
    id: '1',
    name: 'Aram',
    email: 'Aram@test.com',
    age: 10
}, {
    id: '2',
    name: 'Gozde',
    email: 'Bill@test.com',
    age: 12
}, {
    id: '3',
    name: 'Will',
    email: 'Will@test.com',
    age: 55
}];

const posts = [{
    id: '10',
    title: 'Lorem Ipsum is simply dummy text',
    body: 'printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy',
    published: true
}, {
    id: '11',
    title: 'It is a long established fact that a reader',
    body: 'will be distracted by the readable content of a page when looking at its layout.',
    published: true
}, {
    id: '12',
    title: 'There are many variations of passages',
    body: 'of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected',
    published: true
}
];

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
                return users;
            }

            return users.filter((user) => {
                return user.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase());
            })
        },
        posts(parent, args, ctx, info) {
            if(!args.query) {
                return posts;
            }

            return posts.filter((post) => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
                return isTitleMatch || isBodyMatch;
            });
          
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