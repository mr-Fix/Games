import Utility from './Utility.js';
import Ball from './gameEntity/Ball.js';
import Background from './gameEntity/Background.js';
import Block from './gameEntity/Block.js';
import Platform from './gameEntity/Platform.js';


class Game {
    constructor() {

        // общие полезности
        this.utility = new Utility();

        // игровые сущности
        this.gameEntities = {
            ball: new Ball(this.utility),
            background: new Background(this.utility),
            block: new Block(this.utility),
            platform: new Platform(this.utility),
        };

        // ширина игрового поля
        this.areaWidth = 640;

        // высота игрового поля
        this.areaHeight = 360;
    }

    /** Запускает игру */
    start() {
        this.ctx = document.getElementById("mycanvas").getContext("2d");
        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "#fff";

        this.loader();
    }

    /** Загружает игровые данные */
    async loader() {
        try {
            for(let entity in this.gameEntities ) {
                await entity.loadData();
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

                this.gameEntities.ball.startMove( 
                    // this.random( -this.gameEntities.images.ball.velocity, this.gameEntities.images.ball.velocity ) 
                );

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

}

let gameInstance = new Game();

window.addEventListener('load', () => {
    gameInstance.start();
});