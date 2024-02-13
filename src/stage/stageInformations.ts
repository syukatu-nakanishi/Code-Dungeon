import * as PIXI from 'pixi.js';
import { blockSize } from "./baseGameScreen";

export const stageInformations = [];

const goalTexture = PIXI.Texture.from('floor_stairs.png');
const ogreTextures = [
    PIXI.Texture.from('ogre_idle_anim_f0.png'),
    PIXI.Texture.from('ogre_idle_anim_f1.png'),
    PIXI.Texture.from('ogre_idle_anim_f2.png'),
    PIXI.Texture.from('ogre_idle_anim_f3.png'),
];
const wallEdgeLeftTexture = PIXI.Texture.from('wall_edge_left.png');
const wallEdgeRightTexture = PIXI.Texture.from('wall_edge_right.png');
const wallEdgeTopLeftTexture = PIXI.Texture.from('wall_edge_top_left.png');
const wallEdgeTopRightTexture = PIXI.Texture.from('wall_edge_top_right.png');
const wallEdgeMidLeftTexture = PIXI.Texture.from('wall_edge_mid_left.png');
const wallEdgeMidRightTexture = PIXI.Texture.from('wall_edge_mid_right.png');
const wallTopMidTexture = PIXI.Texture.from('wall_top_mid.png');
const wallTopRightTexture = PIXI.Texture.from('wall_top_right.png');
const wallTopLeftTexture = PIXI.Texture.from('wall_top_left.png');
const wallEdgeBottomLeftTexture = PIXI.Texture.from('wall_edge_bottom_left.png');
const wallEdgeBottomRightTexture = PIXI.Texture.from('wall_edge_bottom_right.png');
const wallLeftTexture = PIXI.Texture.from('wall_left.png');
const wallRightTexture = PIXI.Texture.from('wall_right.png');
const wallMidTexture = PIXI.Texture.from('wall_mid.png');

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ステージ1
stageInformations[0] = {
    initialCharacterX: 9 * blockSize,
    initialCharacterY: 15 * blockSize,
    goalSprite: {
        texture: goalTexture,
        width: blockSize,
        height: blockSize,
        x: blockSize * 9,
        y: blockSize * 2
    },
    sprites: [],
    animatedSprites: [],
};

// ステージ2
stageInformations[1] = {
    initialCharacterX: 9 * blockSize,
    initialCharacterY: 15 * blockSize,
    goalSprite: {
        texture: goalTexture,
        width: blockSize,
        height: blockSize,
        x: blockSize * getRandomInteger(1, 16),
        y: blockSize * getRandomInteger(2,15),
    },
    sprites: [],
    animatedSprites: [],
}

