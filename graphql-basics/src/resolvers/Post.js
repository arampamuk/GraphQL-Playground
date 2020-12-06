//Nested Resolver method
const Post = {
    author(parent, args, { db }, info) {
        return db.user.find((user) => user.id === parent.author);
    }
};

export { Post as default };