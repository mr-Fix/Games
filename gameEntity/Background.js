/** Класс фона */
export default class Background {
    constructor(utility) {
        // полезные методы
        this.utility = utility;

        // путь до изображения
        this.imagePath = './gameEntity/img/background.png';
    }

    /** Загрузчик необходимых данных */
    async loadData() {
        this.image = await this.utility.loadImage(this.imagePath);
    }
}