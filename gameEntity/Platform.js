/** Класс платформы */
class Platform {
    constructor(utility) {
        // полезные методы
        this.utility = utility;

        // загруженное изображение
        this.image = null;

        // путь до изображения
        this.imagePath = './gameEntity/img/platform.png';

        // кординаты
        this.coords = [
            280, // поместить с оси х
            300, // поместить с оси y
        ];

        // ширина
        this.width = 100;

        // высота
        this.height = 14;

        // скорость передвижения
        this.velocity = 6;

        // движение
        this.moveX = 0;
    }

    /** Загрузчик необходимых данных */
    async loadData() {
        this.image = await this.utility.loadImage(this.imagePath);
    }
}