/** Класс фона */
export default class Background {
    constructor(utility) {
        // полезные методы
        this.utility = utility;

        // загруженное изображение
        this.image = null;

        // путь до изображения
        this.imagePath = './gameEntity/img/background.png';

        // координаты
        this.coords = [
            0, // поместить с оси х
            0, // поместить с оси y
        ];
    }

    /** Загрузчик необходимых данных */
    async loadData() {
        this.image = await this.utility.loadImage(this.imagePath);
    }
}