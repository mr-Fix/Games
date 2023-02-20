/** Класс мяча */
export default class Ball {

    constructor(utility) {
        // полезные методы
        this.utility = utility;

        // путь до изображения
        this.imagePath = './gameEntity/img/ball.png';

        // координаты располжения 
        this.coords = [
            0,   // от исходного изображ по оси х
            0,   // от исходного изображ по оси у
            20,  // от исходного изображ ширина
            20,  // от исходного изображ высота
            320, // поместить с оси х
            280, // поместить с оси у
            20,  // поместить на ширину
            20   // поместить на высоту
        ];

        //скорость передвижения 
        this.velocity = 3;

        // движение Y 
        this.moveY = 0;

        // движение X
        this.moveX = 0;

        // Чекер начала движения мяча
        this.start = false;

        // кадр анимации мяча
        this.frame = 0;
    }

    /** Загрузчик необходимых данных */
    async loadData() {
        this.image = await this.utility.loadImage(this.imagePath);
    }
}