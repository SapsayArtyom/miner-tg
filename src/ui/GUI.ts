import { Container, Text } from "pixi.js";
import { EventEmitter } from "events";

import Score from "../elements/Score";
import SoundManager, { soundState } from "../managers/SoundManager";
import Timer from "../elements/Timer";
import { config } from "../config";
import MultiplyBar from "../elements/MultiplyBar";

export default class GUI extends Container {
    
    protected _emitter: EventEmitter
    protected score: Score
    protected soundManager: SoundManager
    protected multiplayerBar: MultiplyBar
    protected timer: Timer
    protected soundLabel: Text
    protected totalScore: number
    protected multiplyScore: number
    protected series: number

    protected padding = 50;

    constructor() {
        super({label: 'GUI'});

        this.totalScore = 0;
        this.multiplyScore = 0;
        this.series = 0;
        this._emitter = new EventEmitter();

        this.init();
    }

    get emitter() {
        return this._emitter;
    }

    protected init(): void {
        this.addScore();
        this.addSound();
        this.addTimer();
        this.addMultiplayer();
    }

    protected addScore(): void {
        const scoreLabel = new Text({
            text: 'SCORE',
            style: config.styles.guiLabel
        });
        scoreLabel.x = config.appWidth - scoreLabel.width - this.padding;
        this.addChild(scoreLabel);

        this.score = new Score();
        this.score.x = config.appWidth - this.score.width - this.padding;
        this.score.y = scoreLabel.getBounds().bottom;
        this.addChild(this.score);
    }

    protected addMultiplayer(): void {
        this.multiplayerBar = new MultiplyBar();
        this.multiplayerBar.x = config.appWidth - this.multiplayerBar.width - this.padding;
        this.multiplayerBar.y = this.score.getBounds().bottom;

        this.addChild(this.multiplayerBar);
    }

    protected addTimer(): void {
        const timerLabel = new Text({
            text: 'TIMER',
            style: config.styles.guiLabel
        });
        timerLabel.x = (config.appWidth - timerLabel.width) / 2;
        this.addChild(timerLabel);

        this.timer = new Timer();
        this.timer.x = (config.appWidth - this.timer.width) / 2;
        this.timer.y = timerLabel.getBounds().bottom;
        this.addChild(this.timer);
    }

    protected addSound(): void {
        this.soundLabel = new Text({
            text: 'sound off'.toUpperCase(),
            style: config.styles.guiLabel
        });
        this.soundLabel.x = this.padding;
        this.addChild(this.soundLabel);

        this.soundManager = new SoundManager();
        this.soundManager.position.set(
            this.soundManager.x = (this.soundLabel.width - this.soundManager.width) / 2 + this.padding,
            this.soundLabel.getBounds().bottom
        );
        this.addChild(this.soundManager);

        this.soundManager.emitter.on('toggle_sound', () => this.updSound())
    }
    
    protected updSound(): void {
        this.soundLabel.text = `sound ${soundState[+!config.mute]}`.toUpperCase();
    }

    public changeSound(): void {
        this.soundManager.toggleSound();
    }
    
    public startTimer(): void {
        this.timer.countdownTimer(config.durationRound, () => this.emitter.emit('finish_timer'))
    }

    public shot(value: number) {
        if(value > 0) {
            this.multiplyScore += value;
            this.multiplayerBar.updMultiply(this.multiplyScore);
            const multi = this.multiplayerBar.getMultiplayer();
            multi === 1 ? this.updScore(value) : null;
        } else this.updMultiplyScore()
    }

    public updMultiplyScore() {
        const multiScore = this.multiplayerBar.getMultiScore();
        this.updScore(multiScore);
        this.multiplyScore = 0;
        this.multiplayerBar.reloadMultiply();
    }

    public updScore(value: number): void {
        this.totalScore += value;
        this.score.updScore(this.totalScore.toString());
        this.score.x = config.appWidth - this.score.width - this.padding;
    }

    public getScore(): number {
        return this.totalScore;
    }

    public restart() {
        this.totalScore = 0;
        this.multiplyScore = 0;
        this.series = 0;
    }
}