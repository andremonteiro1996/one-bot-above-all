const seedRandom = require('seedrandom');

module.exports = {
    rand: (seed) => {
        const generator = seedRandom(seed);
        const rand_number = generator();
        return rand_number;
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