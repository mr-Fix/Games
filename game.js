let game = {

    /** контекст канвас */
    ctx: null,

    /** Объекты игры */
    gameEntity: {
        background: { img: null, coords: [0, 0] },
        ball: { img: null, coords: [0, 0, 20, 20, 320, 280, 20, 20] },
        platform: { 
            img: null, 
            coords: [280, 300],
            /** скорость передвижения */
            velocity: 6,
            /** движение */
            moveX: 0,
        },
        block: { 
            img: null, 
            /** Расположение блоков */
            positonBlocks: {
                1: { row: 4, col: 8, },
            },
            /** массив с координатами блоков */
            activeCoordsBlock: [],
        },
    },

 



    /** Инициализация */
    init() {
        this.ctx = document.getElementById("mycanvas").getContext("2d");
        this.setEvents();
    },

    /**
     * Загрузщик игровых объектов
     */
    preload() {

        let loadAll = [];

        for (let key in this.gameEntity) {

            loadAll.push(new Promise((resolve, reject) => {
                let image = new Image();
                image.src = `img/${key}.png`;
    
                image.addEventListener("load", () => {
                    resolve({ img: image, name: key, coords: this.gameEntity[key].coords, });
                });
    
                image.addEventListener("error", () => {
                    reject(err);
                });
            }));

        }

        Promise.all(loadAll)
            .then(results => {

                for(let imgObj of results) {
                    this.gameEntity[imgObj.name].img = imgObj.img;
                }

                this.render(); 

            })
            .catch(err => console.log(err));
    },

    /**
     * Рендер изображений 
     */
    render() {
        requestAnimationFrame(() => {
            for(let key in this.gameEntity) {
                if (key === 'platform' && this.gameEntity[key].moveX) {

                    this.gameEntity.platform.coords[0] += this.gameEntity.platform.moveX;

                }

                if (key === 'block') {
                    
                    for(let coords of this.gameEntity[key].activeCoordsBlock) {
                        this.ctx.drawImage(this.gameEntity[key].img, ...coords); 
                    }
                    continue;
                    
                }

                this.ctx.drawImage(this.gameEntity[key].img, ...this.gameEntity[key].coords); 
            }
            // this.render();
        });
    },

    /** Запуск игры */
    start() {
        this.init();
        this.createCoordsBlock();
        this.preload();

    },

    /** Создает координаты для блоков */
    createCoordsBlock() {
        this.activeCoordsBlock = [];
        let positonBlocks = this.gameEntity.block.positonBlocks;
        let activeCoordsBlock = this.gameEntity.block.activeCoordsBlock;
        
        for(let i = 0; i <positonBlocks['1'].row; ++i) {
            for(let j = 0; j < positonBlocks['1'].col; ++j) {
                activeCoordsBlock.push([
                    64 * j + 65,
                    24 * i + 35,
                ]) 
            }
        }
    },

    /** Устанавливает обработку событий */
    setEvents() {
        /** событие движения */
        window.addEventListener('keydown', e => {
            if (e.code === 'ArrowLeft') {
                console.log('left',);
                this.gameEntity.platform.moveX = -this.gameEntity.platform.velocity;

            } else if (e.code === 'ArrowRight') {
                console.log('right',);
                this.gameEntity.platform.moveX = this.gameEntity.platform.velocity;

            }
        });

        /** событие остановки двжения */
        window.addEventListener('keyup', e => {
            if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
                console.log('stop',);
                this.gameEntity.platform.moveX = 0;

            }
        });
    }
};

window.addEventListener('load', () => {
    game.start();
});
