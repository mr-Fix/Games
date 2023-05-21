import { GameObjects } from "phaser";

export default class Card extends GameObjects.Sprite {
   /**
    * Создает экземпляр игрово карты
    * @param {Object} scene - объект сцены
    * @param {Number} id - идентификатор
    * @param {Object} position - объект с координатами
    * @param {Number} position.x - координата по горизонтали
    * @param {Number} position.y - координата по вертикали
    * @param {Object} config - объект конфига
    */
   constructor(scene, id, config) {
      super(scene, 0, 0, "backCard");
      // super(scene, position.x, position.y, "card" + id);

      // this.setOrigin(0, 0);

      // идентификатор карты
      this.id = id;

      // чекер открытоц/закрытой карты
      this.opened = false;

      // конфигурация
      this.config = config;

      // задаем ширину и высоту
      this.displayWidth = this.config.cardWidth;
      this.displayHeight = this.config.cardHeight;

      // объект сцены
      this.scene = scene;
      this.scene.add.existing(this);

      // ставим интерактивность
      this.setInteractive();

      // ставим обработчик нажатия
      // this.on("pointerdown", this.open, this);

   }

   /** Инициализация карточки 
    * @param {Object} position - объект с координатами
   */
   init(position) {
      this.position = position;
      this.close();
      // this.setPosition(position.x, position.y);
      this.setPosition(-this.width, -this.height);
   }

   /** Меняет карточку на открытую */
   open(callback) {
      this.opened = true;
      this.flip(callback);
   }

   /** Меняет карточку на закрытую */
   close() {
      if (this.opened) {
         this.opened = false;
         this.flip();
      }
   }

   /**
    * Переворачивает карту меняя текстуру
    * Скрывает, после скрытия вызывает метод открытия
    */
   flip(callback) {

      this.scene.tweens.add({
         targets: this,
         scaleX: 0,
         ease: "Linear",
         duration: 150,
         onComplete: () => { this.show(callback); }
      });
   }

   /** Показывает карту */
   show(callback) {
      this.setTexture(this.opened ? "card" + this.id : "backCard");
      // задаем высоту
      this.displayHeight = this.config.cardHeight;

      this.scene.tweens.add({
         targets: this,
         scaleX: 1,
         displayWidth: this.config.cardWidth,
         ease: "Linear",
         duration: 150,
         onComplete: () => { if(callback) { callback(); } }
      });
   }

   /** Двигает карты на правильные(видимые) позиции */
   move(delay) {
      this.scene.tweens.add({
         targets: this,
         x: this.position.x,
         y: this.position.y,
         delay,
         ease: "Linear",
         duration: 250,
      });
   }

}