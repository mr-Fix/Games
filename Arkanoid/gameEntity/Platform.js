/** Класс платформы */
class Platform {
    
    constructor(utility, parent) {
        // полезные методы
        this.utility = utility;

        // родитель (игра)
        this.parent = parent;

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

    /**
     * Обрабатывает события движения
     * @param {string} typeEvent - тип события (код кнопки)
     */
    move(typeEvent) {

        this.moveX = typeEvent === 'ArrowLeft' ? -this.velocity : this.velocity;
    }

    /** Останавливает движение */
    stopMove() {

        this.moveX = 0;
    }

    /** метод обновления местоположения */
    update() {
    
        if (this.moveX && !this.collideWorldBounds()) {

            this.coords[0] += this.moveX;

            if (!this.parent.gameEntities.ball.start) {
                this.parent.gameEntities.ball.updateMoveX(this.moveX);
            }

        }

        if (this.parent.gameEntities.ball.collide(this.coords, 'platform')) {
            this.parent.soundEntities.bump.sound.play();

            this.parent.gameEntities.ball.bumpPlatform();
        }

        // проверка на столкновение со стенами
        this.collideWorldBounds();
    }

    /** Проверяет столкновение платформы со стенами  */
    collideWorldBounds() {
        let platformLeft = this.coords[0] + this.moveX;
        let platformRight = this.coords[0] + this.width + this.moveX;

        if (platformLeft < 0) {

            this.coords[0] = 0;
            return true;

        } else if (platformRight > this.parent.areaWidth) {

            this.coords[0] = this.parent.areaWidth - this.width;
            return true;

        }
        return false;
    }

    /** метод определяет область касания мяча по платформе
     * @param {number} - центр мяча при касании
     * @return {number}
     */
    getTouchOffset(touchX) {

        let offset = touchX - this.coords[0];

        return (2 * offset / this.width) - 1;
    }
}