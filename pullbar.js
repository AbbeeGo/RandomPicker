
//抽獎人名單
const users = `數位金融總處,陳※豪
數位金融業務處,傅※樵
數位金融業務處,陳※綱
數位金融業務處,張※倩
數位金融業務處,劉※瑜
數位金融業務處,陳※穎
數位金融業務處,石※玄
數位金融業務處,張※倫
數位金融總處,鄭※群
消金暨信用卡營管部,李※芳
消金暨信用卡營管部,王※冠
消金暨信用卡營管部,蕭※萍
消金暨信用卡營管部,曾※仁
信用卡處,江※霖
信用卡處,蔡※純
信用卡處,徐※達
信用卡處,王※權
信用卡處,劉※伶
信用卡處,戴※亘
信用卡處,李※蘋
信用卡處,吳※君
信用卡處,林※涵
信用卡處,陳※青
`;

document.addEventListener('DOMContentLoaded', () => {
    //將人名轉成陣列
    const userList = users.trim().split('\n').map(line => {
        const [department, name] = line.split(',');
        return { department, name };
    });

    // 隨機排序函數
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // 建立隨機排序的隊列
    let userQueue = shuffleArray(userList);

    // 新增: 用於動畫的列表 (從 userList 中取得 20 個隨機項目)
    let animationList = userList.slice(0, 20);

    // 從 radio button 取得獎項名稱（去除括號內的數字）
    function getAwardName(radio) {
        const spanText = radio.nextElementSibling.textContent;
        // 取得括號前的文字作為獎項名稱
        return spanText.replace(/\([^)]*\)/g, '').trim();
    }

    // 動態建立 awardWinners 物件
    function initializeAwardWinners() {
        const winners = {};
        const awards = document.querySelectorAll('.awards input[name="award"]');
        awards.forEach(radio => {
            if (radio.value !== 'all') {
                const awardName = getAwardName(radio);
                winners[awardName] = [];
            }
        });
        return winners;
    }

    // 初始化動畫 - 修正：每次抽獎前都要重新設定
    function setupScrollingAnimation() {
        const scrollingDepartment = document.getElementById('scrollingDepartment');
        const scrollingName = document.getElementById('scrollingName');
                
        // 清空舊內容並重置位置
        scrollingDepartment.innerHTML = '';
        scrollingName.innerHTML = '';
        scrollingDepartment.style.transform = 'translateY(0)';
        scrollingName.style.transform = 'translateY(0)';

        // 為了無縫銜接，將列表複製一份接在後面
        const listForAnimation = [...animationList, ...animationList];

        listForAnimation.forEach(item => {
            const deptDiv = document.createElement('div');
            deptDiv.textContent = item.department;
            scrollingDepartment.appendChild(deptDiv);

            const nameDiv = document.createElement('div');
            nameDiv.textContent = item.name;
            scrollingName.appendChild(nameDiv);
        });
    }

    bindEnterToButton('toggle');
    const awards = document.querySelectorAll('.awards input[name="award"]');
    const list = document.getElementById('list');
    const toggleButton = document.getElementById('toggle');
    const clearLastButton = document.getElementById('clearLast');
    const departmentText = document.getElementById('departmentText');
    const nameText = document.getElementById('nameText');
    const scrollingContainer = document.getElementById('scrollingContainer');

    let drawnCount = 0;
    let drawnWinners = [];
    let allWinners = [];
    let awardWinners = initializeAwardWinners();
    let currentAward = '';
    let currentAwardCount = 0;

    function resetDisplayText() {
        departmentText.textContent = '部/處';
        nameText.textContent = '姓名';
        departmentText.classList.remove('show');
        nameText.classList.remove('show');
    }

    function updateList() {
        const selectedAward = document.querySelector('.awards input[name="award"]:checked');
        if (!selectedAward) return;

        const value = selectedAward.value;
        scrollingContainer.classList.remove('active');
        resetDisplayText();
        departmentText.classList.add('show');
        nameText.classList.add('show');

        // 如果選擇「全部得獎名單」
        if (value === 'all') {
            list.innerHTML = '';
            clearLastButton.style.display = 'none';

            // 顯示各獎項的得獎者
            Object.keys(awardWinners).forEach(award => {
                if (awardWinners[award].length > 0) {
                    const awardTitle = document.createElement('li');
                    awardTitle.innerHTML = `<strong>${award}</strong>`;
                    awardTitle.style.marginTop = '10px';
                    list.appendChild(awardTitle);

                    awardWinners[award].forEach((winner, index) => {
                        const li = document.createElement('li');
                        li.textContent = `  ${index + 1}. ${winner.department} - ${winner.name}`;
                        li.style.paddingLeft = '20px';
                        list.appendChild(li);
                    });
                }
            });

            if (allWinners.length === 0) {
                const li = document.createElement('li');
                li.textContent = '尚無得獎者';
                li.style.color = '#999';
                list.appendChild(li);
            }
            return;
        }

        // 一般獎項模式
        clearLastButton.style.display = 'block';

        const count = parseInt(value, 10);
        currentAwardCount = count;

        // 設定當前獎項（從 radio button 的 span 文字取得）
        currentAward = getAwardName(selectedAward);

        list.innerHTML = '';
        drawnCount = 0;
        drawnWinners = [];

        // 顯示該獎項已抽出的得獎者
        const existingWinners = awardWinners[currentAward];
        for (let i = 0; i < count; i++) {
            const li = document.createElement('li');
            if (i < existingWinners.length) {
                li.textContent = `${existingWinners[i].department} - ${existingWinners[i].name}`;
                drawnWinners.push(existingWinners[i]);
                drawnCount++;
            } else {
                li.textContent = `第 ${i + 1} 位`;
            }
            li.dataset.index = i;
            list.appendChild(li);
        }

        toggleButton.disabled = drawnCount === count;
    }

    function getRandomWinner() {
        if (userQueue.length === 0) {
            alert('隊列中已無可抽選的人員!');
            return null;
        }
        return userQueue.shift();
    }

    awards.forEach(radio => {
        radio.addEventListener('change', updateList);
    });

    toggleButton.addEventListener('click', () => {
        if (drawnCount === currentAwardCount) return;
        toggleButton.disabled = true;
        clearLastButton.disabled = true;

        const winner = getRandomWinner();
        if (winner) {
            const barImage = document.getElementById('bar');
            const originalSrc = barImage.src;
            const sec = 4000; //要比動畫早顯示結果
            
            // 立即清空 result-box 的文字
            departmentText.textContent = '';
            nameText.textContent = '';
            departmentText.classList.remove('show');
            nameText.classList.remove('show');
            
            barImage.src = 'pullbar2.png';
            
            setTimeout(() => {
                // 換回原圖後,重新設定動畫內容並啟動
                barImage.src = originalSrc;
                
                // 重新設定動畫內容
                setupScrollingAnimation();
                
                // 顯示捲動容器
                scrollingContainer.classList.add('active');
                
                // 啟動動畫
                const scrollingDepartment = document.getElementById('scrollingDepartment');
                const scrollingName = document.getElementById('scrollingName');
                
                // 移除舊動畫 class（如果存在）
                scrollingDepartment.classList.remove('animate');
                scrollingName.classList.remove('animate');
                
                // 強制重排 - 讓瀏覽器重新計算樣式
                void scrollingDepartment.offsetWidth;
                void scrollingName.offsetWidth;
                
                // 重新添加動畫 class
                scrollingDepartment.classList.add('animate');
                scrollingName.classList.add('animate');
            }, 500);

            // 動畫完成後更新列表
            setTimeout(() => {
                // 停止並隱藏捲動動畫
                const scrollingDepartment = document.getElementById('scrollingDepartment');
                const scrollingName = document.getElementById('scrollingName');
                scrollingDepartment.classList.remove('animate');
                scrollingName.classList.remove('animate');
                scrollingContainer.classList.remove('active');
                
                // 顯示最終結果
                departmentText.textContent = winner.department;
                nameText.textContent = winner.name;
                departmentText.classList.add('show');
                nameText.classList.add('show');

                const listItems = list.querySelectorAll('li');
                listItems[drawnCount].textContent = `${winner.department} - ${winner.name}`;
                drawnWinners.push(winner);
                allWinners.push(winner);
                awardWinners[currentAward].push(winner);
                drawnCount++;
                toggleButton.disabled = drawnCount === currentAwardCount;
                clearLastButton.disabled = false;
            }, sec);
        } else {
            toggleButton.disabled = false;
            clearLastButton.disabled = false;
        }
    });

    clearLastButton.addEventListener('click', () => {
        if (drawnCount > 0) {
            const removedWinner = drawnWinners.pop();
            if (removedWinner) {
                // 將移除的人員放回抽獎隊列的最前端，以便下次可以再抽到
                userQueue.unshift(removedWinner);

                drawnCount--;
                const listItems = list.querySelectorAll('li');
                listItems[drawnCount].textContent = `第 ${drawnCount + 1} 位`;

                const index = allWinners.findIndex(w => w.name === removedWinner.name && w.department === removedWinner.department);
                if (index !== -1) {
                    allWinners.splice(index, 1);
                }
                const awardIndex = awardWinners[currentAward].findIndex(w => w.name === removedWinner.name && w.department === removedWinner.department);
                if (awardIndex !== -1) {
                    awardWinners[currentAward].splice(awardIndex, 1);
                }
            }

            console.log(`清除了第 ${drawnCount + 1} 個結果`);
            toggleButton.disabled = false;
            resetDisplayText();
            departmentText.classList.add('show');
            nameText.classList.add('show');
        }
    });

    // 初始設定
    updateList();
});