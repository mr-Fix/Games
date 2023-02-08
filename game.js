let game = {

    /** Инициализация */
    init() {
        this.ctx = document.getElementById("mycanvas").getContext("2d");
    },

    /** Загрузщик игровых объектов */
    preload() {
        let loadInfoList = [
            { src: "img/background.png", coords: [0,0] },
            { src: "img/ball.png", coords: [0,0] },
            
        ];

        let loadAll = loadInfoList.map(loadInfo => new Promise((resolve, reject) => {
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
                for(let imgObj of results) {
                    this.ctx.drawImage(imgObj.img, ...imgObj.coords); 
                }
            })
            .catch(err => console.log(err));
    },

    start: function() {
        

        let background = new Image();
        background.src = "img/background.png";
        background.onload = () => {
            this.ctx.drawImage(background, 0, 0);
        };

        let ball = new Image();
        ball.src = "img/ball.png";
        ball.onload = () => {
            this.ctx.drawImage(ball, 0, 0);
        };
    }
};

window.addEventListener("load", () => {
    game.start();
});
