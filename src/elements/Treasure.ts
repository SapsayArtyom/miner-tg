import { Container, Point, Polygon, Sprite } from "pixi.js";
import { getCirclePoints } from "../helpers/points";

export default class Treasure extends Container {
    public view: Sprite
    public contourPoints: number[]
    public points: Point[]

    constructor() {
        super();

        this.init();
    }

    protected init() {
        const rand = Math.random() * 0.5 + 0.5;
        this.view = this.addChild(Sprite.from('target_yellow'));
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
        
        this.view.scale.set(rand);
    }

    // protected getCirclePoints(radius: number, centerX: number, centerY: number, numPoints: number): Point[] {
    //     const points = [];
    //     const angleStep = 360 / numPoints; // Угловое смещение между точками
    
    //     for (let i = 0; i < numPoints; i++) {
    //         const angleInRadians = (i * angleStep) * (Math.PI / 180); // Переводим угол в радианы
    //         const x = centerX + radius * Math.cos(angleInRadians);
    //         const y = centerY + radius * Math.sin(angleInRadians);
    //         points.push(new Point(x, y));
    //     }
    //     console.log('points ::', points);
        
    //     return points;
    // }
}