const Query = {
    users(parent, args, { db }, info) {
        if (!args.query) {
            return db.user;
        }

        return db.db.user.filter((user) => {
            return user.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase());
        })
    },
    posts(parent, args, { db }, info) {
        if(!args.query) {
            return db.post;
        }

        return db.post.filter((post) => {
            const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
            const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
            return isTitleMatch || isBodyMatch;
        });
    }
};

export { Query as default}