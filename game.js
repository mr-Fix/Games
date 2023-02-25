// import Utility from './Utility.js';
// import Ball from './gameEntity/Ball.js';
// import Background from './gameEntity/Background.js';
// import Block from './gameEntity/Block.js';
// import Platform from './gameEntity/Platform.js';


class Game {
    constructor() {

        // общие полезности
        this.utility = new Utility();

        // игровые сущности
        this.gameEntities = {
            background: new Background(this.utility, this),
            block: new Block(this.utility, this),
            platform: new Platform(this.utility, this),
            ball: new Ball(this.utility, this),
        };

        // ширина игрового поля
        this.areaWidth = 640;

        // высота игрового поля
        this.areaHeight = 360;

        //счетчик кол-ва сбитых блоков
        this.score = 0;
    }

    /** Запускает игру */
    async start() {
        this.ctx = document.getElementById("mycanvas").getContext("2d");
        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "#fff";
        this.setEvents();
        await this.loader();
        this.render();
    }

    /** Загружает игровые данные */
    async loader() {
        try {
            for(let entity in this.gameEntities ) {
                await  this.gameEntities[entity].loadData();
            }
        } catch (err) {
            console.log('ОШибка в методе game => loader > ', err);
        }

    }

    /** Устанавливает обработку событий */
    setEvents() {

        /** событие движения */
        window.addEventListener('keydown', e => {
            if (e.code === 'Space') {

                this.gameEntities.ball.startMove();

            } else if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
    
                this.gameEntities.platform.move(e.code);
            } 
        });

        /** событие остановки двжения */
        window.addEventListener('keyup', e => {
            if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
                
                this.gameEntities.platform.stopMove();
            }
        });
    }

    /**  Рендер изображений  */
    render() {
        // if (!this.running) { return; }

        requestAnimationFrame(() => {
            // обновление данных
            this.update();

            // сброс канвас
            this.ctx.clearRect(0, 0, this.areaWidth, this.areaHeight);

            // рендер обновленных изображений
            for(let entity in this.gameEntities) {

                if (entity === 'block') {
                    
                    for(let coords of this.gameEntities[entity].coordsBlock) {
                        if (!coords[2]) { continue }
                        this.ctx.drawImage(this.gameEntities[entity].image, coords[0], coords[1]); 
                    }
                    continue; 
                }
                
                this.ctx.drawImage(this.gameEntities[entity].image, ...this.gameEntities[entity].coords); 
            }
           
            this.ctx.fillText(`Счет: ${this.score}`, 15, 20);
            // рекурсия
            this.render();
        });
    }

    /** Обновляет состояние игры */
    update() {
        this.gameEntities.platform.update();
        this.gameEntities.ball.update();
    }

    /** Следит за счетом очков */
    addScore() {
        ++this.score;

        if (this.score >= this.gameEntities.block.coordsBlock.length) {
            this.reloadGame('Вы выиграли!');
        }
    }

    /** Останавливает игру и перезапускает  
     * @param {String} message - строка сообщение
     */
    reloadGame(message) {
        
        this.running = false;
        alert(message);
        window.location.reload();
    }
}

let gameInstance = new Game();

window.addEventListener('load', () => {
    gameInstance.start();
});