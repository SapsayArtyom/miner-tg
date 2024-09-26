import { Container, Point, Polygon, Sprite } from "pixi.js";
import { getCirclePoints, getRandomInt } from "../helpers/points";

export default class Treasure extends Container {
    public view: Sprite
    public contourPoints: number[]
    public points: Point[]

    constructor() {
        super();

        this.init();
    }

    protected init() {
        this.view = this.addChild(Sprite.from('gold'));
        this.view.anchor.set(0.5);
        const quarter = this.view.width / 8;
        
        const arr = [
            this.view.width / 2, 0,
            quarter * 6, quarter,
            this.view.width, this.view.height / 2,
            quarter * 6, quarter * 6,
            this.view.width / 2, this.view.height,
            quarter, quarter * 6,
            0, this.view.height / 2,
            quarter, quarter
        ];
        this.contourPoints = arr.map(item => item - this.view.width / 2);
        this.points = getCirclePoints(this.view.width / 2, 0, 0, 8);
        this.view.hitArea = new Polygon(this.contourPoints);

        const randW = getRandomInt(110, 160);
        const sc = randW / this.view.width;
        
        this.view.scale.set(sc);
    }
}