const Subscription = {
    post: {
        subscribe(parent, args, { pubsub }, info) {
                return pubsub.asyncIterator(`post`);
            }
        }

}

export { Subscription as default};