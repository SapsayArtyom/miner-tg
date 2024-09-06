import { Container, Sprite } from "pixi.js";

export default class Miner extends Container {
    protected view: Sprite
    constructor() {
        super();

        this.init();
    }

    protected init() {
        this.view = this.addChild(Sprite.from('target_green'));
        this.view.anchor.set(0.5);
    }
}