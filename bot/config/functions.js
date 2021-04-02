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
    }
}