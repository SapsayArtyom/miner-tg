import { Container, Ticker, Sprite } from "pixi.js";
import { EventEmitter } from "events";
import { sound } from '@pixi/sound';

import MainGame from './MainGame';
import StartScreen from "../ui/StartScreen";
import LeaderBoard from "../ui/LeaderBoard";
import GUI from "../ui/GUI";
import FinalPopup from "../ui/FinalPopup";
import PlayScene from "../ui/PlayScene";
import cursorImage from '../assets/cursor.png';


export default class MainScene extends Container {

    protected game: MainGame
    protected _emitter: EventEmitter
    protected startScreen: StartScreen
    protected leaderboard: LeaderBoard
    protected finalPopup: FinalPopup
    protected gui: GUI;
    protected playScene: PlayScene
    protected ticker: Ticker

    protected mainContainer: Container
    protected currentSound: string

    constructor() {
        super({label: 'MainScene'});

        this.game = MainGame.instance();
        this.ticker = new Ticker();
        this.mainContainer = this.game.mainContainer;
        this._emitter = new EventEmitter();

        this.currentSound = '';

        this.init();
    }

    public get emitter() {
        return this._emitter;
    }

    protected init() {
        this.createBackground();

        this.createGUI();
        this.createPlayScene();

        // this.createStartScreen();
        // this.createLeaderBoard();
        // this.createPopup();
    }

    protected createBackground() {
        const bg = Sprite.from('bg');
        bg.label = 'background';
        bg.width = this.game.app.screen.width;
        bg.height = this.game.app.screen.height;
        this.mainContainer.addChild(bg);
    }

    createStartScreen() {
        this.startScreen = new StartScreen();
        this.mainContainer.addChild(this.startScreen);
        this.startScreen.emitter.on('countdown', () => {
            this.gui.startTimer();
            this.playScene.interactiveChildren = true;
            this.startScreen.hide();
        });

        this.startScreen.emitter.on('leaderboard', () => {
            this.startScreen.hide();
            this.leaderboard.show();
        });
        
        this.startScreen.emitter.on('btn_sound', () => {
            this.gui.changeSound();
        });
    }

    createLeaderBoard() {
        this.leaderboard = new LeaderBoard({
            game: this.game
        });
        this.leaderboard.hide();
        this.mainContainer.addChild(this.leaderboard);

        this.leaderboard.emitter.on('start_screen', () => {
            this.startScreen.show();
        });
    }

    protected createGUI() {
        this.gui = new GUI();
        this.mainContainer.addChild(this.gui);
        this.gui.y = this.game.shift;
        this.gui.emitter.on('finish_timer', () => this.restartGame());
    }

    createPopup() {
        this.finalPopup = new FinalPopup({
            onClick: () => this.startScreen.show()
        })
        this.mainContainer.addChild(this.finalPopup);
    }

    createPlayScene() {
        this.playScene = new PlayScene();
        this.mainContainer.addChild(this.playScene);

        // this.playScene.arrTargets.forEach(item => {
        //     item.emitter.on('hit', (obj) => {
        //         this.gui.shot(obj.value);
        //     })
        // });

        // this.playScene.emitter.on('hit', (obj) => {
        //     this.gui.shot(obj.value);
        // })

        // this.playScene.bullets.emitter.on('reload_bullets', () => {
        //     this.gui.updMultiplyScore();
        //     this.playScene.reloadBullets();
        //     sound.play('reload');

        // });
    }

    protected async restartGame() {
        this.game.showLoader();
        // this.playScene.interactiveChildren = false;
        this.gui.updMultiplyScore();
        const totalScore = this.gui.getScore();
        await this.game.server.setMyScore({
            userId: this.game.getUsername(),
            score: totalScore
        });
        const myScores = await this.game.server.getMyScore(this.game.getUsername());
        this.finalPopup.update(totalScore, myScores.top);
        this.finalPopup.show();

        this.game.hideLoader();
        // this.playScene.bullets.reloadBullets();
        this.gui.restart();
    }
}