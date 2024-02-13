import './document.css';
// 戻るボタン
const backButton: HTMLButtonElement = document.getElementById('backButton') as HTMLButtonElement;
backButton.addEventListener('click', () => {
    window.location.href = 'title.html';
});
