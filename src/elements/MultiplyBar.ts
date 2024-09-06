import { Container, Text } from "pixi.js";
import { config } from "../config";

export default class MultiplyBar extends Container {
    protected multi: number
    protected multiScore: number
    protected multiplyValue: Text
    protected multiplyLabel: Text

    constructor() {
        super({label: 'multiplier'});

        this.multi = 0;
        this.multiScore = 0;
        this.alpha = 0;
        
        this.init();
    }

    protected init(): void {
        this.multiplyValue = new Text({
            text: `${this.multi}x`,
            style: config.styles.multiply
        });
        this.addChild(this.multiplyValue);

        this.multiplyLabel = new Text({
            text: 'MULTIPLIER!',
            style: config.styles.multiply
        });
        this.multiplyLabel.y = this.multiplyValue.getBounds().bottom;
        this.addChild(this.multiplyLabel);
    }

    public updMultiply(value: number): void {
        this.multi += 1;
        if (this.multi > 1) {
            this.alpha = 1;
            this.multiScore = value;
            if (this.multi >= 9) this.multi = 9;
            this.multiplyValue.text = `${this.multi}x${this.multiScore}`;
            this.multiplyValue.x = this.multiplyLabel.width - this.multiplyValue.width;
        }
    }

    public reloadMultiply(): void {
        this.alpha = 0;
        this.multi = 0;
        this.multiScore = 0;
        this.multiplyValue.text = `${this.multi}x${this.multiScore}`;
    }

    public getMultiScore(): number {
        const value = this.multiScore * this.multi;
        return value;
    }

    public getMultiplayer(): number {
        return this.multi;
    }
}
