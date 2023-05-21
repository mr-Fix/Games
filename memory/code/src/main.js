import config from "./config.js";
import { Game, } from "phaser"
import GameScene from "./GameScene.js";


// дописываем сцену в объект конфигурации
config.scene = new GameScene("MainScene");


const game = new Game(config);