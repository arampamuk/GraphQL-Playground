//Nested Resolver method
const User = {
    posts(parent, args, { db }, info) {
        return db.post.filter((post) => post.author === parent.id);
    }
};

export { User as default };