import { Container, Graphics, Point, Polygon, Sprite, Text } from "pixi.js";
import { config } from "../config";
// import Target from "../elements/Target";
// import Bullets from "../elements/Bullets";
import { EventEmitter } from "events";
import gsap from "gsap";
import { sound } from '@pixi/sound';
import Character from "../elements/Character";
import Treasure from "../elements/Treasure";
import Claw from "../elements/Claw";
import Button from "../elements/Button";
import MainGame from "../core/MainGame";
import { getGlobal, getRandomItemIndex } from "../helpers/points";
import Miner from "../elements/Miner";

export default class PlayScene extends Container {
    public arrTreasure: Treasure[];

    protected arrPosY: number[];
    protected arrPositions: Point[];
    protected miner: Miner;
    // protected miner: Character
    protected claw: Claw;
    protected clawCollaider: Graphics;
    protected arrCollaiders: Graphics[];
    protected game: MainGame;
    protected startPos: Point;
    protected catchItem: Treasure;
    protected btn: Button;
    protected btnRestart: Button;
    protected treasureCont: Container;

    protected _emitter: EventEmitter;

    constructor() {
        super({label: 'PlayScene'});

        this.game = MainGame.instance();
        this.arrPosY = [0, 200, 400, 600, 800, 1000];
        this.startPos = null;
        this._emitter = new EventEmitter();
        this.arrCollaiders = [];
        this.catchItem = null;

        const tint = this.addChild(new Graphics({label: 'tint'}));
        tint.rect(0, 0, config.appWidth, config.appHeight);
        tint.fill({
            color: 0xff00ff,
            alpha: 0.004
        });


        this.init();
        this.setPositions( 100, config.appWidth - 50, 200);
        this.addTreasure();
        this.addCollaiders();
        this.addBtn();
    }

    get emitter(): EventEmitter {
        return this._emitter;
    }

    protected init(): void {

        this.miner = this.addChild(new Miner());
        this.miner.position.set(
            config.appWidth / 2,
            640
        );
        this.claw = this.miner.getClaw();
        // this.miner = this.addChild(new Character());
        // this.miner.position.set(
        //     config.appWidth / 2,
        //     200
        // );

        // this.claw = this.addChild(new Claw());
        // this.claw.position.set(
        //     config.appWidth / 2,
        //     200
        // );
    }

    protected addTreasure(): void {
        this.treasureCont = this.addChild(new Container({label: 'treasureCont'}));
        this.treasureCont.y = 1100;
        this.arrTreasure = [];
        for (let i = 0; i < 12; i++) {
            const index = getRandomItemIndex(this.arrPositions);
            const treasure = this.treasureCont.addChild(new Treasure());
            this.arrTreasure.push(treasure);
            
            const pos = this.arrPositions.splice(index, 1);
            treasure.position.set(pos[0].x, pos[0].y);
        }
    }

    protected setPositions(start: number, end: number, step: number): void {
        this.arrPositions = [];
        const stepsArray = [];
        for (let i = start; i <= end; i += step) {
            stepsArray.push(i);
            for (let j = 0; j < this.arrPosY.length; j++) {
                this.arrPositions.push(new Point(i, this.arrPosY[j]));
            }
        }
    }

    protected addBtn(): void {
        this.btn = new Button({
            text: 'catch',
            color: 0xff00ff,
            onClick: () => {
                this.btn.alpha = 0.5;
                this.btn.interactive = false;
                this.start();
            }
        });
        this.btn.position.set(
            (config.appWidth - this.btn.width) / 2,
            config.appHeight - this.btn.height - 80
        );
        this.addChild(this.btn);
        
        this.btnRestart = new Button({
            text: 'restart',
            color: 0xff00ff,
            onClick: () => {
                this.restart();
            }
        });
        this.btnRestart.position.set(
            (config.appWidth - this.btnRestart.width) / 2,
            config.appHeight - this.btn.height - 80
        );
        this.btnRestart.alpha = 0;
        this.btnRestart.interactive = false;
        this.addChild(this.btnRestart);
    }

