import MainGame from './core/MainGame';
new class Main {
    protected game: MainGame;
    protected initialization: boolean;

    constructor() {
        this.initialization = false;
        this.initGame();
    }

    async initGame() { 
        this.game = MainGame.instance({
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
        });
    }
};