let game = {

    /** контекст канвас */
    ctx: null,

    /** Изображения игры */
    loadImgList: [
        { src: "img/background.png", coords: [0, 0] },
        { src: "img/ball.png", coords: [50, 50] },
        
    ],

    /** Инициализация */
    init() {
        this.ctx = document.getElementById("mycanvas").getContext("2d");
    },

    /** Загрузщик игровых объектов */
    preload() {

        let loadAll = this.loadImgList.map(loadInfo => new Promise((resolve, reject) => {
            let image = new Image();
            image.src = loadInfo.src;

            image.onload = () => {
                resolve({ img: image, coords: loadInfo.coords, });
            };
            image.onerror = (err) => {
                reject(err);
            };
        }));

        Promise.all(loadAll)
            .then(results => {
                this.render(results);  
            })
            .catch(err => console.log(err));
    },

    /** рендер изображений */
    render(imgList) {
        requestAnimationFrame(() => {
            for(let imgObj of imgList) {
                this.ctx.drawImage(imgObj.img, ...imgObj.coords); 
            }
        });
    },

    /** Запуск игры */
    start: function() {
        this.init();
        this.preload();
    }
};

window.addEventListener("load", () => {
    game.start();
});
