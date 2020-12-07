import uuidv4 from 'uuid/v4';

const Mutation = {
    createUser(parent, args, { db }, info) {
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
    deleteUser(parent, args, { db }, info) {
        const userIndex = db.user.findIndex((user) =>  user.id === args.id);

        if (userIndex === -1) {
            throw new Error('User not found');
        }

       const deletedUsers = db.user.splice(userIndex, 1);
       
       //TODO: Fix below logic dont mutate the array
       const shouldDeletePosts = db.post.filter((post) => {
            const match =  post.author === args.id;

            return !match;
       });

       return deletedUsers[0];


    },
    updateUser(parent, args, { db }, info) {
        const { id, data } = args;
        const user = db.user.find((user) => user.id === id);

        if (!user) {
            throw new Error('User not found');
        }

        if (typeof data.email === 'string') {
            const emailTaken = db.user.some((user) => user.email === data.email);

            if (emailTaken) {
                throw new Error('Email taken');
            }

            user.email = data.email;
        }

        if (typeof data.name === 'string') {
            user.name = data.name;
        }

        if (typeof data.age !== 'undefined') {
            user.age = data.age;
        }

        return user;
    },
    createPost(parent, args, { db, pubsub }, info) {
        const usersExists = db.user.some((user) => user.id === args.data.author);

        if(!usersExists) {
            throw new Error('User not found');
        }

        const post = {
            id: uuidv4(),
            ...args.data
        }

        db.post.push(post);
        pubsub.publish(`post ${args.data.author}`, { post });

        return post;
    },
    deletePost(parent, args, { db }, info) {
        const postIndex  = db.post.findIndex((post) => post.id === args.id);

        if (postIndex === -1) {
            throw new Error('Post not found');
        }

        const deletedPosts = posts.splice(postIndex, 1);

        return deletedPosts[0];
    },
    updatePost(parent, args, { db }, info) {
        const { id, data } = args;
        const post = db.post.find((post) => post.id === id);

        if (!post) {
            throw new Error('Post not found');
        }

        if (typeof data.title === 'string') {
            post.title = data.title;
        }

        if (typeof data.body === 'string') {
            post.body = data.body;
        }

        if (typeof data.published === 'boolean') {
            post.published = data.published;
        }

        return post;
    }
}

export {Mutation as default}