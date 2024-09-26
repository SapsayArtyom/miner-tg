import { Container, Sprite } from "pixi.js";

export default class Character extends Container {
    protected view: Sprite
    constructor() {
        super();

        this.init();
    }

    protected init() {
        this.view = this.addChild(Sprite.from('character'));
        this.view.anchor.set(0.5);
        this.view.scale.set(0.15);
    }
}