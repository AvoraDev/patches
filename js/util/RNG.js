export const RNG = {
    /**
     * Returns a random interger that is min <= x >= max.
     * @param {Number} min
     * @param {Number} max
     * @returns {Number}
     */
    randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    /**
     * Returns a random float that is min <= x >= max.
     * @param {Number} min
     * @param {Number} max
     * @returns {Number}
     */
    randFloat(min, max) {
        return Math.random() * (max - min + 1) + min;
    }
} 