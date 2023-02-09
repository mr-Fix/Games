let game = {

    /** контекст канвас */
    ctx: null,

    /** параметры игры */
    gameParams: {
        width: 640,
        height: 360,
    },

    /** счетчик кол-ва сбитых блоков */
    score: 0,

    /** чекер запущенной игры */
    running: true,

    /** Объекты игры */
    gameEntities: {
        images:   {
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
                /** кадр анимации мяча */
                frame: 0,

                /**
                 * Начало движения мяча
                 * @param {number} moveX - число пикселей
                 */
                startMove(moveX) {
                    this.moveY = -this.velocity;
                    this.moveX = moveX;
                    this.start = true;

                    
                },

                /** запускает анимацию мяча */
                animate() {
                    setInterval(() => {
                        if (this.frame = 3) {
                            this.frame = 0;
                        } else {
                            ++this.frame;
                        }
                    }, 100);
                },
    
                /**
                 * Сдивигает мяч на moveX пикселей
                 * @param {number} moveX - число пикселей
                 */
                updateMoveX(moveX) {
                    this.coords[4] += moveX;
                },
    
                /** Метод обновления */
                update() {
    
                    if (this.moveY) {
                        this.coords[5] += this.moveY;
                    } 
    
                    if (this.moveX) {
                        this.coords[4] += this.moveX;
                    }
    
                    for(let block of this.parent.gameEntities.images.block.coordsBlock) {

                        if (!block[2]) { continue; }

                        if (this.collide(block, 'block')) { 

                            this.parent.gameEntities.sounds.bump.sound.play();
                            
                            this.bumpBlock(block);

                            this.parent.addScore();
                        }
                    }
                    // обновление кадра мяча
                    this.coords[0] = this.frame * this.coords[2];

                    // проверка столкновения со стенами
                    this.collideWorldBounds();
    
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
                        && x < block[0] + this.parent.gameEntities.images[name].width
                        && y + this.coords[3] > block[1]
                        && y < block[1] + this.parent.gameEntities.images[name].height
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                },
    
                /**
                 * Проверяет столкновение мяча со стенами  */
                collideWorldBounds() {
                    let x = this.coords[4] + this.moveX;
                    let y = this.coords[5] + this.moveY;
    
                    // параметры мяча
                    let ballLeft = x;
                    let ballRight = ballLeft + this.coords[2];
                    let ballTop = y;
                    let ballBottom = ballTop + this.coords[3];
    
                    // параметры мира
                    let worldLeft = 0;
                    let worldRight = this.parent.gameParams.width;
                    let worldTop = 0;
                    let worldtBottom = this.parent.gameParams.height;
    
                    if (ballLeft < worldLeft) {

                        this.parent.gameEntities.sounds.bump.sound.play();
                        this.moveX = this.velocity;

                    } else if (ballRight > worldRight) {
                        this.parent.gameEntities.sounds.bump.sound.play();
                        this.moveX = - this.velocity;

                    } else if (ballTop < worldTop) {

                        this.parent.gameEntities.sounds.bump.sound.play();
                        this.moveY = this.velocity;

                    } else if (ballBottom > worldtBottom) {

                        this.parent.reloadGame('Вы проиграли!');
                    }
                },
    
                /**
                 * Логика отскока после соприкосновения с блоком
                 * @param {Array} block - массив с координатами блока
                 * @returns 
                 */
                bumpBlock(block) {
                    this.moveY *= -1;
    
                    block[2] = false;
                },
    
                /**
                 * Логика отскока после соприкосновения с платформой */
                bumpPlatform() {
    
                    if (this.parent.gameEntities.images.platform.moveX > 0) {
                        this.coords[4] += this.parent.gameEntities.images.platform.moveX;
                    }
    
                    if (this.moveY > 0) { 
    
                        this.moveY = -this.velocity;
        
                        let touchX = this.coords[4] + this.coords[2] / 2;
        
                        this.moveX = this.velocity * this.parent.gameEntities.images.platform.getTouchOffset(touchX);
                    }
    
                },
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
                update() {
                    
                    if (this.moveX && !this.collideWorldBounds()) {
    
                        this.coords[0] += this.moveX;
    
                        if (!this.parent.gameEntities.images.ball.start) {
                            this.parent.gameEntities.images.ball.updateMoveX(this.moveX);
                        }
    
                    }
    
                    if (this.parent.gameEntities.images.ball.collide(this.coords, 'platform')) {
                        this.parent.gameEntities.sounds.bump.sound.play();
    
                        this.parent.gameEntities.images.ball.bumpPlatform();
                    }
    
                    // проверка на столкновение со стенами
                    // this.collideWorldBounds();
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
    
                /** метод определяет область касания мяча по платформе
                 * @param {Number} - центр мяча при касании
                 */
                getTouchOffset(touchX) {
                    let offset = touchX - this.coords[0];
                    return (2 * offset / this.width) - 1;
                },
    
                /** Проверяет столкновение платформы со стенами  */
                collideWorldBounds() {
                    let platformLeft = this.coords[0] + this.moveX;
                    let platformRight = this.coords[0] + this.width + this.moveX;
    
                    if (platformLeft < 0) {
    
                        this.coords[0] = 0;
                        return true;
    
                    } else if (platformRight > this.parent.gameParams.width) {
    
                        this.coords[0] = this.parent.gameParams.width - this.width;
                        return true;
    
                    }
                    return false;
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

        sounds: {
            bump: { sound: null },
        },
    },
  

    /** Следит за счетом очков */
    addScore() {
        ++this.score;

        if (this.score >= this.gameEntities.images.block.coordsBlock.length) {
            this.reloadGame('Вы выиграли!');
        }
    },
 
    /** Останавливает игру и перезапускает  
     * @param {String} message - строка сообщение
     */
    reloadGame(message) {
        this.running = false;
        alert(message);
        window.location.reload();
    },

    /** Инициализация */
    init() {
        // перекрестные ссылки
        this.gameEntities.images.ball.parent = this;
        this.gameEntities.images.platform.parent = this;

        this.ctx = document.getElementById("mycanvas").getContext("2d");
        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "#fff";
        this.setEvents();
    },

    /**
     * Загрузщик игровых объектов
     */
    preload() {
        this.loadImages();
        Promise.all([ this.loadImages(), this.loadSounds(), ])
            .then(results => {
                this.render(); 
            })
            .catch(err => console.log(err));

    },

    /** Загрузщик изображений */
    loadImages() {
        let loadAll = [];

        for (let key in this.gameEntities.images) {

            loadAll.push(new Promise((resolve, reject) => {
                let image = new Image();
                image.src = `img/${key}.png`;
    
                image.addEventListener("load", () => {
                    resolve({ img: image, name: key, coords: this.gameEntities.images[key].coords, });
                });
    
                image.addEventListener("error", () => {
                    reject(err);
                });
            }));

        }
        return new Promise((resolve, reject) => {
            Promise.all(loadAll)
                .then(results => {
    
                    for(let imgObj of results) {
                        this.gameEntities.images[imgObj.name].img = imgObj.img;
                    }
                    resolve();
                    // this.render(); 
    
                })
                .catch(err => reject(err));
        });
        
    },

    /** Загрузщик звуков */
    loadSounds() {
        let loadAll = [];

        for (let key in this.gameEntities.sounds) {

            loadAll.push(new Promise((resolve, reject) => {
                let audio = new Audio();
                audio.src = `sounds/${key}.mp3`;
    
                audio.addEventListener(
                    "canplaythrough", 
                    () => { resolve({ sound: audio, name: key, }); },
                    { once: true }
                );
    
                audio.addEventListener("error", () => {
                    reject(err);
                });
            }));

        }
        return new Promise((resolve, reject) => {
            Promise.all(loadAll)
                .then(results => {
                    for(let soundObj of results) {
                        this.gameEntities.sounds[soundObj.name].sound = soundObj.sound;
                    }
                    resolve();
                })
                .catch(err => reject(err));
        });
        
    },
    /**
     * Рендер изображений 
     */
    render() {
        if (!this.running) { return; }

        requestAnimationFrame(() => {
            // обновление данных
            this.update();

            // сброс канвас
            this.ctx.clearRect(0, 0, this.gameParams.width, this.gameParams.height);

            // рендер новых обновленных изображений
            for(let key in this.gameEntities.images) {

                if (key === 'block') {
                    
                    for(let coords of this.gameEntities.images[key].coordsBlock) {
                        if (!coords[2]) { continue }
                        this.ctx.drawImage(this.gameEntities.images[key].img, coords[0], coords[1]); 
                    }
                    continue; 
                }

                this.ctx.drawImage(this.gameEntities.images[key].img, ...this.gameEntities.images[key].coords); 
            }
            this.ctx.fillText(`Счет: ${this.score}`, 15, 20);
            // рекурсия
            this.render();
        });
    },

    /** Обновляет состояние игры */
    update() {
        this.gameEntities.images.platform.update();
        this.gameEntities.images.ball.update();
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
        let positonBlocks = this.gameEntities.images.block.positonBlocks;
        let coordsBlock = this.gameEntities.images.block.coordsBlock;
        
        for(let i = 0; i < positonBlocks['1'].row; ++i) {
            for(let j = 0; j < positonBlocks['1'].col; ++j) {
                coordsBlock.push([
                    this.gameEntities.images.block.width * j + 65,
                    this.gameEntities.images.block.height * i + 35,
                    true,
                ]) 
            }
        }
    },

    /** Устанавливает обработку событий */
    setEvents() {
        /** событие движения */
        window.addEventListener('keydown', e => {
            if (e.code === 'Space') {

                this.gameEntities.images.ball.startMove( 
                    this.random( -this.gameEntities.images.ball.velocity, this.gameEntities.images.ball.velocity ) 
                );

            } else if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
    
                this.gameEntities.images.platform.move(e.code);
            } 
        });

        /** событие остановки двжения */
        window.addEventListener('keyup', e => {
            if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
                
                this.gameEntities.images.platform.stopMove();
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
