//Named export
//Default export 

const message = 'Some message from myModule.js';

const name = 'Aram';

const location = 'London';

const getGreeting = (name) => {
    return `Welcome to the course ${name}`;
}

export { message, name, getGreeting, location as default }