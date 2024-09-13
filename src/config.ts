import { TextStyleOptions } from "pixi.js";

type StyleMap = {
    [key: string]: TextStyleOptions;
};

export const config = {
    isDev: true,
    mute: true,
    durationRound: 60000,
    appWidth: 1124,
    appHeight: 2436,
    soundIconWidth: 50,
    btnColor: '#f2d309',
    amountTargets: 13,
    targetValue: {
        yellow: [10, 20],
        green: [20, 40],
        red: [25, 50],
    },
    distances: [
        {
            amount: 2,
            rate: 1, //100%
            scale: 0.9,
            positionY: 1455
        },
        {
            amount: 3,
            rate: 1.1, //110%
            scale: 0.75,
            positionY: 1148
        },
        {
            amount: 2,
            rate: 1.2, //120%
            scale: 0.6,
            positionY: 865
        },
        {
            amount: 3,
            rate: 1.3, //130%
            scale: 0.5,
            positionY: 640
        },
        {
            amount: 3,
            rate: 1.5, //150%
            scale: 0.35,
            positionY: 317
        }
    ],
    styles:  {
        base: {
            fontSize: 110,
            fontFamily: 'Boogaloo',
            fill: 0xffffff
        },
        startScreen: {
            fontSize: 100,
            fontFamily: 'Boogaloo',
            fill: 0x000000,
            fontWeight: 'bold'
        },
        startSound: {
            fontSize: 100,
            fontFamily: 'Boogaloo',
            fill: 0xffffff,
            fontWeight: 'bold'
        },
        targetValue: {
            fontSize: 80,
            fontFamily: 'Boogaloo',
            fill: 0xff0000,
            fontWeight: 'bold',
            stroke: { color: '#ffffff', width: 6, join: 'round' },
        },
        score: {
            fontFamily: 'Boogaloo',
            fontSize: 60,
            letterSpacing: 1.5,
        },
        topScore: {
            fontFamily: 'Boogaloo',
            fontSize: 60,
            fill: 0xff0000,
            letterSpacing: 1.5,
            stroke: { color: '#ffffff', width: 6, join: 'round' },
        },
        close: {
            fontSize: 110,
            fontFamily: 'Boogaloo',
            fill: 0xff0000,
            fontWeight: 'bold'
        },
        guiLabel: {
            fontSize: 50,
            fontFamily: 'Boogaloo',
            fill: 0xcd7418,
            fontWeight: 'bold'
        },
        guiValue: {
            fontSize: 50,
            fontFamily: 'Boogaloo',
            fill: 0xffffff,
            fontWeight: 'bold'
        },
        finalTop: {
            fontSize: 80,
            fontFamily: 'Boogaloo',
            fill: 0xf2d309,
            fontWeight: 'bold'
        },
        finalScore: {
            fontSize: 100,
            fontFamily: 'Boogaloo',
            fill: 0xf2d309,
            fontWeight: 'bold'
        },
        multiply: {
            fontSize: 40,
            fontFamily: 'Boogaloo',
            fill: 0x00d954,
        },
        reloadBullet: {
            fontSize: 80,
            fontFamily: 'Boogaloo',
            fill: 0xffffff,
        },
        sceneText: {
            fontSize: 140,
            fontFamily: 'Boogaloo',
            fill: 0xffffff,
        }
    } as StyleMap
}