    protected addCollaiders() {
        this.arrCollaiders = [];
        this.clawCollaider = this.addChild(new Graphics({label: 'clawCollaider'}));
        this.drawContour(this.clawCollaider, this.claw.points, this.claw.view);

        for (let i = 0; i < this.arrTreasure.length; i++) {
            const element = this.arrTreasure[i];
            const graph = this.addChild(new Graphics({label: `test-${i}`}));
            this.drawContour(graph, element.points, element.view);
            // graph.hitArea = new Polygon(element.points)
            this.arrCollaiders.push(graph);
        }
    }

    protected startCatch(): void {
        const check = this.claw.isRevert ? this.checkClawStartPos() : this.checkClawPos();
        if (!check) {
            this.claw.moveTo();
            
            if(this.catchItem) this.catchItem.position.set(
                this.claw.view.getGlobalPosition().x , 
                this.claw.view.getGlobalPosition().y + this.catchItem.height / 2 - this.treasureCont.y
            );
        }
        else {
            if(this.claw.isRevert) this.stopCatch();
            else {
                this.claw.revert(!!this.catchItem);
                this.claw.moveTo();
            }
        }

        this.drawContour(this.clawCollaider, this.claw.points, this.claw.view);
        
        if(!this.catchItem) {
            const id = this.hit();
            
            if (id !== null) {
                this.catchItem = this.arrTreasure.splice(id, 1)[0];
                this.arrCollaiders.splice(id, 1);
                this.claw.revert(!!this.catchItem);
                this.claw.moveTo();
            } 
        }
    }

    protected start(): void {
        this.claw.start();
        this.startPos = this.claw.getStartPos();
        this.game.app.ticker.add(this.startCatch, this);
        this.game.app.ticker.start();
    }

    protected stopCatch(): void {
        this.game.app.ticker.remove(this.startCatch, this);
        this.claw.stop();

        if(this.catchItem) {
            this.catchItem.destroy();
            this.catchItem = null;
        }
        this.btn.interactive = true;
        this.btn.alpha = 1;

        if(this.arrTreasure.length <= 0) this.endRound();
    }

    protected checkClawPos(): boolean {
        let check = false;
        const clawPos = this.claw.view.getGlobalPosition();
        if (clawPos.x > config.appWidth || clawPos.x < 0) check = true;
        else if (clawPos.y > (config.appHeight - this.btn.height - 80)) check = true;

        return check;
    }
    
    protected checkClawStartPos(): boolean {
        let check = false;
        const clawPos = this.claw.view.getGlobalPosition();
        if (Math.floor(clawPos.y) < Math.floor(this.startPos.y)) check = true;

        return check;
    }

    //  ----------------------------------------------------------------------- 
    protected hit(): number {
        let collision = null;
        const points = this.claw.points.map((point: any) => this.claw.view.toGlobal(point));
        for (let i = 0; i < points.length; i++) {
            const el = points[i];
            for (let j = 0; j < this.arrCollaiders.length; j++) {
                const element = this.arrCollaiders[j];
                const check = element.hitArea.contains(el.x, el.y);
                if (check) {
                    collision = j;
                    break;
                }
            }
        }

        return collision;
    }

    protected convertToGlobal(sprite: Sprite, points: any) {
        return points.map((point: any) => sprite.toGlobal(point));
    }
    
    // Функция для проверки пересечения двух спрайтов по их хит-областям
    protected checkCollision(sprite1: any, sprite2: any) {
        const sprite1GlobalPoints = this.convertToGlobal(
            sprite1.view, sprite1.contourPoints.map((_: any, i: any) => new Point(sprite1.contourPoints[i], sprite1.contourPoints[i + 1]))
        );
        const sprite2GlobalPoints = this.convertToGlobal(
            sprite2.view, sprite2.contourPoints.map((_: any, i: any) => new Point(sprite2.contourPoints[i], sprite2.contourPoints[i + 1]))
        );
    
        // Проверяем, есть ли пересечения точек хит-областей
        for (const point1 of sprite1GlobalPoints) {
            
            if (sprite2.view.hitArea.contains(point1.x, point1.y)) {
                return true;
            }
        }
        for (const point2 of sprite2GlobalPoints) {
            if (sprite1.view.hitArea.contains(point2.x, point2.y)) {
                return true;
            }
        }
        return false;
    }

