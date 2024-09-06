import { Application, Container, Assets } from 'pixi.js';
import { sound } from '@pixi/sound';
import MainScene from './MainScene';
import Server from './Server';
import { assetsBundle, fonts } from './AssetsBundle';
import { config } from '../config';

export interface IGameProps {
        width: number
        height: number
}

export default class MainGame{
    protected static _instance: MainGame;

    public width: number;
    public height: number;
    public shift: number;
    public screenHeight: number;
    
    
    public scene: MainScene;
    public app: Application;
    public mainContainer: Container;
    public server: Server;

    protected loader: HTMLDivElement
    protected userId: string
    
    constructor(options: IGameProps) {
        this.width = options.width;
        this.height = options.height;

        this.mainContainer = new Container();
        this.server = new Server();
        this.loader = document.getElementsByClassName('loader-dots')[0] as HTMLDivElement;
        this.userId = config.isDev ? "223456-56-56767-7676" : this.parseUrl();

        this.loadMyAssets();
    }

    public static instance(options?: IGameProps) {
        if (!MainGame._instance) {
            MainGame._instance = new MainGame(options);
        }
        return MainGame._instance;
    }

    protected parseUrl(): string {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get('userId');
        return userId;
    }

    protected async loadMyAssets() {
        await Assets.addBundle('main', assetsBundle);
        await Assets.addBundle('fonts', fonts);
        await Assets.loadBundle(['main', 'fonts']);

        this.init();
    }

    protected async init(): Promise<void> {
        const isMobile = this.isMobileDevice();

        this.app = new Application();
        await this.app.init({
            width: config.appWidth,
            height: config.appHeight,
            preference: 'webgpu',
            backgroundColor: 0x0070e7
        });
        (globalThis as any).__PIXI_APP__ = this.app; // eslint-disable-line
        
        document.body.append(this.app.canvas);
        const preload = document.getElementById('preloader') as HTMLDivElement;
        if (preload) preload.hidden = true;

        if(!isMobile) {
            const canvas = document.getElementsByTagName('canvas');
            canvas[0].style.position = "absolute";
            canvas[0].style.transform = "translate(-50%, -50%)";
            canvas[0].style.top = "50%";
            canvas[0].style.maxHeight = "100%";
            canvas[0].style.maxWidth = "unset";
            canvas[0].style.width = "unset";

            this.shift = 0;
        } else {
            const clientWidth = this.width;
            const clientHeight = this.height;
            const screenProportions = clientHeight / clientWidth;
            this.screenHeight = config.appWidth * screenProportions;
            this.shift = config.appHeight - this.screenHeight;
        }
        
        this.mainContainer.label = 'mainContainer';
        this.app.stage.addChild(this.mainContainer);
        sound.muteAll();
        
        this.scene = new MainScene();
    }

    public showLoader(): void {
        this.loader.style.display = 'flex';
    }
    
    public hideLoader(): void {
        this.loader.style.display = 'none';
    }

    getUsername(): string {
        return this.userId
    }

    protected isMobileDevice(): boolean {
        const userAgent = navigator.userAgent;
        const mobileRegex = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i;
    
        return mobileRegex.test(userAgent);
    }
}