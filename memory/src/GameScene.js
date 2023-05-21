import { Scene, Utils } from "phaser";
import Card from "./Card.js";
import config from "./config.js";

export default class GameScene extends Scene {
   constructor() {
      super("MainScene");
   }

   // загрузчик файлов для сцены
   preload() {

      // грузим фон
      this.load.image("bg", "assets/img/bg.jpg");

      // задняя сторона карты
      this.load.image("backCard", "assets/img/backCard.jpg");
      
      // передняя сторона карты
      for(let i = 1; i <= 5; ++i) {
         this.load.image(`card${i}`, `assets/img/card${i}.jpg`);
      }

      this.load.audio("themeBg", "assets/sound/bg.mp3")
      this.load.audio("fail", "assets/sound/fail.mp3")
      this.load.audio("victory", "assets/sound/victory.mp3")
      this.load.audio("change", "assets/sound/change.mp3")
   };

   // отображает на сцене
   create() {
      // this.sys.game.config.width
      this.createSounds();
      this.createTimer();
      this.createBackground();
      this.createText();
      this.createCards();
      this.start();
   };

   /** Запускает игру */
   start() {
      // открытая карта
      this.openedCard = null;

      // таймер проигрыша
      this.timeout = config.timeout;

      // хранит кол-во открытых пар карт
      this.openedCardCount = 0;

      // переворачиваем карты задней стороной
      this.initCards();

      // показ карточек
      this.showCards();
   }

   /** Инициализация и запуск звуков */
   createSounds() {
      this.sounds = {
         themeBg: this.sound.add("themeBg"),
         fail: this.sound.add("fail"),
         victory: this.sound.add("victory"),
         change: this.sound.add("change"),
      };

      this.sounds.themeBg.play({ volume: 0.2, loop: true, });

   }

   /** Показвает карточки */
   showCards() {
      for(let card of this.cardList) {
         card.depth = card.position.delay;
         card.move(card.position.delay);
      }
   }

   /** Создает фон сцены */
   createBackground() {
      // рисуем фон
      this.add.sprite(0, 0, "bg").setOrigin(0, 0);
   }

   /** Создает игровые карточки */
   createCards() {

      // список всех карточек
      this.cardList = [];

      for(let id of config.idCards) {
         for(let i = 0; i < 2;  ++i) {
            this.cardList.push(new Card(this, id,  config))
         }
      }

      this.input.on("gameobjectdown", this.cardClickHandler, this);
   }

   /** Инициализирует начальные значения и позиции карточек */
   initCards() {
      // получаем координаты
      let positionCardList = this.getCardPosition();

      for(let card of this.cardList) {
         card.init(positionCardList.pop())
      }
   }

   /**
    * Обрабатывает событие клика
    * @param {Object} pointer - объект с параметрами события
    * @param {Object} card - игровой объект на котором произошло событие
    */
   cardClickHandler(pointer, card) {
      // проверка на клик по уже открытой карте
      if (card.opened) { return; }

      this.sounds.change.play();

      if (this.openedCard) {
         // если карты совпали по id
         if (this.openedCard.id === card.id)  {

            this.openedCard = null;

            ++this.openedCardCount;

         } else {

            this.openedCard.close();

            this.openedCard = card;
         }
      } else {
         this.openedCard = card;
      }

      // вызываем метод самой карточки
      card.open(() => {
         // проверка на все открытые карты
         if (this.openedCardCount === this.cardList.length / 2) {
            this.sounds.victory.play();
            this.start(); // перезапуск
         }
      });

   }

   /**
    * Возвращает массив с координатами разополодения карточек
    * @returns {Array} - массив объектов
    */
   getCardPosition() {
      // массив с координатами
      let position = [];
   
      // отступы карточек горизонталь и вертикаль
      let offsetCard  = 10;
   
      // отсутут по горизонтали
      let offsetX = (this.sys.game.config.width - (config.cardWidth + offsetCard) * config.cols) / 2 + config.cardWidth / 2;
      
      // отступ по вертикали
      let offsetY = (this.sys.game.config.height - (config.cardHeight + offsetCard) * config.rows) / 2 + config.cardHeight / 2;
      
      let numCard = 0;
      // заполняем координаты
      for(let row = 0; row < config.rows; ++row) {
         for(let col = 0; col < config.cols; ++col) {
            position.push({
               x: offsetX + col * (config.cardWidth + offsetCard),
               y: offsetY + row * (config.cardHeight + offsetCard),
               delay: ++numCard * 100
            });
         }
      }
   
      return Utils.Array.Shuffle(position);;
   }

   /** Выводит текст на сцену */
   createText() {
      this.timeOutText = this.add.text(7, 330, "Время: ", { font: "36px Kramola", fill: "#fff" });
   }

   createTimer() {
      this.time.addEvent({
         delay: 1000,
         callback: this.onTimerTick,
         callbackScope: this,
         loop: true,
      })
   }

   onTimerTick() {
      if (this.timeout <= 0) {
         this.sounds.fail.play();
         this.start();
      }
      this.timeOutText.setText(`Время: ${this.timeout--}`);
   }
}