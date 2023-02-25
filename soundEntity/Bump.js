
/** Класс звук удара */
class Bump {
    constructor(utility, parent) {
        // полезные методы
        this.utility = utility;

        // родитель (игра)
        this.parent = parent;

        // загруженный звук
        this.sound = null;

        // путь до звука
        this.soundPath = './soundEntity/sounds/bump.mp3';
    }

    /** Загрузчик необходимых данных */
    async loadData() {
        try{

            this.sound = await this.utility.loadSound(this.soundPath);
        } catch (err) {

            console.log('Ошибка в Bump > loadData > ', err);
        }
    }
}