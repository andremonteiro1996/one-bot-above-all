const seedRandom = require('seedrandom');
const { api } = require('./config.json');
const { server, port } = api;

module.exports = {
    rand: (seed, min, max) => {
        const generator = seedRandom(seed);
        const rand_number = generator();
        return Math.floor(
            Math.random() * (rand_number - min + max) + min
        );
    },
    arrayRand: (arrayLength) => {
        return Math.floor(
            Math.random() * (arrayLength - 0 + 1) + 0
        );
    },
    capitalize: (string) => {
        if (typeof(string) !== 'string') return;
        const capString = string.charAt(0).toUpperCase() + string.slice(1);
        return capString;
    },
    server_options: (path, method, token = null) => {
        const options = {
            server: server,
            port: port,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'x-auth-access': token
            }
        };

        return options;
    }
}