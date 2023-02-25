/** Класс мяча */
class Ball {

    constructor(utility) {
        // полезные методы
        this.utility = utility;

        // загруженное изображение
        this.image = null;

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
            20,  // поместить на высоту
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
        try{

            this.image = await this.utility.loadImage(this.imagePath);
        } catch (err) {

            console.log('Ошибка в Ball > loadData > ', err);
        }
    }

    /** Начало движения мяча */
     startMove(moveX) {
        
        this.moveY = -this.velocity;

        this.moveX = this.utility.random(-this.velocity, this.velocity);

        this.start = true;

        // this.animate();
    }

    /** запускает анимацию мяча */
    animate() {

        setInterval(() => {

            if (this.frame = 3) {
                this.frame = 0;
            } else {
                ++this.frame;
            }

        }, 100);
    }

    /** Метод обновления */
    update() {

        if (this.moveY) {
            this.coords[5] += this.moveY;
        } 

        if (this.moveX) {
            this.coords[4] += this.moveX;
        }

        // for(let block of this.parent.gameEntities.images.block.coordsBlock) {

        //     if (!block[2]) { continue; }

        //     if (this.collide(block, 'block')) { 

        //         this.parent.gameEntities.sounds.bump.sound.play();
                
        //         this.bumpBlock(block);

        //         this.parent.addScore();
        //     }
        // }
        // обновление кадра мяча
        this.coords[0] = this.frame * this.coords[2];

        // проверка столкновения со стенами
        this.collideWorldBounds();

    }
}