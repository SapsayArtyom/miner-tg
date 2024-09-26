import { Container, Sprite } from "pixi.js";
import Character from "./Character";
import Claw from "./Claw";

export default class Miner extends Container {
    protected view: Character;
    protected claw: Claw;

    constructor() {
        super();

        this.init();
    }

    protected init() {
        this.view = this.addChild(new Character());
        const handle = this.addChild(Sprite.from('claw_handle'));
        handle.scale.set(0.4);
        handle.anchor.set(0.5);
        handle.position.y = 20;

        this.claw = this.addChild(new Claw());
    }

    public getClaw() {
        return this.claw;
    }
}