    // Функция для рисования контура на графическом объекте
    protected drawContour(graphic: Graphics, points: Point[], sprite: Sprite) {
        graphic.clear();
        const globalPoints = getGlobal(points, sprite);
        graphic.poly(globalPoints);
        graphic.fill({color: 0x0000FF, alpha: 0.005});
        graphic.hitArea = new Polygon(globalPoints);
    }
    //  ----------------------------------------------------------------------- 
    protected updBtns() {
        this.btn.alpha = +!this.btn.alpha;
        this.btn.interactive = !this.btn.interactive;
        this.btnRestart.alpha = +!this.btnRestart.alpha;
        this.btnRestart.interactive = !this.btn.interactive;
    }

    protected endRound() {
        this.updBtns();
    }

    protected restart() {
        this.setPositions( 100, config.appWidth - 50, 200);
        this.addTreasure();
        this.addCollaiders();
        this.updBtns();
    }

    // protected test() {
    //     const contourGraphic1 = this.addChild(new Graphics({label: 'test'}));
    //     this.drawContour(contourGraphic1, this.arrTreasure[0].points, this.arrTreasure[0].view);

    //     const glob = getGlobal(this.claw.points, this.claw.view);
    //     // console.log('glob ::', glob);

    //     this.clawCollaider = this.addChild(new Graphics({label: 'clawCollaider'}));
    //     this.drawContour(this.clawCollaider, this.claw.points, this.claw.view);
        
    //     // this.clawCollaider = new Graphics({label: 'test2'});
    //     // this.clawCollaider.poly(glob);
    //     // this.clawCollaider.fill(0xff0000);
    //     // this.addChild(this.clawCollaider);

    //     const graph = this.addChild(new Graphics());
    //     graph.circle(0, 0, 30)
    //     graph.fill(0xff0000)
    //     graph.position.set(
    //         this.arrTreasure[0].view.getGlobalPosition().x,
    //         this.arrTreasure[0].view.getGlobalPosition().y
    //     )

        
        
        

    //     const globalPoints2 = [];
    //     for (let i = 0; i < this.arrTreasure[0].contourPoints.length; i += 2) {
    //         globalPoints2.push(this.arrTreasure[0].view.toGlobal(new Point(this.arrTreasure[0].contourPoints[i], this.arrTreasure[0].contourPoints[i+1])))
    //     }
        
    //     contourGraphic1.hitArea = new Polygon(globalPoints2)

    //     console.log('global pos ::', contourGraphic1.hitArea);
    //     console.log('global pos ::', this.arrTreasure[0].view.getGlobalPosition().x);

    //     console.log('000000000000000000000', contourGraphic1.hitArea.contains(this.clawCollaider.x, this.clawCollaider.y));
    //     console.log('11111111111111111111111', contourGraphic1.hitArea.contains(graph.x, graph.y));
    // }



    // =========================================================================================================================

    // protected init(): void {
    //     this.sceneCont = new Container({label: 'sceneCont'});
    //     this.addChild(this.sceneCont);
    //     this.targetCont = new Container({label: 'targetCont'});
    //     this.sceneCont.addChild(this.targetCont);

    //     this.sceneGraph = new Graphics({label: 'sceneGraph'});
    //     this.sceneGraph.rect(0, 0, config.appWidth, 1450);
    //     this.sceneGraph.fill({
    //         color: 0xff00ff,
    //         alpha: 0.005
    //     });
    //     this.sceneGraph.y = 350;
    //     this.targetCont.addChild(this.sceneGraph);

    //     this.backGraph = new Graphics({label: 'backGraph'});
    //     this.backGraph.rect(0, 0, config.appWidth, 1450);
    //     this.backGraph.fill({
    //         color: 0xff00ff,
    //         alpha: 0.005
    //     });
    //     this.backGraph.y = 350;
    //     this.addChild(this.backGraph);

