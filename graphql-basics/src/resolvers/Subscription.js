const Subscription = {
    post: {
        subscribe(parent, { userId }, { db, pubsub }, info) {
            const user = db.user.find((user) => user.id === userId);

                if (!user) {
                    throw new Error('User not found');
                }

                return pubsub.asyncIterator(`post ${userId}`);
            }
        }

}

export { Subscription as default};