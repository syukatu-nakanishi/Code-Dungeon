import * as PIXI from 'pixi.js';
//const baseWidth: number = 1920;
export const baseWidth: number = 1080;
export const baseHeight: number = 1080;
export const baseLength: number = baseHeight;
export const blockSize: number = 60;
export const columns: number = baseLength / blockSize;
export const rows: number = baseLength / blockSize;

export const leftWall: number = blockSize * 0.3;
export const rightWall: number = blockSize * (17 + 0.8);
export const upperWall: number = blockSize * (1 - 0.4);
export const lowerWall: number = blockSize * 17;

// Pixiアプリケーションを作成
export const app = new PIXI.Application<HTMLCanvasElement>({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x000000, // 背景色を設定
    antialias: true, // アンチエイリアシングを有効にする（オプション）
});

// タイル画像の読み込み
const floor1Texture = PIXI.Texture.from('floor_1.png');
const wallMidTexture = PIXI.Texture.from('wall_mid.png');
const wallEdgeMidLeftTexture = PIXI.Texture.from('wall_edge_mid_left.png');
const wallEdgeMidRightTexture = PIXI.Texture.from('wall_edge_mid_right.png');
const wallTopMidTexture = PIXI.Texture.from('wall_top_mid.png');
const wallLeftTexture = PIXI.Texture.from('wall_left.png');
const wallRightTexture = PIXI.Texture.from('wall_right.png');
const wallEdgeLeftTexture = PIXI.Texture.from('wall_edge_left.png');
const wallEdgeRightTexture = PIXI.Texture.from('wall_edge_right.png');
const wallEdgeTopLeftTexture = PIXI.Texture.from('wall_edge_top_left.png');
const wallEdgeTopRightTexture = PIXI.Texture.from('wall_edge_top_right.png');
const wallEdgeBottomLeftTexture = PIXI.Texture.from('wall_edge_bottom_left.png');
const wallEdgeBottomRightTexture = PIXI.Texture.from('wall_edge_bottom_right.png');

//floor1
for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
        const floor1Sprite = new PIXI.Sprite(floor1Texture);
        floor1Sprite.width = blockSize;
        floor1Sprite.height = blockSize;
        floor1Sprite.x = i * blockSize;
        floor1Sprite.y = j * blockSize;
        app.stage.addChild(floor1Sprite);
    }
}

// wall mid
for (let i=0; i<columns; i++) {
    const wallUpperSprite = new PIXI.Sprite(wallMidTexture);
    wallUpperSprite.width = blockSize;
    wallUpperSprite.height = blockSize;
    wallUpperSprite.x = i * blockSize;
    wallUpperSprite.y = blockSize * 0.2; //0.2分だけ下に
    app.stage.addChild(wallUpperSprite);

    const wallLowerSprite = new PIXI.Sprite(wallMidTexture);
    wallLowerSprite.width = blockSize;
    wallLowerSprite.height = blockSize;
    wallLowerSprite.x = i * blockSize;
    wallLowerSprite.y = blockSize * (rows - 1);
    app.stage.addChild(wallLowerSprite);
}

//wallEdge (left mid and right mid)
for (let i=0; i<rows-2; i++) {
    //Left
    const wallEdgeMidLeftSprite = new PIXI.Sprite(wallEdgeMidLeftTexture);
    wallEdgeMidLeftSprite.width = blockSize;
    wallEdgeMidLeftSprite.height = blockSize;
    wallEdgeMidLeftSprite.x = 0;
    wallEdgeMidLeftSprite.y = i * blockSize + blockSize * 0.2;
    app.stage.addChild(wallEdgeMidLeftSprite);
    //Right
    const wallEdgeMidRightSprite = new PIXI.Sprite(wallEdgeMidRightTexture);
    wallEdgeMidRightSprite.width = blockSize;
    wallEdgeMidRightSprite.height = blockSize;
    wallEdgeMidRightSprite.x = blockSize * (columns - 1);
    wallEdgeMidRightSprite.y = i * blockSize;
    app.stage.addChild(wallEdgeMidRightSprite);
}

//wall top mid (upper)
for (let i=1; i<columns; i++) {
    const wallTopMidSprite = new PIXI.Sprite(wallTopMidTexture);
    wallTopMidSprite.width = blockSize;
    wallTopMidSprite.height = blockSize;
    wallTopMidSprite.x = i * blockSize;
    wallTopMidSprite.y = - blockSize * 0.8;
    app.stage.addChild(wallTopMidSprite);
}

