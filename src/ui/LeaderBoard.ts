import { Container, Sprite, Text, Graphics } from "pixi.js";
import { EventEmitter } from "events";
import MainGame from "../core/MainGame";
import { config } from "../config";

export interface ILeaderboard {
    game: MainGame
}

export interface IScores extends IMyScore {
    _id?: string
    game?: string
    createdAt?: string
    updatedAt?: string
    __v?: number
}

export interface IMyScore {
    rank?: number
    top: number
    total: number
    userId: string
    nickName?: string
    lastName?: string
    firstName?: string
}

export default class LeaderBoard extends Container {
    protected game: MainGame
    protected _emitter: EventEmitter
    protected leaderBoardCont: Container
    protected boardCont: Container
    protected scoreCont: Container
    protected userId: string
    protected bg: Graphics
    protected labelBoard: Text

    constructor(option: ILeaderboard) {
        super();

        this.game = option.game;
        this._emitter = new EventEmitter();
        this.userId = this.game.getUsername();
        
        this.createBG();
        this.createBoard();

        this.visible = false;
    }

    get emitter() {
        return this._emitter;
    }

    protected createBG() {
        this.bg = new Graphics();
        this.bg.rect(0, 0, config.appWidth, config.appHeight);
        this.bg.fill({
            color: 0x101010,
            alpha: 0.8
        });
        this.bg.label = 'bg';
        this.addChild(this.bg);
    }

    protected createBoard() {
        this.leaderBoardCont = new Container();
        this.addChild(this.leaderBoardCont);

        this.boardCont = new Container({label: 'boardCont'});
        this.leaderBoardCont.addChild(this.boardCont);
        const board = Sprite.from('bg_scores');
        board.label = 'leaderBoard';
        const scaleSet = 904 / board.width;
        board.scale.set(scaleSet, scaleSet);
        this.boardCont.addChild(board);

        this.labelBoard = new Text({
            text: 'TOP SCORES',
            style: config.styles.topScore
        });
        this.labelBoard.position.set(
            (board.getBounds().width - this.labelBoard.getBounds().width) / 2,
            265
        )
        this.boardCont.addChild(this.labelBoard);
        
        this.scoreCont = new Container();
        this.scoreCont.label = 'scoreCont';
        this.scoreCont.y = 377;
        this.boardCont.addChild(this.scoreCont);

        this.boardCont.x = (config.appWidth - this.boardCont.getBounds().width) / 2;
        this.boardCont.y = Math.floor(config.appHeight - this.boardCont.getBounds().height + this.game.shift) / 2;

        const close = new Text({
            text: 'X',
            style: config.styles.close
        })
        close.label = 'close';
        close.interactive = true;
        close.x = (config.appWidth - close.width - 30);
        close.y = this.game.shift + 10;
        close.onclick = () => this.hide();
        close.ontap = () => this.hide();
        this.addChild(close);
    }

    protected showScores(score: IScores[]) {
        this.scoreCont.removeChildren();
        const scores = score;
        for (let i = 0; i < scores.length; i++) {
            if(i === 22) break;
            const element = scores[i];
            const lineScore = new Container();
            this.scoreCont.addChild(lineScore);
            const userName = element.nickName || this.getFullName(element.firstName, element.lastName)
            const fullName = this.truncateText(userName, 14);
            const name = new Text({
                text :`${element.rank ? element.rank : i+1}. ${fullName}`, 
                style: {
                    ...config.styles.score,
                    fill: element.userId === this.userId ? 0x90badf : 0xffffff,
                }
            });
            name.x = 55;
            lineScore.addChild(name);
            const score = new Text({
                text: `${element.top}`,
                style: {
                    ...config.styles.score,
                    fill: element.userId === this.userId ? 0x90badf : 0xffffff,
                }
            });
            score.x = this.boardCont.getBounds().width - score.width - 45;
            lineScore.addChild(score);
            lineScore.y = 108 * i;
        }
    }

    protected getFullName(firstName: string, lastName: string) {
        const fullName = `${firstName ? firstName : ""}${firstName && lastName ? " " : ""}${lastName ? lastName : ""}`;
        return fullName;
    }

    protected checkPosition(scores: IScores[], myscores: IMyScore): IScores[] {
        const check = scores.find(user => user.userId === myscores.userId);
        if (!check) scores.push({
            userId: myscores.userId, 
            nickName: myscores.nickName || this.getFullName(myscores.firstName, myscores.lastName), 
            total: myscores.total, 
            top: myscores.total,
            rank: myscores.rank
        });
        
        return scores;
    }

    protected truncateText(text: string, maxLength: number): string {
        if (text.length > maxLength) {
            return text.substring(0, maxLength - 3) + '...';
        } else {
            return text;
        }
    }

    async show() {
        this.game.showLoader();
        this.visible = true;
        const scores = await this.game.server.getLeaderboard();
        const myScores = await this.game.server.getMyScore(this.userId);
        this.game.hideLoader();
        const arrScores = this.checkPosition(scores, myScores);
        this.showScores(arrScores);
    }
    
    hide() {
        this.emitter.emit('start_screen');
        this.visible = false;
    }
}