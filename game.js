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
            /** родитель */
            parent: null,
            /** скорость передвижения */
            velocity: 3,
            /** движение Y */
            moveY: 0,
            /** движение X */
            moveX: 0,
            /** Чекер начала движения мяча */
            start: false,

            /**
             * Начало движения мяча
             * @param {number} moveX - число пикселей
             */
            startMove(moveX) {
                this.moveY = -this.velocity;
                // this.moveX = this.random(-this.velocity, this.velocity);
                this.moveX = moveX;
                this.start = true;
            },

            /**
             * Сдивигает мяч на moveX пикселей
             * @param {number} moveX - число пикселей
             */
            updateMoveX(moveX) {
                this.coords[4] += moveX;
            },

            /** Метод обновления местоположения */
            update() {

                if (this.moveY) {
                    this.coords[5] += this.moveY;
                } 

                if (this.moveX) {
                    this.coords[4] += this.moveX;
                }
            },

            /**
             * Проверяет столкновение мяча с блоками
             * @param {Array} block - массив с координатами блока
             * @returns 
             */
            collide(block, name) {
                let x = this.coords[4] + this.moveX;
                let y = this.coords[5] + this.moveY;
                if (
                    x + this.coords[2] > block[0]
                    && x < block[0] + this.parent[name].width
                    && y + this.coords[3] > block[1]
                    && y < block[1] + this.parent[name].height
                ) {
                    return true;
                } else {
                    return false;
                }
            },

            /**
             * Логика отскока после соприкосновения с блоком
             * @param {Array} block - массив с координатами блока
             * @returns 
             */
            bumpBlock(block) {
                // console.log('this => ', this);
                this.moveY *= -1;
            }
        },

        platform: { 
            img: null, 
            coords: [280, 300],
            /** родитель */
            parent: null,
            /** ширина */
            width: 100,
            /** высота */
            height: 14,
            /** скорость передвижения */
            velocity: 6,
            /** движение */
            moveX: 0,

            /** метод обновления местоположения */
            update(gameEntities) {
                
                if (this.moveX) {

                    this.coords[0] += this.moveX;

                    if (!gameEntities.ball.start) {
                        gameEntities.ball.updateMoveX(this.moveX);
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
            /** ширина */
            width: 64,
            /** высота */
            height: 24,
            /** Расположение блоков */
            positonBlocks: {
                1: { row: 4, col: 8, },
            },
            /** массив с координатами блоков */
            coordsBlock: [],
        },

    },

 
    /** Инициализация */
    init() {
        // перекрестные ссылки
        this.gameEntities.ball.parent = this.gameEntities;
        this.gameEntities.platform.parent = this.gameEntities;

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
            // обновление данных
            this.update();

            // сброс канвас
            this.ctx.clearRect(0, 0, this.gameParams.width, this.gameParams.height);

            // рендер новых обновленных изображений
            for(let key in this.gameEntities) {

                if (key === 'block') {
                    
                    for(let coords of this.gameEntities[key].coordsBlock) {
                        this.ctx.drawImage(this.gameEntities[key].img, ...coords); 
                    }
                    continue; 
                }

                this.ctx.drawImage(this.gameEntities[key].img, ...this.gameEntities[key].coords); 
            }

            // рекурсия
            this.render();
        });
    },

    /** Обновляет состояние игры */
    update() {
        this.gameEntities.platform.update(this.gameEntities);
        this.gameEntities.ball.update();

        for(let block of this.gameEntities.block.coordsBlock) {

            if (this.gameEntities.ball.collide(block, 'block')) {
                // console.log('Попали в блок!!!')
                this.gameEntities.ball.bumpBlock(block);
            }
        }

        if (this.gameEntities.ball.collide(this.gameEntities.platform.coords, 'platform')) {
            console.log('Столкновение!')
        }
    },

    /** Запуск игры */
    start() {
        this.init();
        this.createCoordsBlock();
        this.preload();

    },

    /** Создает координаты для блоков */
    createCoordsBlock() {
        this.coordsBlock = [];
        let positonBlocks = this.gameEntities.block.positonBlocks;
        let coordsBlock = this.gameEntities.block.coordsBlock;
        
        for(let i = 0; i < positonBlocks['1'].row; ++i) {
            for(let j = 0; j < positonBlocks['1'].col; ++j) {
                coordsBlock.push([
                    this.gameEntities.block.width * j + 65,
                    this.gameEntities.block.height * i + 35,
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

                this.gameEntities.ball.startMove( 
                    this.random( -this.gameEntities.ball.velocity, this.gameEntities.ball.velocity ) 
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
    },

    /**
     * Генерирует рандомное число в диапазоне от min до max
     * @param {number} min - минимально допустимое число
     * @param {number} max - максимально допустимое число
     */
    random(min, max) {
        return Math.floor( Math.random() * (max - min + 1) + min );
    }
};

window.addEventListener('load', () => {
    game.start();
});
