import './stageSelector.css';
import { stageNames } from '../main/stageNames';
import { ipcRenderer } from 'electron';

// パネルコンテナ
const panelContainer = document.getElementById('panelContainer');
panelContainer.innerHTML = '';


// データベースクエリ処理（実装途中）
/*
async function queryDatabase(query) {
    try {
        const result = await ipcRenderer.invoke('query-database', query);
        console.log('Query result:', result);
        return result;
    } catch (error) {
        console.error('Error querying database:', error);
        throw error;
    }
}
*/

// パネル
for (let i=1; i <= 100; i++) {
    // パネル要素作成
    const panel = document.createElement('div');
    panel.classList.add('panel');
    panel.textContent = String(i);
    panel.addEventListener('click', createModal);
    panelContainer.appendChild(panel);

    // パネル要素のロック画像要素作成（とりあえずStage 6以上はロック）
    if (i>0) {
        panel.textContent = '';
        panel.classList.add('locked');
        panel.removeEventListener('click', createModal);
        panel.addEventListener('click', () => { window.alert('This stage is still locked.')});
    }

    //モーダル作成
    function createModal() {
        openModal(i);
        const stageNumber = document.getElementById('stageNumber');
        const stage_title = document.getElementById('stage-title');
        stageNumber.innerHTML = `${i}`;
        stage_title.innerHTML = stageNames[i-1];
    }
}

// Backボタン
const backButton = document.getElementById('backButton');
backButton.addEventListener('click', () => { window.location.href = 'title.html'});

// Closureボタン
const closure = document.getElementById('closure');
closure.addEventListener('click', () => closeModal());

// オーバーレイ
const overlay = document.getElementById('overlay');
overlay.addEventListener('click', () => closeModal());

//モーダルを開く
function openModal(i: number) {
    //モーダルとオーバーレイを可視化
    document.getElementById("modal").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    //Startボタンがあれば削除
    if (document.getElementById('startButton')) document.getElementById('startButton').remove();
    //Startボタンを作成
    const startButton = document.createElement('button');
    startButton.addEventListener('click', () => {
        window.location.href = `stage.html?stageNumber=${i}`;
    });
    startButton.classList.add('button');
    startButton.setAttribute('id', 'startButton');
    startButton.textContent = 'Start';
    const modal = document.getElementById('modal');
    //Startボタンをモーダルに追加
    modal.appendChild(startButton);
}

//モーダルを閉じる
function closeModal() {
    //モーダルとオーバーレイを非表示に
    document.getElementById("modal").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    //Startボタンを削除
    const startButton = document.getElementById('startButton');
    startButton.remove();
}