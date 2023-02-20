/** Класс мяча */
export default class Ball {

    constructor(utility) {
        // полезные методы
        this.utility = utility;

        // путь до изображения
        this.imagePath = './gameEntity/img/ball.png';
    }

    /** Загрузчик необходимых данных */
    async loadData() {
        this.image = await this.utility.loadImage(this.imagePath);
    }
}