import './title.css';

// スタートボタン
const startButton: HTMLButtonElement = document.getElementById('startButton') as HTMLButtonElement;
startButton.addEventListener('click', () => {
    window.location.href = 'stageSelector.html';
});

// 遊び方ボタン
const howToPlayButton: HTMLButtonElement = document.getElementById('howToPlayButton') as HTMLButtonElement;
howToPlayButton.addEventListener('click', () => {
    window.location.href = 'howToPlay.html';
});

// ドキュメントボタン
const documentButton: HTMLButtonElement = document.getElementById('documentButton') as HTMLButtonElement;
documentButton.addEventListener('click', () => {
    window.location.href = 'document.html';
});