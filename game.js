let game = {

    /** контекст канвас */
    ctx: null,
    /** параметры игры */
    gameParams: {
        width: 640,
        height: 360,
    },

    /** Объекты игры */
    gameEntities: {
        background: { img: null, coords: [0, 0] },
        ball: { 
            img: null, 
            coords: [0, 0, 20, 20, 320, 280, 20, 20],
            /** скорость передвижения */
            velocity: 3,
            /** движение */
            moveY: 0,
            /** Чекер начала движения мяча */
            start: false,

            /**
             * Сдивигает мяч на moveX пикселей
             */
            startMove() {
                this.moveY = -this.velocity;
                this.start = true;
            },

            /**
             * Сдивигает мяч на moveX пикселей
             * @param {number} moveX - число пикселей
             */
            moveX(moveX) {
                this.coords[4] += moveX;
            },

            /** Метод обновления местоположения */
            update() {
                if (this.moveY) {
                    this.coords[5] += this.moveY

                }
            },
        },

        platform: { 
            img: null, 
            coords: [280, 300],
            /** скорость передвижения */
            velocity: 6,
            /** движение */
            moveX: 0,

            /** метод обновления местоположения */
            update(gameEntities) {
                
                if (this.moveX) {

                    this.coords[0] += this.moveX;

                    if (!gameEntities.ball.start) {
                        gameEntities.ball.moveX(this.moveX);
                    }

                }
            },

            /**
             * Обрабатывает события движения
             * @param {string} typeEvent - тип события (код кнопки)
             */
            move(typeEvent) {

                this.moveX = typeEvent === 'ArrowLeft' ? -this.velocity : this.velocity;
            },

            /** Останавливает движение */
            stopMove() {

                this.moveX = 0;
            },
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

        for (let key in this.gameEntities) {

            loadAll.push(new Promise((resolve, reject) => {
                let image = new Image();
                image.src = `img/${key}.png`;
    
                image.addEventListener("load", () => {
                    resolve({ img: image, name: key, coords: this.gameEntities[key].coords, });
                });
    
                image.addEventListener("error", () => {
                    reject(err);
                });
            }));

        }

        Promise.all(loadAll)
            .then(results => {

                for(let imgObj of results) {
                    this.gameEntities[imgObj.name].img = imgObj.img;
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
            this.update();
            this.ctx.clearRect(0, 0, this.gameParams.width, this.gameParams.height);

            for(let key in this.gameEntities) {

                if (key === 'block') {
                    
                    for(let coords of this.gameEntities[key].activeCoordsBlock) {
                        this.ctx.drawImage(this.gameEntities[key].img, ...coords); 
                    }
                    continue; 
                }

                this.ctx.drawImage(this.gameEntities[key].img, ...this.gameEntities[key].coords); 
            }
            this.render();
        });
    },

    /** Обновляет состояние игры */
    update() {
        this.gameEntities.platform.update(this.gameEntities);
        this.gameEntities.ball.update();

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
        let positonBlocks = this.gameEntities.block.positonBlocks;
        let activeCoordsBlock = this.gameEntities.block.activeCoordsBlock;
        
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
            console.log('code => ', e.code);
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
};

window.addEventListener('load', () => {
    game.start();
});
