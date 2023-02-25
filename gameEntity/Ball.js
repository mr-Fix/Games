/** Класс мяча */
class Ball {

    constructor(utility, parent) {
        // полезные методы
        this.utility = utility;

        // родитель (игра)
        this.parent = parent;

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
     startMove() {
        
        this.moveY = -this.velocity;

        this.moveX = this.utility.random(-this.velocity, this.velocity);

        this.start = true;

        this.animate();
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

        for(let block of this.parent.gameEntities.block.coordsBlock) {

            if (!block[2]) { continue; }

            if (this.collide(block, 'block')) { 

                this.parent.soundEntities.bump.sound.play();
                
                this.bumpBlock(block);

                this.parent.addScore();
            }
        }

        // обновление кадра мяча
        this.coords[0] = this.frame * this.coords[2];

        // проверка столкновения со стенами
        this.collideWorldBounds();

    }

    /**
     * Проверяет столкновение мяча со стенами  */
    collideWorldBounds() {
        let x = this.coords[4] + this.moveX;
        let y = this.coords[5] + this.moveY;

        // параметры мяча
        let ballLeft = x;
        let ballRight = ballLeft + this.coords[2];
        let ballTop = y;
        let ballBottom = ballTop + this.coords[3];

        // параметры мира
        let worldLeft = 0;
        let worldRight = this.parent.areaWidth;
        let worldTop = 0;
        let worldtBottom = this.parent.areaHeight;

        if (ballLeft < worldLeft) {

            this.parent.soundEntities.bump.sound.play();
            this.moveX = this.velocity;

        } else if (ballRight > worldRight) {

            this.parent.soundEntities.bump.sound.play();
            this.moveX = - this.velocity;

        } else if (ballTop < worldTop) {

            this.parent.soundEntities.bump.sound.play();
            this.moveY = this.velocity;

        } else if (ballBottom > worldtBottom) {

            this.parent.reloadGame('Вы проиграли!');
        }
    }

    /**
     * Сдивигает мяч на moveX пикселей
     * @param {number} moveX - число пикселей
     */
    updateMoveX(moveX) {

        this.coords[4] += moveX;
    }

    /**
     * Проверяет столкновение мяча с блоками
     * @param {Array} block - массив с координатами блока
     * @param {string} name - строка с названием сущности из gameEntyties
     * @returns 
     */
    collide(block, name) {

        let x = this.coords[4] + this.moveX;
        let y = this.coords[5] + this.moveY;

        if (
            x + this.coords[2] > block[0]
            && x < block[0] + this.parent.gameEntities[name].width
            && y + this.coords[3] > block[1]
            && y < block[1] + this.parent.gameEntities[name].height
        ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Логика отскока после соприкосновения с блоком
     * @param {Array} block - массив с координатами блока
     */
    bumpBlock(block) {

        this.moveY *= -1;

        block[2] = false;
    }

    /**
     * Логика отскока после соприкосновения с платформой */
    bumpPlatform() {

        if (this.parent.gameEntities.platform.moveX > 0) {
            this.coords[4] += this.parent.gameEntities.platform.moveX;
        }

        if (this.moveY > 0) { 

            this.moveY = -this.velocity;

            let touchX = this.coords[4] + this.coords[2] / 2;

            this.moveX = this.velocity * this.parent.gameEntities.platform.getTouchOffset(touchX);
        }

    }
}