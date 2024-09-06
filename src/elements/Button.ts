import { CanvasTextMetrics, Container, Graphics, Sprite, Text, TextStyleOptions, Texture } from "pixi.js";
import { config } from "../config";

export interface IButton {
    src?: string
    text?: string
    onClick?: () => void
    wButton?: number
    hButton?: number
    color?: number | string
    style?: TextStyleOptions
    context?: any
}

export default class Button extends Container {
    protected src: string
    protected text: string
    protected fun: () => void
    protected wButton: number
    protected hButton: number
    protected btn: Sprite | Graphics
    protected color: number | string
    protected style: TextStyleOptions
    protected context: any

    protected btnText: Text

    constructor(props: IButton) {
        super();

        this.label = 'btn';
        this.src = props.src;
        this.text = props.text;
        this.fun = props.onClick;
        this.wButton = props.wButton;
        this.hButton = props.hButton;
        this.color = props.color;
        this.style = props.style;
        this.context = props.context;

        this.create();
    }

    protected create() {
        if (this.src) {
            this.btn = Sprite.from(this.src);
        } else {
            this.btn = new Graphics();
            this.btn.rect(0, 0, this.wButton, this.hButton);
            this.btn.fill(this.color)
        }

        this.addChild(this.btn);

        if (this.text) {
            this.btnText = new Text({
                text: this.text,
                style: this.style || config.styles.base
            })

            // @ts-ignore
            this.btn.rect(0, 0, this.btnText.getBounds().width + 50, this.btnText.getBounds().height + 25);
            // @ts-ignore
            this.btn.fill(this.color);

            this.btnText.x = (this.width - this.btnText.getBounds().width) / 2;
            this.btnText.y = (this.height - this.btnText.getBounds().height) / 2;
            this.addChild(this.btnText);
        }

        if (this.fun) {
            this.eventMode = 'static';
            this.cursor = 'pointer';
            if (this.context) {
                this.on('pointerdown', this.fun, this.context);
            } else {
                this.on('pointerdown', this.fun);
            }
        }
    }

    public changeTexture(src: string) {
        this.btn.texture = Texture.from(src);
    }
    
    public changeText(str: string) {
        this.btnText.text = str;

        // @ts-ignore
        this.btn.rect(0, 0, this.btnText.getBounds().width + 50, this.btnText.getBounds().height + 25);
        // @ts-ignore
        this.btn.fill(this.color);
    }

    public updClick(fun: (val?: any) => void, context?: any) {
        if (this.context) {
            this.on('pointerdown', this.fun, this.context);
        } else {
            this.on('pointerdown', this.fun);
        }
    }
}