import { Container, Text } from "pixi.js";
import { sound } from '@pixi/sound';
import { config } from "../config";

interface IFormatTime {
    hours: string
    minutes: string
    seconds: string
}
export default class Timer extends Container {

    protected timer: Text
    protected downTimer: ReturnType<typeof setInterval>

    constructor() {
        super();

        this.label = 'timer';

        this.timer = new Text({
            text: `00:00`,
            style: config.styles.guiValue 
        });
        this.addChild(this.timer);
    }

    countdownTimer(deadline: number, callback: () => void) {  
        let timeRemaining = deadline;
        this.downTimer = setInterval(()=>{
            const time = this.formatTime(timeRemaining);
            
            if(+time.minutes >= 0 && +time.seconds >= 0) {
                this.timer.text = `${time.minutes}:${time.seconds}`;
                timeRemaining -= 1000;
            } else {
                this.timer.text = `00:00`;
                callback();
                this.removeTimer.bind(this)();
            }           
        }, 1000);
    }

    removeTimer(): void {
        clearInterval(this.downTimer);
        if(sound) sound.stopAll();
    }

    formatTime(ms: number): IFormatTime {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return {
            hours: String(hours).padStart(2, '0'), 
            minutes: String(minutes).padStart(2, '0'), 
            seconds: String(seconds).padStart(2, '0')
        };
    }
}