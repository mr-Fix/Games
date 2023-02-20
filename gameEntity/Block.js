/** Класс блока */
export default class Block {
    constructor(utility) {
        // полезные методы
        this.utility = utility;

        // путь до изображения
        this.imagePath = './gameEntity/img/block.png';
    }

    /** Загрузчик необходимых данных */
    async loadData() {
        this.image = await this.utility.loadImage(this.imagePath);
    }

    
}