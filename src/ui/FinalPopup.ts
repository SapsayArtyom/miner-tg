import { Container, Graphics, Sprite, Text } from "pixi.js";
import MainGame from "../core/MainGame";
import { config } from "../config";

export interface IFinalyPopup {
    onClick: () => void
}

export default class FinalPopup extends Container {
    protected game: MainGame
    protected textScore: Text
    protected textTopScore: Text
    protected close: Text

    constructor(props: IFinalyPopup) {
        super();

        this.game = MainGame.instance();
        this.visible = false;

        this.create();

        this.close.on('pointerdown', () => {
            this.visible = false;
            props.onClick();        
        })
    }

    create() {
        const tint = new Graphics();
        tint.roundRect(0, 0, config.appWidth, config.appHeight);
        tint.fill({
            color: 0x101010,
            alpha: 0.8
        });
        this.addChild(tint);

        const back = new Graphics();
        back.roundRect(0, 0, 900, 600);
        back.fill(0x000000);
        back.position.set(
            (config.appWidth - back.width) / 2,
            (config.appHeight - back.height) / 2
        );
        this.addChild(back);

        const textCont = new Container();
        this.addChild(textCont);

        this.textTopScore = new Text({
            text: `top score: 0`,
            style: config.styles.finalTop
        });
        this.textTopScore.x = (this.width - this.textTopScore.width) / 2;
        textCont.addChild(this.textTopScore);
        
        this.textScore = new Text({
            text: `score: 0`,
            style: config.styles.finalScore
        });
        this.textScore.x = (this.width - this.textScore.width) / 2;
        this.textScore.y = this.textTopScore.getBounds().bottom + 35;
        textCont.addChild(this.textScore);

        textCont.y = (this.height - textCont.height) / 2;

        this.close = new Text({
            text: 'X',
            style: config.styles.close
        });
        this.close.x = back.getBounds().right - this.close.width - 40;
        this.close.y = back.getBounds().top;
        this.addChild(this.close);

        this.close.cursor = 'pointer'
        this.close.eventMode = 'static';
    }

    public update(score: number, topScore: number) {
        this.textTopScore.text = `top score: ${topScore}`;
        this.textTopScore.x = (this.width - this.textTopScore.width) / 2;

        this.textScore.text = `score: ${score}`;
        this.textScore.x = (this.width - this.textScore.width) / 2;
    }

    public show() {
        this.visible = true;
    }
}