import Utility from './Utillte.js';
import Ball from './gameEntity/Ball.js';
import Background from './gameEntity/Background.js';
import Block from './gameEntity/Block.js';
import Platform from './gameEntity/Platform.js';


class Game {
    constructor() {

        // общие полезности
        this.utility = new Utility();

        // игровые сущности
        this.gameEntyti = {
            ball: new Ball(),
            background: new Background(),
            block: new Block(),
            platform: new Platform(),
        };

    }

    /** Запускает игру */
    start() {
        this.ctx = document.getElementById("mycanvas").getContext("2d");
        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "#fff";
    }


}

let gameInstance = new Game();

window.addEventListener('load', () => {
    gameInstance.start();
});