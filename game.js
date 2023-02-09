let game = {

    /** контекст канвас */
    ctx: null,

    /** Изображения игры */
    imgList: {
        background: { img: null, coords: [0, 0] },
        ball: { img: null, coords: [0, 0, 20, 20, 320, 280, 20, 20] },
        platform: { img: null, coords: [280, 300] },
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

        for (let key in this.imgList) {

            loadAll.push(new Promise((resolve, reject) => {
                let image = new Image();
                image.src = `img/${key}.png`;
    
                image.addEventListener("load", () => {
                    resolve({ img: image, name: key, coords: this.imgList[key].coords, });
                });
    
                image.addEventListener("error", () => {
                    reject(err);
                });
            }));

        }

        Promise.all(loadAll)
            .then(results => {

                for(let imgObj of results) {
                    this.imgList[imgObj.name].img = imgObj.img;
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
            for(let key in this.imgList) {

                if (key === 'block') {

                    for(let coords of this.imgList[key].activeCoordsBlock) {
                        this.ctx.drawImage(this.imgList[key].img, ...coords); 
                    }

                    continue;
                }

                this.ctx.drawImage(this.imgList[key].img, ...this.imgList[key].coords); 
            }
        });
        // this.render();
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

        for(let i = 0; i < this.positonBlocks['1'].row; ++i) {
            for(let j = 0; j < this.positonBlocks['1'].col; ++j) {
                this.activeCoordsBlock.push([
                    64 * j + 65,
                    24 * i + 35,
                ]) 
            }
        }
    },

    /** Устанавливает обработку событий */
    setEvents() {
        window.addEventListener('keydown', e => {
            if (e.code === 'ArrowLeft') {
                console.log('left',);

            } else if (e.code === 'ArrowRight') {
                console.log('right',);

            }
        })
    }
};

window.addEventListener('load', () => {
    game.start();
});
