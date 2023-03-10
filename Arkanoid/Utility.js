
class Utility {

    /**
     * Генерирует рандомное число в диапазоне от min до max
     * @param {number} min - минимально допустимое число
     * @param {number} max - максимально допустимое число
     * @return {number} - ранодмное число
    */
    random(min, max) {
        return Math.floor( Math.random() * (max - min + 1) + min );
    }

    /**
     * Загружает изображение по переданному path
     * @param {string} path - путь до изображения
     * @returns {object} - объект изображения или ошибки
     */
    loadImage(path) {

        return new Promise((resolve, reject) => {
            let image = new Image();
            image.src = path;

            image.addEventListener("load", () => {
                resolve(image);
            });

            image.addEventListener("error", () => {
                reject(err);
            });
        });
        
    }

    /**
     * Загружает звук по переданному path
     * @param {string} path - путь до звукового файла
     * @returns {object} - объект звука или ошибки
     */
    loadSound(path) {

        return new Promise((resolve, reject) => {

            let audio = new Audio();
            audio.src = path;

            audio.addEventListener(
                "canplaythrough", 
                () => { resolve(audio); },
                { once: true }
            );

            audio.addEventListener("error", (err) => {
                reject(err);
            });
        });
        
    }
}