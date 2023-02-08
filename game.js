let game = {

    /** контекст канвас */
    ctx: null,

    /** Изображения игры */
    loadImgList: [
        { name: "background", coords: [0, 0] },
        { name: "ball", coords: [0, 0, 20, 20, 320, 280, 20, 20] },
        { name: "platform", coords: [280, 300] },
        { name: "block", coords: [100, 100] },
    ],

    /** Расположение блоков */
    positonBlocks: {
        1: { row: 4, col: 8, },
    },

    /** массив с координатами блоков */
    activeCoordsBlock: [],

    /** Инициализация */
    init() {
        this.ctx = document.getElementById("mycanvas").getContext("2d");
    },

    /**
     * Загрузщик игровых объектов
     */
    preload() {

        let loadAll = this.loadImgList.map(loadInfo => new Promise((resolve, reject) => {
            let image = new Image();
            image.src = `img/${loadInfo.name}.png`;

            image.addEventListener("load", () => {
                resolve({ img: image, name: loadInfo.name, coords: loadInfo.coords, });
            });

            image.addEventListener("error", () => {
                reject(err);
            });
        }));

        Promise.all(loadAll)
            .then(results => {
                this.render(results);  
            })
            .catch(err => console.log(err));
    },

    /**
     * Рендер изображений 
     * @param {Array} imgList - массив объектов с изображениями
     */
    render(imgList) {
        requestAnimationFrame(() => {
            for(let imgObj of imgList) {

                if (imgObj.name === 'block') {
                    for(let coords of this.activeCoordsBlock) {
                        this.ctx.drawImage(imgObj.img, ...coords); 
                    }
                    continue;
                }

                this.ctx.drawImage(imgObj.img, ...imgObj.coords); 
            }
        });
    },

    /** Запуск игры */
    start: function() {
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
    }
};

window.addEventListener("load", () => {
    game.start();
});
