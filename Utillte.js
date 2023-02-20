
export default class Utility {
    /**
     * Генерирует рандомное число в диапазоне от min до max
     * @param {number} min - минимально допустимое число
     * @param {number} max - максимально допустимое число
    */
    random(min, max) {
        return Math.floor( Math.random() * (max - min + 1) + min );
    }
}