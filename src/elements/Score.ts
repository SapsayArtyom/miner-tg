import { Container, Sprite, Text } from "pixi.js";
import { config } from "../config";

export default class Score extends Container {

    protected wIcon: number;
    protected icon: Sprite;
    protected valueText: Text;

    constructor() {
        super({label: 'score'});

        this.wIcon = 115;
        this.creteScore();
    }

    protected creteScore(): void {

        if (this.icon) {
            this.icon = Sprite.from('score_icon');
            const k = this.wIcon / this.icon.width;
            this.icon.width = this.wIcon;
            this.icon.height = this.icon.height * k;
            this.addChild(this.icon);
        }

        this.valueText = new Text({
            text: '0', 
            style: config.styles.guiValue
        });
        this.valueText.x = this.icon ? this.icon.width + 15 : 0;
        this.addChild(this.valueText);
    }

    public updScore(amount: string): void {
        this.valueText.text = amount;
    }
}