// wall edge left
const wallEdgeLeftSprite = new PIXI.Sprite(wallEdgeLeftTexture);
wallEdgeLeftSprite.width = blockSize;
wallEdgeLeftSprite.height = blockSize;
wallEdgeLeftSprite.x = 0;
wallEdgeLeftSprite.y = blockSize * 0.2;
app.stage.addChild(wallEdgeLeftSprite);

// wall edge right
const wallEdgeRightSprite = new PIXI.Sprite(wallEdgeRightTexture);
wallEdgeRightSprite.width = blockSize;
wallEdgeRightSprite.height = blockSize;
wallEdgeRightSprite.x = blockSize * 17;
wallEdgeRightSprite.y = blockSize * 0.2;
app.stage.addChild(wallEdgeRightSprite);

// wall edge top left
const wallEdgeTopLeftSprite = new PIXI.Sprite(wallEdgeTopLeftTexture);
wallEdgeTopLeftSprite.width = blockSize;
wallEdgeTopLeftSprite.height = blockSize;
wallEdgeTopLeftSprite.x = - blockSize / 16;
wallEdgeTopLeftSprite.y = - blockSize * 0.8;
app.stage.addChild(wallEdgeTopLeftSprite);

// wall edge top right
const wallEdgeTopRightSprite = new PIXI.Sprite(wallEdgeTopRightTexture);
wallEdgeTopRightSprite.width = blockSize;
wallEdgeTopRightSprite.height = blockSize;
wallEdgeTopRightSprite.x = blockSize * 17;
wallEdgeTopRightSprite.y = - blockSize * 0.8;
app.stage.addChild(wallEdgeTopRightSprite);

//necromancer
export const necromancerTextures = [
    PIXI.Texture.from('necromancer_anim_f0.png'),
    PIXI.Texture.from('necromancer_anim_f1.png'),
    PIXI.Texture.from('necromancer_anim_f2.png'),
    PIXI.Texture.from('necromancer_anim_f3.png'),
];

export const necromancerSprite = new PIXI.AnimatedSprite(necromancerTextures);

necromancerSprite.animationSpeed = 0.1; // Set the animation speed
necromancerSprite.loop = true; // Set whether the animation should loop

necromancerSprite.width = blockSize;
necromancerSprite.height = blockSize;
//necromancerSprite.x = 2 * blockSize;
//necromancerSprite.y = 15 * blockSize;

app.stage.addChild(necromancerSprite);

necromancerSprite.play();

//wall top mid (lower)
for (let i=0; i<columns; i++) {
    const wallTopMidSprite = new PIXI.Sprite(wallTopMidTexture);
    wallTopMidSprite.width = blockSize;
    wallTopMidSprite.height = blockSize;
    wallTopMidSprite.x = i * blockSize;
    wallTopMidSprite.y = 16 * blockSize;
    app.stage.addChild(wallTopMidSprite);
}

//wallEdge bottom left
const wallEdgeBottomLeftSprite = new PIXI.Sprite(wallEdgeBottomLeftTexture);
wallEdgeBottomLeftSprite.width = blockSize;
wallEdgeBottomLeftSprite.height = blockSize;
wallEdgeBottomLeftSprite.x = 0;
wallEdgeBottomLeftSprite.y = blockSize * 16;
app.stage.addChild(wallEdgeBottomLeftSprite);

//wallEdge bottom right
const wallEdgeBottomRightSprite = new PIXI.Sprite(wallEdgeBottomRightTexture);
wallEdgeBottomRightSprite.width = blockSize;
wallEdgeBottomRightSprite.height = blockSize;
wallEdgeBottomRightSprite.x = 17 * blockSize;
wallEdgeBottomRightSprite.y = blockSize * 16;
app.stage.addChild(wallEdgeBottomRightSprite);

//wallLeft
const wallLeftSprite = new PIXI.Sprite(wallLeftTexture);
wallLeftSprite.width = blockSize;
wallLeftSprite.height = blockSize;
wallLeftSprite.x = 0;
wallLeftSprite.y = 17 * blockSize;
app.stage.addChild(wallLeftSprite);

//wallRight
const wallRightSprite = new PIXI.Sprite(wallRightTexture);
wallRightSprite.width = blockSize;
wallRightSprite.height = blockSize;
wallRightSprite.x = 17* blockSize;
wallRightSprite.y = 17 * blockSize;
app.stage.addChild(wallRightSprite);