/** Класс фона */
class Background {
    constructor(utility, parent) {

        // полезные методы
        this.utility = utility;
        
        // родитель (игра)
        this.parent = parent;

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