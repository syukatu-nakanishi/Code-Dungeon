import * as PIXI from "pixi.js";
import { StackMachine } from "../compiler/StackMachine";
import { baseWidth, baseHeight, leftWall, rightWall, upperWall, lowerWall, app, necromancerSprite, blockSize, necromancerTextures } from '../stage/baseGameScreen';
import { compile } from '../compiler/compile';
import './howToPlay.css';

let isRunning: boolean = false;
let isFileSelected: boolean = false;

//初期化時にcanvasのサイズを設定
resizeCanvas();

// CanvasをHTMLのbodyに追加
//const page2 = document.getElementById('page2');
const gameScreen = document.getElementById('gameScreen');
gameScreen.appendChild(app.view);

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

// page1のキャラクターの初期位置
necromancerSprite.x = blockSize * 8.5;
necromancerSprite.y = blockSize * 8.5;

// File ボタン
document.getElementById('fileButton').addEventListener('click', () => {
    if (!isRunning) document.getElementById('fileInput').click();
})

// File Input ボタン（非表示）
document.getElementById('fileInput').addEventListener('change', (event) => {
    const files = (event.target as HTMLInputElement).files;
    document.getElementById('fileName').textContent = files[0].name;
    isFileSelected = true;
});

// Start ボタン
document.getElementById('startButton').addEventListener('click', async () => {
    if (!isRunning && isFileSelected) {
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
    characters[0] = {
        sprite: necromancerSprite,
        stackMachine: new StackMachine(necromancerSprite.x, necromancerSprite.y, codes, 0),
    };
    app.ticker.add(animate);
}

// キャラクター管理
let characters = [];

// 火の玉管理
let fires = [];
const fireTexture = PIXI.Texture.from('fire.png');

function animate() {
    for (let i=0; i<characters.length; i++) {
        characters[i].stackMachine.execute();
        // キャラクターの衝突判定と位置の更新
        if (characters[i].stackMachine.x < leftWall) {
            characters[i].stackMachine.x = leftWall;
        }
        if (characters[i].stackMachine.x + characters[i].sprite.width > rightWall) {
            characters[i].stackMachine.x = rightWall - characters[i].sprite.width;
        }
        if (characters[i].stackMachine.y < upperWall) {
            characters[i].stackMachine.y = upperWall;
        }
        if (characters[i].stackMachine.y + characters[i].sprite.height > lowerWall) {
            characters[i].stackMachine.y = lowerWall - characters[i].sprite.height;
        }
        // キャラクターのスプライトの位置の更新
        characters[i].sprite.x = characters[i].stackMachine.x; 
        characters[i].sprite.y = characters[i].stackMachine.y;
        // キャラクターの分裂
        if (characters[i].stackMachine.isFork) {
            // 新しいスプライト
            const newCharacter = new PIXI.AnimatedSprite(necromancerTextures);
            newCharacter.x = characters[i].sprite.x + (Math.random() - 0.5) * 5;
            newCharacter.y = characters[i].sprite.y + (Math.random() - 0.5) * 5;
            newCharacter.width = characters[i].sprite.width;
            newCharacter.height = characters[i].sprite.height;
            newCharacter.animationSpeed = 0.1;
            newCharacter.loop = true;
            newCharacter.play();
            //app.stage.addChildAt(newCharacter, app.stage.getChildIndex(characters[characters.length-1].sprite)+1);
            app.stage.addChildAt(newCharacter, app.stage.getChildIndex(characters[i].sprite)+1);
            // 新しいスタックマシン
            const newStackMachine = 
                new StackMachine(newCharacter.x, 
                                 newCharacter.y, 
                                 characters[i].stackMachine.codes,
                                 characters[i].stackMachine.pc,
                                 deepCopy(characters[i].stackMachine.stack),
                                 deepCopy(characters[i].stackMachine.frames),
                                 deepCopy(characters[i].stackMachine.display)
                                 );
            characters.push({
                sprite: newCharacter,
                stackMachine: newStackMachine,
            })
            characters[i].stackMachine.isFork = false;
        }
        // 火の玉の作成（発射）
        if (characters[i].stackMachine.isFire) {
            const fireSprite = new PIXI.Sprite(fireTexture);
            fireSprite.anchor.set(0.5);
            fireSprite.x = characters[i].sprite.x +  characters[i].sprite.width / 2;
            fireSprite.y = characters[i].sprite.y + characters[i].sprite.height /2;
            fireSprite.width = blockSize * 1.2;
            fireSprite.height = blockSize *2/3 * 1.2;
            fireSprite.rotation = - characters[i].stackMachine.fireAngle * Math.PI / 180;
            app.stage.addChildAt(fireSprite, app.stage.getChildIndex(characters[characters.length-1].sprite)+1);
            fires.push({
                sprite: fireSprite, 
                vx: Math.cos(characters[i].stackMachine.fireAngle * Math.PI / 180) * 10,
                vy: Math.sin(characters[i].stackMachine.fireAngle * Math.PI / 180) * 10,
                isCollision: false,
            });
            characters[i].stackMachine.isFire = false;
        }
    }
    // 火の玉の位置更新
    for (let i=0; i<fires.length; i++) {
        const fireSprite = fires[i].sprite;
        fireSprite.x += fires[i].vx;
        fireSprite.y -= fires[i].vy;
        //衝突判定
        if (fireSprite.x < leftWall + blockSize * 0.2
            || fireSprite.x > rightWall - blockSize * 0.2
            || fireSprite.y < upperWall + blockSize * 0.2
            || fireSprite.y > lowerWall - blockSize * 0.2) fires[i].isCollision = true;
    }
    // 衝突した火の玉を削除
    for (let i=0; i<fires.length; i++) {
        if (fires[i].isCollision) {
            app.stage.removeChild(fires[i].sprite);
        }
    }
    fires = fires.filter(e => !e.isCollision);
}

// 戻るボタン
const backButton: HTMLButtonElement = document.getElementById('backButton') as HTMLButtonElement;
backButton.addEventListener('click', () => {
    window.location.href = 'title.html';
});

// ページ数
const pageLength: number = 5;

// ページ遷移ボタン
for (let i=1; i<=pageLength; i++) {
    // Backボタン
    if (i>1) {
        const backButton: HTMLButtonElement = document.getElementById(`backButton${i}`) as HTMLButtonElement;
        backButton.addEventListener('click', () => showPage(i-1));
    }
    // Nextボタン
    if (i<pageLength) {
        const nextButton: HTMLButtonElement = document.getElementById(`nextButton${i}`) as HTMLButtonElement;
        nextButton.addEventListener('click', () => showPage(i+1));
    }
    // Resetボタン
    if (1<i && i<pageLength) {
        document.getElementById(`resetButton${i}`).addEventListener('click', () => {
            resetScreen(i);
        })
    }
}

// スクリーンをリセットする関数
function resetScreen(pageId: number) {
    // アニメーションをストップ
    app.ticker.remove(animate);            
    // キャラクターを1体に
    for (let i=1; i<characters.length; i++) {
        app.stage.removeChild(characters[i].sprite);
    }
    characters = [characters[0]];
    // キャラクターを初期位置へ
    initialCharacterPoint(pageId);
    // 火の玉を削除
    for (let i=0; i<fires.length; i++) {
        app.stage.removeChild(fires[i].sprite);
    }
    fires = [];
    isRunning = false;
    // ファイル選択をリセット
    isFileSelected = false;
    (document.getElementById('fileInput') as HTMLInputElement).value = '';
    // ファイル名をリセット
    document.getElementById('fileName').textContent = '';
}

function showPage(pageId) {
    // すべてのページを非表示にする
    const pages = document.querySelectorAll('.page');
    pages.forEach(function(page) {
        page.classList.remove('active');
    });
    // コントロールコンテナーを非表示にする
    document.getElementById('ctrContainer').style.display = "none";

    // 指定されたページを表示する
    const targetPage = document.getElementById(`page${pageId}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    // p2以降ならコントロールコンテナーを表示する
    if (2<=pageId && pageId<pageLength) {
        document.getElementById('ctrContainer').style.display = "block";
        // pageIdのリセットボタンを表示する
        for (let i=2; i<pageLength; i++) { 
            document.getElementById(`resetButton${i}`).style.display = 'none';
        }
        document.getElementById(`resetButton${pageId}`).style.display = 'inline';
    }
    // ゲームスクリーンをリセット
    resetScreen(pageId);
}

// キャラクターの初期位置を設定する関数
function initialCharacterPoint(pageId: number) {
    switch (pageId) {
        case 1:
            necromancerSprite.x = blockSize * 8.5;
            necromancerSprite.y = blockSize * 8.5;
            break;
        case 2: 
            necromancerSprite.x = blockSize; 
            necromancerSprite.y = blockSize * 15;
            break;
        case 3:
            necromancerSprite.x = blockSize * 8.5;
            necromancerSprite.y = blockSize * 8.5;
            break;
        case 4:
            necromancerSprite.x = blockSize * 8.5;
            necromancerSprite.y = blockSize * 8.5;
            break;
        default : break;
    }
}

// オブジェクトの深いコピーを行う関数
function deepCopy(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj; // オブジェクトでない場合、または null の場合はそのまま返す
    }

    let copiedObject = Array.isArray(obj) ? [] : {}; // 配列かどうかに応じて新しいオブジェクトを作成

    for (let key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            copiedObject[key] = deepCopy(obj[key]); // プロパティごとに再帰的にコピー
        }
    }

    return copiedObject;
}