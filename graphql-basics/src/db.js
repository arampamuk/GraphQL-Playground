const user = [{
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

const post = [{
    id: '10',
    title: 'Lorem Ipsum is simply dummy text',
    body: 'printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy',
    published: true,
    author: '1'
}, {
    id: '11',
    title: 'It is a long established fact that a reader',
    body: 'will be distracted by the readable content of a page when looking at its layout.',
    published: true,
    author: '2'
}, {
    id: '12',
    title: 'There are many variations of passages',
    body: 'of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected',
    published: true,
    author: '3'
}
];

const db = {
    user,
    post
}

export { db as default }