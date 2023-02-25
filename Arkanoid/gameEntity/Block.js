/** Класс блока */
class Block {
    constructor(utility, parent) {

        // полезные методы
        this.utility = utility;

        // родитель (игра)
        this.parent = parent;

        // загруженное изображение
        this.image = null;

        // путь до изображения
        this.imagePath = './gameEntity/img/block.png';

        // ширина
        this.width = 64

        // высота
        this.height = 24;

        // Расположение блоков
        this.positonBlocks = {
            1: { row: 4, col: 8, },
        };

        // массив с координатами блоков
        this.coordsBlock = [];

        // заполняем координаты
        this.createCoordsBlock();
        
    }

    /** Загрузчик необходимых данных */
    async loadData() {
        this.image = await this.utility.loadImage(this.imagePath);
    }

    /** Создает координаты для блоков */
    createCoordsBlock() {

        this.coordsBlock = [];
        
        for(let i = 0; i < this.positonBlocks['1'].row; ++i) {

            for(let j = 0; j < this.positonBlocks['1'].col; ++j) {

                this.coordsBlock.push([
                    this.width * j + 65,
                    this.height * i + 35,
                    true,
                ]);
            }
        }

    }
}