    //     let id = 0; 
    //     for (let i = 0; i < config.distances.length; i++) {
    //         const el = config.distances[i];
    //         for (let j = 0; j < el.amount; j++) {
    //             this.addTarget(el, j, id);
    //             id++;
    //         }
    //     }
    // }

    // protected addTarget(el: any , index: number, id: number): void {
    //     const wSection = config.appWidth / 3;

    //     const color = this.getRandomItem(this.colors);
    //     const target = new Target({
    //         color,
    //         // @ts-ignore
    //         value: config.targetValue[color],
    //         rate: el.rate,
    //         scale: el.scale
    //     });
    //     const xPos = el.amount % 2 === 0 ?  wSection * (index+1) : wSection * index + wSection / 2;
            
    //     target.position.set(
    //         xPos,
    //         el.positionY + target.height
    //     )
    //     target.scale.set(el.scale);
    //     this.targetCont.addChild(target);
    //     this.arrTargets.push(target);
    //     target.scale.y = 0;

    //     const valueText = new Text({
    //         text: '', 
    //         style: config.styles.targetValue
    //     });
    //     this.arrValueText.push(valueText);
    //     this.targetCont.addChild(valueText);

    //     target.emitter.on('hit', (obj) => {
    //         this.shot();
    //         this.showValue(id, obj.value, obj.center);
    //     });
    // }

    // protected addListeners(): void {
    //     this.sceneGraph.eventMode = 'static';
    //     this.sceneGraph.on('pointerdown', () => {
    //         this.emitter.emit('hit', {value: 0});
    //         this.shot();
    //         sound.play('miss');
    //     });

    //     this.backGraph.on('pointerdown', () => {
    //         sound.play('outofammo');
    //     })
    // }

    // protected addText(): void {
    //     this.text = new Text({
    //         text: 'OUT OF AMMO',
    //         style: config.styles.sceneText
    //     });
    //     this.text.position.set(
    //         (config.appWidth - this.text.width) / 2,
    //         (config.appHeight - this.text.height) / 2,
    //     );
    //     this.text.visible = false;
    //     this.addChild(this.text);
    // }

    // protected addBullets(): void {
    //     this.bullets = new Bullets();
    //     // this.bullets.x = (config.appWidth - this.bullets.width) / 2;
    //     this.bullets.y = 1900;

    //     this.addChild(this.bullets);
    // }

    // protected getRandomItem<T>(array: T[]): T | undefined {
    //     const randomIndex = Math.floor(Math.random() * array.length);
    //     return array[randomIndex];
    // }

    // protected animTargets(): void {
    //     setInterval(() => {
    //         this.showTarget();
    //     }, 500)
    // }

    // protected showTarget(): void {
    //     const availablesTargets: Target[] = [];
    //     this.arrTargets.forEach(item => !item.active ? availablesTargets.push(item) : null);

    //     if(availablesTargets.length > 2) {
    //         const item = this.getRandomItem(availablesTargets);
    //         item.show();
    //     }
    // }

    // protected showOutofAmony(): void {
    //     this.text.visible = true;
    //     this.backGraph.interactive = true;
    //     this.targetCont.interactiveChildren = false;
    // }

    // protected shot(): void {
    //     const amountBullet = this.bullets.updBullets();
        
    //     this.reloadAmony = amountBullet === 9;
    //     if(this.reloadAmony) this.showOutofAmony()
    // }

    // public reloadBullets() {
    //     this.targetCont.interactiveChildren = true;
    //     this.backGraph.interactive = false;
    //     this.text.visible = false;
    // }

    // protected showValue(id: number, val: number, center: boolean) {
    //     const text = this.arrValueText[id];
    //     const target = this.arrTargets[id];
    //     text.alpha = 1;
    //     text.text = val.toString();
    //     text.style.fill = center ? 0xff0000 : 0x00b30c
    //     text.position.set(
    //         target.getBounds().left - text.width, 
    //         target.getBounds().bottom - text.height
    //     );
        
    //     gsap.to(text, {
    //         y: text.getBounds().top - 180,
    //         duration: .5,
    //         ease: 'power4.out',
    //         onComplete: () => text.alpha = 0
    //     });
    // }
}