// ステージ3
stageInformations[2] = {
    initialCharacterX: 9 * blockSize,
    initialCharacterY: 15 * blockSize,
    goalSprite: {
        texture: goalTexture,
        width: blockSize,
        height: blockSize,
        x: blockSize * 9,
        y: blockSize * 2
    },
    frontSprites: [ 
        { // wall edge left
            texture: wallEdgeLeftTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 4,
            y: blockSize * 0.2,
        },
        { // wall edge mid left 1
            texture: wallEdgeMidLeftTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 4, // - blockSize / 16,
            y: blockSize + blockSize * 0.2,
        },
        { // wall edge mid left 2
            texture: wallEdgeMidLeftTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 4, // - blockSize / 16,
            y: blockSize * 2 + blockSize * 0.2,
        },
        { // wall edge mid left 3
            texture: wallEdgeMidLeftTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 4, // - blockSize / 16,
            y: blockSize * 3 + blockSize * 0.2,
        },
        { // wall edge mid left 4
            texture: wallEdgeMidLeftTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 4, // - blockSize / 16,
            y: blockSize * 4 + blockSize * 0.2,
        },
        { // wall edge mid left 5
            texture: wallEdgeMidLeftTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 4, // - blockSize / 16,
            y: blockSize * 5 + blockSize * 0.2,
        },
        { // wall edge mid left 6
            texture: wallEdgeMidLeftTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 4, // - blockSize / 16,
            y: blockSize * 6 + blockSize * 0.2,
        },
        { // wall edge mid left 7
            texture: wallEdgeMidLeftTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 4, // - blockSize / 16,
            y: blockSize * 7 + blockSize * 0.2,
        },
        { // wall edge top left
            texture: wallEdgeTopLeftTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 4 - blockSize / 16,
            y: - blockSize * 0.8,
        }, 
        { // wall edge right
            texture: wallEdgeRightTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 13,
            y: blockSize * 0.2,
        },
        { // wall edge mid right 1
            texture: wallEdgeMidRightTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 13,
            y: blockSize + blockSize * 0.2,
        },
        { // wall edge mid right 2
            texture: wallEdgeMidRightTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 13,
            y: blockSize * 2 + blockSize * 0.2,
        },
        { // wall edge mid right 3
            texture: wallEdgeMidRightTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 13,
            y: blockSize * 3 + blockSize * 0.2,
        },
        { // wall edge mid right 4
            texture: wallEdgeMidRightTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 13,
            y: blockSize * 4 + blockSize * 0.2,
        },
        { // wall edge mid right 5
            texture: wallEdgeMidRightTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 13,
            y: blockSize * 5 + blockSize * 0.2,
        },
        { // wall edge mid right 6
            texture: wallEdgeMidRightTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 13,
            y: blockSize * 6 + blockSize * 0.2,
        },
        { // wall edge mid right 7
            texture: wallEdgeMidRightTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 13,
            y: blockSize * 7 + blockSize * 0.2,
        },
        { // wall edge top right
            texture: wallEdgeTopRightTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 13, // - blockSize / 16,
            y: - blockSize * 0.8,
        },
        { // wall top mid 1
            texture: wallTopMidTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 5, // - blockSize / 16,
            y: blockSize * 8 //- blockSize * 0.8,
        },
        { // wall top mid 2
            texture: wallTopMidTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 6, // - blockSize / 16,
            y: blockSize * 8 //- blockSize * 0.8,
        },
        { // wall top mid 3
            texture: wallTopMidTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 7, // - blockSize / 16,
            y: blockSize * 8 //- blockSize * 0.8,
        },
        { // wall top mid 4
            texture: wallTopMidTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 10, // - blockSize / 16,
            y: blockSize * 8 //- blockSize * 0.8,
        },
        { // wall top mid 5
            texture: wallTopMidTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 11, // - blockSize / 16,
            y: blockSize * 8 //- blockSize * 0.8,
        },
        { // wall top mid 6
            texture: wallTopMidTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 12, // - blockSize / 16,
            y: blockSize * 8 //- blockSize * 0.8,
        },
        { // wall edge bottom left
            texture: wallEdgeBottomLeftTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 4, // - blockSize / 16,
            y: blockSize * 8 //- blockSize * 0.8,
        },
        { // wall edge bottom right
            texture: wallEdgeBottomRightTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 13, // - blockSize / 16,
            y: blockSize * 8 //- blockSize * 0.8,
        },
        { // wall left 2
            texture: wallLeftTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 4, // - blockSize / 16,
            y: blockSize * 9 //- blockSize * 0.8,
        },
        { // wall left 2
            texture: wallLeftTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 10, // - blockSize / 16,
            y: blockSize * 9 //- blockSize * 0.8,
        },
        { // wall right 1
            texture: wallRightTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 13, // - blockSize / 16,
            y: blockSize * 9 //- blockSize * 0.8,
        },
        { // wall right 2
            texture: wallRightTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 7, // - blockSize / 16,
            y: blockSize * 9 //- blockSize * 0.8,
        },
        { // wall mid 1
            texture: wallMidTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 5, // - blockSize / 16,
            y: blockSize * 9 //- blockSize * 0.8,
        },
        { // wall mid 2
            texture: wallMidTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 6, // - blockSize / 16,
            y: blockSize * 9 //- blockSize * 0.8,
        },
        { // wall mid 3
            texture: wallMidTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 11, // - blockSize / 16,
            y: blockSize * 9 //- blockSize * 0.8,
        },
        { // wall mid 4
            texture: wallMidTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 12, // - blockSize / 16,
            y: blockSize * 9 //- blockSize * 0.8,
        },
        { // wall top Left
            texture: wallTopLeftTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 10, // - blockSize / 16,
            y: blockSize * 8 //- blockSize * 0.8,
        },
        { // wall top Right
            texture: wallTopRightTexture,
            width: blockSize,
            height: blockSize,
            x: blockSize * 7, // - blockSize / 16,
            y: blockSize * 8 //- blockSize * 0.8,
        },
    ],
    frontAnimatedSprites: [
        { // ogre
            texture: ogreTextures,
            width: blockSize * 1.5,
            height: blockSize * 1.5,
            x: blockSize * 8.3,
            y: blockSize * 8,
        },
    ]
}