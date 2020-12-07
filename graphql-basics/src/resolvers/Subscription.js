const Subscription = {
    count: {
        subscribe(parent, args, { pubsub }, info) {
            let count = 0;

            setInterval(() =>{
                count++
                pubsub.publish('count', {
                    count
                })
            }, 1000);

            return pubsub.asyncIterator('count');
        }
    },
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