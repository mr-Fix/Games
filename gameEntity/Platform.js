/** Класс платформы */
export default class Platform {
    constructor(utility) {
        // полезные методы
        this.utility = utility;

        // путь до изображения
        this.imagePath = './gameEntity/img/platform.png';
    }

    /** Загрузчик необходимых данных */
    async loadData() {
        this.image = await this.utility.loadImage(this.imagePath);
    }
}