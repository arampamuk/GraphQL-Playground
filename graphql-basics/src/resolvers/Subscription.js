const Subscription = {
    post: {
        subscribe(parent, args, { db, pubsub }, info) {
                return pubsub.asyncIterator(`post`);
            }
        }

}

export { Subscription as default};