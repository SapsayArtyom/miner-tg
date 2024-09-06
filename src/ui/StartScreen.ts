import { Container, Graphics, Sprite, Text, TextStyleOptions, Texture } from "pixi.js";
import { EventEmitter } from "events";
import Button from "../elements/Button";
import { config } from "../config";
import MainGame from "../core/MainGame";
import { soundState } from "../managers/SoundManager";

export default class StartScreen extends Container {

    protected game: MainGame
    protected _emitter: EventEmitter
    protected bg: Graphics
    protected turnSound: Text

    protected btnYes: Button
    protected btnNo: Button
    protected btnStart: Button
    protected btnScore: Button

    protected screenContainer: Container
    protected soundContainer: Container
    protected btnCont: Container
    
    constructor() {
        super();

        this.game = MainGame.instance()
        this.label = 'startScreen';
        this._emitter = new EventEmitter();

        this.init();
    }

    public get emitter() {
        return this._emitter;
    }

    protected init() {
        this.bg = new Graphics();
        this.bg.rect(0, 0, config.appWidth, config.appHeight);
        this.bg.fill({
            color: 0x101010,
            alpha: 0.8
        });
        this.bg.label = 'bg';
        this.addChild(this.bg);

        this.screenContainer = new Container();
        this.screenContainer.label = 'screenContainer';
        this.addChild(this.screenContainer);    

        this.soundContainer = new Container();
        this.screenContainer.addChild(this.soundContainer);

        this.turnSound = new Text({
            text:'Turn Sound On?'.toUpperCase(), 
            style: config.styles.startSound
        });
        this.turnSound.position.y = 0;
        this.soundContainer.addChild(this.turnSound);
        this.turnSound.x = (this.width - this.turnSound.width) / 2;

        const btnSounds = new Container({label: 'btnSounds'});
        this.soundContainer.addChild(btnSounds);

        this.btnYes = new Button({
            src: `btn_yes_${soundState[+!config.mute]}`,
            onClick: () => this.btnSoundClick()
        });
        this.btnYes.position.y = this.turnSound.getBounds().bottom + 50
        btnSounds.addChild(this.btnYes); 

        this.btnNo = new Button({
            src: `btn_no_${soundState[+config.mute]}`,
            onClick: () => this.btnSoundClick()
        });
        this.btnNo.interactive = !config.mute;
        this.btnNo.position.y = this.turnSound.getBounds().bottom + 50
        this.btnNo.x = this.btnYes.getBounds().width + 50;
        btnSounds.addChild(this.btnNo);

        btnSounds.position.x = (this.width - btnSounds.width) / 2;
        
        this.btnCont = new Container();
        this.screenContainer.addChild(this.btnCont);

        this.btnStart = new Button({
            text: 'START',
            style: config.styles.startScreen,
            color: config.btnColor,
            wButton: 600,
            hButton: 150,
            onClick: () => {
                this.interactiveChildren = false;
                this.emitter.emit('countdown');
            }
        });
        this.btnCont.addChild(this.btnStart);

        this.btnScore = new Button({
            text: 'SCORE',
            style: config.styles.startScreen,
            color: config.btnColor,
            wButton: 600,
            hButton: 150,
            onClick: () => this.emitter.emit('leaderboard')
        });
        this.btnScore.y = this.btnScore.y + this.btnScore.height + 75;
        this.btnCont.addChild(this.btnScore);

        this.btnCont.x = (this.width - this.btnCont.width) / 2;
        this.btnCont.y = this.soundContainer.getBounds().bottom + 200;

        this.screenContainer.y = (config.appHeight - this.screenContainer.height + this.game.shift) / 2;
    }

    public hide() {
        this.visible = false;
        this.interactiveChildren = false;
    }

    public show() {
        this.updBtnSoundTexture();
        this.visible = true;
        this.interactiveChildren = true;
    }

    protected btnSoundClick() {
        // this.game.scene.soundManager.toggleSound();
        this.emitter.emit('btn_sound');
        this.updBtnSoundTexture();
    }

    protected updBtnSoundTexture() {
        this.btnYes.changeTexture(`btn_yes_${soundState[+!config.mute]}`);
        this.btnNo.changeTexture(`btn_no_${soundState[+config.mute]}`);

        this.btnYes.interactive = config.mute;
        this.btnNo.interactive = !config.mute;
    }
}