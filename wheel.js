document.addEventListener('DOMContentLoaded', () => {
    // 詢問抽獎次數
    let times = parseInt(prompt('請輸入抽獎次數：', '3'));
    if (isNaN(times) || times <= 0) {
        times = 3; // 預設
    }

    // 動態生成結果 li
    const resultsList = document.getElementById('results-list');
    for (let i = 1; i <= times; i++) {
        const li = document.createElement('li');
        li.id = `result-${i}`;
        li.textContent = `第${i}次結果: ?`;
        resultsList.appendChild(li);
    }

    // 桌次列表
    const startValue = 1;
    const endValue = 16;
    // 不能抽到的桌次
    const excludedDesks = [2, 3];
    const startButton = document.getElementById('startButton');
    const clearButton = document.getElementById('clearButton');
    const wheel = document.getElementById('wheel');
    
    // 1. 預先過濾可用桌次 (Pre-filter available desks)
    let availableDesks = Array.from({ length: endValue - startValue + 1 }, (_, i) => startValue + i).filter(d => !excludedDesks.includes(d));

    let results = [];
    let currentRotation = 0; // 紀錄目前旋轉角度

    function updateResultsDisplay() {
        for (let i = 0; i < times; i++) {
            const resultElement = document.getElementById(`result-${i + 1}`);
            resultElement.textContent = results[i] ? `第${i + 1}次結果: 桌次${results[i]}` : `第${i + 1}次結果: ?`;
        }
    }

    startButton.addEventListener('click', () => {
        if (results.length >= times || results.length >= availableDesks.length) return;

        startButton.disabled = true;
        clearButton.disabled = true;

        // 2. 隨取一個尚未被抽中的桌次
        const remainingDesks = availableDesks.filter(d => !results.includes(d));
        const newDesk = remainingDesks[Math.floor(Math.random() * remainingDesks.length)];
        
        // 3. 計算旋轉角度 (不重置為0，而是累加旋轉)
        const deskAngle = 360 / (endValue - startValue + 1);
        const targetIndex = newDesk - 1; // 根據你的圖片索引調整
        
        // 旋轉圈數(5圈) + 目標角度偏移
        // 注意：這裡的角度計算需對應你 wheel.png 的數字位置
        const additionalRotation = (360 * 5) + (targetIndex * deskAngle); 
		currentRotation += additionalRotation - currentRotation % 360;
        wheel.style.transition = 'transform 4s cubic-bezier(0.15, 0, 0.15, 1)';
        wheel.style.transform = `rotate(${currentRotation}deg)`;
        setTimeout(() => {
            results.push(newDesk);
            updateResultsDisplay();
			clearButton.disabled = false;
            startButton.disabled = results.length >= times;
        }, 4000);
    });

    // 清除最後一次結果
    clearButton.addEventListener('click', () => {
        if (results.length > 0) {
            results.pop();
            updateResultsDisplay();
        }
        startButton.disabled = false;
        wheel.style.transition = 'none';
        wheel.style.transform = `rotate(0deg)`;
    });

    bindEnterToButton('startButton');
});