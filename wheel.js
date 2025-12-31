document.addEventListener('DOMContentLoaded', () => {
    //抽獎次數
    const times = 3;
    bindEnterToButton('startButton');
    const startButton = document.getElementById('startButton');
    const clearButton = document.getElementById('clearButton');
    const wheel = document.getElementById('wheel');
    // 桌次列表
    const startValue = 1;
    const endValue = 16;
    const Desks = Array.from({ length: endValue - startValue + 1 }, (_, i) => startValue + i);
    // 不能抽到的桌次
    const excludedDesks = [2, 3];
    const results = [];
    let spinCount = 0;

    // 更新結果顯示
    function updateResultsDisplay() {
        for (let i = 0; i < times; i++) {
            const resultElement = document.getElementById(`result-${i + 1}`);
            if (results[i]) {
                resultElement.textContent = `第${i + 1}次結果: 桌次${results[i]}`;
            } else {
                resultElement.textContent = `第${i + 1}次結果: ?`;
            }
        }
    }

    // 檢查按鈕狀態
    function checkButtonState() {
        startButton.disabled = spinCount >= times;
    }

    // 開始抽獎
    startButton.addEventListener('click', () => {
        if (spinCount >= times || startButton.disabled) {
            return;
        }
        startButton.disabled = true; // 防止動畫期間重複點擊

        // 步驟 1: 重設轉盤到 0 度
        wheel.style.transition = 'none';
        wheel.style.transform = 'rotate(0deg)';

        // 步驟 2: 確保重設先生效，再開始新動畫
        requestAnimationFrame(() => {
            // 強制瀏覽器重新計算樣式，確保重設被應用
            // 這是一個確保動畫正常播放的技巧
            wheel.offsetHeight;

            let newDesk;
            // 確保抽到的桌次不重複，且不在排除名單中
            do {
                const DeskIndex = Math.floor(Math.random() * Desks.length);
                newDesk = Desks[DeskIndex];
            } while (results.includes(newDesk) || excludedDesks.includes(newDesk));

            // 模擬轉盤動畫
            const totalRotation = 360 * 5; // 轉5圈
            const DeskAngle = 360 / Desks.length;
            const angleOffset = DeskAngle / 2;
			//角度要視你採用的圖片編號位置修改
            const finalAngle = totalRotation + (Desks.indexOf(newDesk) * DeskAngle);

            // 步驟 3: 開始旋轉
            wheel.style.transition = 'transform 4s ease-out';
            wheel.style.transform = `rotate(${finalAngle}deg)`;

            // 動畫結束後處理
            setTimeout(() => {
                results[spinCount] = newDesk;
                spinCount++;
                updateResultsDisplay();
                checkButtonState(); // 這裡會根據 spinCount 決定是否重新啟用按鈕

                // 為了讓下次重設時沒有不自然的反轉動畫，將轉盤角度設定為 360 度內的等效角度
                wheel.style.transition = 'none';
                const currentRotation = finalAngle % 360;
                wheel.style.transform = `rotate(${currentRotation}deg)`;
            }, 4000);
        });
    });

    // 清除最後一次結果
    clearButton.addEventListener('click', () => {
        if (spinCount > 0) {
            spinCount--;
            results.pop();
            updateResultsDisplay();
            checkButtonState();
        }
    });

    // 初始化
    updateResultsDisplay();
    checkButtonState();
});