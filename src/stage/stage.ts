import * as PIXI from "pixi.js";
import { StackMachine } from "../compiler/StackMachine";
import { baseWidth, baseHeight, leftWall, rightWall, upperWall, lowerWall, app, necromancerSprite } from './baseGameScreen';
import { compile } from '../compiler/compile';
import { stageNames } from '../main/stageNames';
import { stageInformations } from "./stageInformations";
import './stage.css';

let isRunning: boolean = false;

//初期化時にcanvasのサイズを設定
resizeCanvas();

// CanvasをHTMLのbodyに追加
const container = document.getElementById('container');
const controler = document.getElementById('controler');
container.insertBefore(app.view, controler);


// ウィンドウのリサイズイベントを監視
window.addEventListener('resize', resizeCanvas);

function resizeCanvas() {
    // 新しいウィンドウの幅と高さを取得
    const newWidth: number = window.innerWidth;
    const newHeight: number = window.innerHeight;

    // ゲーム画面の比率に合わせてスケールを計算
    const scaleX: number = newWidth / baseWidth;
    const scaleY: number = newHeight / baseHeight;
    const scale: number  = Math.min(scaleX, scaleY);

    //canvasのサイズを変更
    app.renderer.resize(baseWidth * scale, baseHeight * scale);

    // スプライトやテキストなどのコンテンツを拡大縮小
    app.stage.scale.set(scale);
};

// Stage番号設定
const urlParams = new URLSearchParams(window.location.search);
const stageNumber: number = Number(urlParams.get('stageNumber'));
const stageNumberHTML = document.getElementById('stageNumber');
stageNumberHTML.innerHTML = `${stageNumber}`;

// Stage Title設定
const stageTitle = document.getElementById('stageTitle');
stageTitle.textContent = stageNames[stageNumber-1];
//document.getElementById('controler').insertBefore(stageTitle, document.getElementById('buttons'));

// File ボタン
document.getElementById('fileButton').addEventListener('click', () => {
    if (!isRunning) document.getElementById('fileInput').click();
})

// File Input ボタン（非表示）
document.getElementById('fileInput').addEventListener('change', (event) => {
    const files = (event.target as HTMLInputElement).files;
    document.getElementById('fileName').textContent = files[0].name;
});

// Start ボタン
document.getElementById('startButton').addEventListener('click', async () => {
    if (!isRunning) {
        let source: string = "";
        const files = (document.getElementById('fileInput') as HTMLInputElement).files;
        if (files) {
            for (let i=0; i<files.length; i++) {
                const file = files[i];
                const content = await readFileAsync(file);
                source += content;
            }
        }

        function readFileAsync(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.onerror = reject;
                reader.readAsText(file, 'utf-8');
            });
        }

        try {
            isRunning = true;
            run(compile(source));
        } catch (error) {
            alert(`Error: ${error}`);
            isRunning = false;
        }
    }
});

function run(codes) {
    // 実行
    const character = new StackMachine(stageInformation.initialCharacterX, stageInformation.initialCharacterY, codes, 0);
    app.ticker.add((delta) => {
        character.execute();
        // ゴール検知
        if (detectGoal(necromancerSprite, goalSprite)) {
            openModal();
        }
        if (character.x < leftWall) character.x = leftWall;
        if (character.x + necromancerSprite.width > rightWall) character.x = rightWall - necromancerSprite.width;
        if (character.y < upperWall) character.y = upperWall;
        if (character.y + necromancerSprite.height > lowerWall) character.y = lowerWall - necromancerSprite.height;
        necromancerSprite.x = character.x; necromancerSprite.y = character.y;
        console.log("necromancerSprite.x = " + necromancerSprite.x);
        console.log("necromancerSprite.y = " + necromancerSprite.y);
    });
}

// Back ボタン
const backButton = document.getElementById('backButton');
backButton.addEventListener('click', () => { window.location.href = 'stageSelector.html'});

// Resign ボタン
const resignButton = document.getElementById('resignButton');
resignButton.addEventListener('click', () => { window.location.href = `stage.html?stageNumber=${stageNumber}`});

// ステージの情報を取得
const stageInformation = stageInformations[stageNumber-1];

// キャラクターの初期位置を設定
necromancerSprite.x = stageInformation.initialCharacterX;
necromancerSprite.y = stageInformation.initialCharacterY;

// ゴールのスプライトの設置
const goalSprite = new PIXI.Sprite(stageInformation.goalSprite.texture);
goalSprite.width = stageInformation.goalSprite.width;
goalSprite.height = stageInformation.goalSprite.height;
goalSprite.x = stageInformation.goalSprite.x;
goalSprite.y = stageInformation.goalSprite.y;
app.stage.addChildAt(goalSprite, app.stage.getChildIndex(necromancerSprite));

// necromancerより後ろのスプライトの設置
for (let i=0; i<stageInformation.frontSprites.length; i++) {
    const spriteInfo = stageInformation.frontSprites[i];
    const sprite = new PIXI.Sprite(spriteInfo.texture);
    sprite.width = spriteInfo.width;
    sprite.height = spriteInfo.height;
    sprite.x = spriteInfo.x;
    sprite.y = spriteInfo.y;
    app.stage.addChildAt(sprite, app.stage.getChildIndex(necromancerSprite));
}

// necromancerより後ろのアニメスプライトの設置
for (let i=0; i<stageInformation.frontAnimatedSprites.length; i++) {
    const spriteInfo = stageInformation.frontAnimatedSprites[i];
    const sprite = new PIXI.AnimatedSprite(spriteInfo.texture);
    sprite.width = spriteInfo.width;
    sprite.height = spriteInfo.height;
    sprite.x = spriteInfo.x;
    sprite.y = spriteInfo.y;
    sprite.animationSpeed = 0.1; // Set the animation speed
    sprite.loop = true; // Set whether the animation should loop
    sprite.play();
    app.stage.addChildAt(sprite, app.stage.getChildIndex(necromancerSprite));
}

//ゴール検知関数
function detectGoal(character, goal) {
    const boundsCharacter = character.getBounds();
    const boundsGoal = goal.getBounds();
    return  boundsCharacter.x + boundsCharacter.width * 5/8 > boundsGoal.x + boundsGoal.width/2 &&
            boundsCharacter.x + boundsCharacter.width * 3/8 < boundsGoal.x + boundsGoal.width/2 &&
            boundsCharacter.y + boundsCharacter.height * 5/8 > boundsGoal.y + boundsGoal.height/2 &&
            boundsCharacter.y + boundsCharacter.height * 3/8 < boundsGoal.y + boundsGoal.height/2;
}

// オーバーレイ
const overlay = document.getElementById('overlay');
overlay.addEventListener('click', () => closeModal());

// クロージャーボタン
const closure = document.getElementById('closure');
closure.addEventListener('click', () => closeModal());

// モーダルを閉じる
function closeModal() {
    //モーダルとオーバーレイを非表示に
    document.getElementById("modal").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    // ステージ選択へ移動
    window.location.href = "stageSelector.html";
}

// モーダルを開く
function openModal() {
    //モーダルとオーバーレイを可視化
    document.getElementById('modal').style.display = "block";
    document.getElementById('overlay').style.display = "block";
}