import { Container, Sprite, Texture } from "pixi.js";
import { EventEmitter } from "events";
import { sound } from '@pixi/sound';
import { config } from "../config";

// type states = 'off' | 'on';

// export const soundState: Record<number, states> = {
//     0: 'off',
//     1: 'on'
// };

export enum soundState {
    'off',
    'on'
};

export default class SoundManager extends Container {

    protected _emitter: EventEmitter
    protected widthIcon = config.soundIconWidth;
    protected soundIcon: Sprite;
    protected state: number;

    constructor() {
        super();
        this.state = 0;
        this._emitter = new EventEmitter();

        this.createButton();
    }

    get emitter() {
        return this._emitter;
    }

    protected createButton(): void {
        this.soundIcon = Sprite.from(`btn_sound_${soundState[this.state]}`);
        const k = this.widthIcon / this.soundIcon.width;
        this.soundIcon.width = this.widthIcon;
        this.soundIcon.height = this.soundIcon.height * k;
        this.addChild(this.soundIcon);

        this.soundIcon.interactive = true;
        this.soundIcon.on('pointerup', () => {
            this.toggleSound();
        });
    }

    public toggleSound(): void {
        this.state = +!this.state;
        config.mute = !config.mute;
        // @ts-ignore
        this.soundIcon.texture = new Texture.from(`btn_sound_${soundState[this.state]}`);  
        sound.toggleMuteAll();
        this.emitter.emit('toggle_sound');
    }
}