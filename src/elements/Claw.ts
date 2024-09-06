import gsap from "gsap";
import { Container, Graphics, Point, Polygon, Sprite, Texture } from "pixi.js";
import MainGame from "../core/MainGame";
import { getCirclePoints, getSpriteContour } from "../helpers/points";

export default class Claw extends Container {
    protected game: MainGame
    protected move: gsap.core.Tween
    protected direction: Point
    protected speed: number
    protected isPause = false
    protected collaider: Graphics
    protected contCollaider: Container
    public contourPoints: number[]
    
    public view: Sprite
    public isRevert = false
    public points: Point[]

    constructor() {
        super();
        this.game = MainGame.instance()
        this.speed = 9;
        this.init();
        this.startMove();
    }

    protected init(): void {
        this.view = this.addChild(Sprite.from('target_red'));
        this.view.anchor.set(0.5);
        this.contourPoints = getSpriteContour(this.view);
        this.view.hitArea = new Polygon(this.contourPoints);

        this.contCollaider = this.addChild(new Container({label: 'contCollaider'}));
        this.collaider = this.contCollaider.addChild(new Graphics);
        this.collaider.rect(0, 0, 1, 1);
        this.collaider.fill({
            color: 0xff0000,
            alpha: 0.4
        });
        this.collaider.position.set(0, 200)
        this.contCollaider.angle = 89;
        this.points = getCirclePoints(this.view.width / 2, 0, 0, 8);

        this.view.scale.set(0.4);
    }

    protected startMove(): void {
        this.move = gsap.to(this.contCollaider, {
            angle: -89,
            yoyo: true,
            repeat: -1,
            ease: 'none',
            duration: 1,
            onUpdate: () => {
                const point = this.collaider.getGlobalPosition();
                const pointStart = this.getGlobalPosition();
                this.view.position.set(
                    point.x - pointStart.x,
                    point.y - pointStart.y
                )
            }
        });
    }

    public start(): void {
        this.move.pause();
        this.direction = this.getPath();
    }
    
    public revert(isCatch: boolean): void {
        this.direction.x = -this.direction.x;
        this.direction.y = -this.direction.y;
        this.isRevert = true;
        if(isCatch) this.decriseSpeed();
    }

    public stop(): void {
        this.isRevert = false;
        this.incriseSpeed();
        this.move.resume();
    }

    public moveTo(): void {
        this.view.x += this.direction.x * this.speed;
        this.view.y += this.direction.y * this.speed;
    }

    protected decriseSpeed() {
        this.speed = 5;
    }
    
    protected incriseSpeed() {
        this.speed = 9;
    }

    protected getPath(): Point {
        // Определяем координаты начальной точки (точка A) и направление вектора
        let pointA = this.getGlobalPosition(); // Начальная позиция спрайта
        let pointB = this.collaider.getGlobalPosition(); // Направление движения

        let directionVector = {
            x: pointB.x - pointA.x,
            y: pointB.y - pointA.y
        };

        // Вычисляем длину (модуль) вектора направления
        let magnitude = Math.sqrt(directionVector.x ** 2 + directionVector.y ** 2);

        // Нормализуем вектор направления
        let normalizedVector = {
            x: directionVector.x / magnitude,
            y: directionVector.y / magnitude
        };

        return new Point(normalizedVector.x, normalizedVector.y);
    }

    public getStartPos(): Point {
        return new Point(this.collaider.getGlobalPosition().x, this.collaider.getGlobalPosition().y)
    }
}