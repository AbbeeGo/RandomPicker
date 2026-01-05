// ========================================
// 常用設定參數區 - 可依需求修改
// ========================================

//抽獎人名單 (格式: 部門,姓名)
const users = `數位田曰總處,陳田曰
數位田曰業務處,傅田
數位田曰業務處,陳田曰
數位田曰業務處,張田曰
數位田曰業務處,劉田曰田
數位田曰業務處,陳田曰
數位田曰業務處,石田曰田
數位田曰業務處,張田曰
田曰總處,鄭田曰
田曰暨信用卡田曰部,李田曰田
田曰暨信用卡田曰部,王田曰
田曰暨信用卡田曰部,蕭田曰
田曰暨信用卡田曰部,曾田曰田
信用卡處,江田
信用卡處,蔡田曰
信用卡處,徐田曰
信用卡處,王田
信用卡處,劉田曰
信用卡處,戴田曰田
信用卡處,李田曰
信用卡處,吳田曰田
信用卡處,林田
信用卡處,陳田曰
`;

// 捲動動畫時間設定 (單位: 秒)
const NAME_SCROLL_DURATION = 5;
const DEPARTMENT_SCROLL_DURATION = 4; // 部門秒數(比人名提早停止)

// 拉霸動畫後延遲時間 (單位: 毫秒)
const ANIMATION_START_DELAY = 500;

// 動畫列表項目數量 (捲動時顯示的項目數)
const ANIMATION_LIST_SIZE = 20;

// ========================================
// 主程式碼區
// ========================================

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

    // 用於動畫的固定列表 (從 userList 中取得指定數量的隨機項目)
    let animationList = shuffleArray(userList).slice(0, ANIMATION_LIST_SIZE);

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

    // 頁面載入時一次性建立動畫清單的 DOM 元素（固定 20 筆）
    function initializeScrollingList() {
        const scrollingDepartment = document.getElementById('scrollingDepartment');
        const scrollingName = document.getElementById('scrollingName');
        const scrollingArea = document.querySelector('.scrolling-area');
        const containerHeight = scrollingArea.offsetHeight;
        const itemHeight = containerHeight;

        // 清空容器
        scrollingDepartment.innerHTML = '';
        scrollingName.innerHTML = '';

        // 建立固定 20 筆資料的 DOM 元素
        animationList.forEach(item => {
            const deptDiv = document.createElement('div');
            deptDiv.textContent = item.department;
            deptDiv.style.height = itemHeight + 'px';
            scrollingDepartment.appendChild(deptDiv);

            const nameDiv = document.createElement('div');
            nameDiv.textContent = item.name;
            nameDiv.style.height = itemHeight + 'px';
            scrollingName.appendChild(nameDiv);
        });

        // 計算滾動距離：改為捲動到倒數第二個項目，讓最後一個項目停在畫面中
        const scrollDistance = (ANIMATION_LIST_SIZE - 1) * itemHeight;

        // 設置 CSS 變數
        scrollingDepartment.style.setProperty('--scroll-end-position', `-${scrollDistance}px`);
        scrollingDepartment.style.setProperty('--department-scroll-duration', `${DEPARTMENT_SCROLL_DURATION}s`);

        // 人名使用完整的捲動時間
        scrollingName.style.setProperty('--scroll-end-position', `-${scrollDistance}px`);
        scrollingName.style.setProperty('--scroll-duration', `${NAME_SCROLL_DURATION}s`);
    }

    // 每次抽獎時重置捲動位置
    function resetScrollingPosition() {
        const scrollingDepartment = document.getElementById('scrollingDepartment');
        const scrollingName = document.getElementById('scrollingName');

        // 重置位置到第一筆
        scrollingDepartment.style.transform = 'translateY(0)';
        scrollingName.style.transform = 'translateY(0)';
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
        departmentText.textContent = '得獎人單位';
        nameText.textContent = '得獎人';
    }

    function updateList() {
        const selectedAward = document.querySelector('.awards input[name="award"]:checked');
        if (!selectedAward) return;

        const value = selectedAward.value;
        scrollingContainer.classList.remove('active');
        resetDisplayText();

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
                    awardTitle.style.color = 'var(--gold)';
                    awardTitle.style.fontSize = '1.2em';
                    list.appendChild(awardTitle);

                    awardWinners[award].forEach((winner, index) => {
                        const li = document.createElement('li');
                        li.textContent = `${index + 1}. ${winner.department} - ${winner.name}`;
                        list.appendChild(li);
                    });
                }
            });

            if (allWinners.length === 0) {
                const li = document.createElement('li');
                li.textContent = '尚無得獎者';
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
                const winner = existingWinners[i];
                li.textContent = `${i + 1}. ${winner.department} - ${winner.name}`;
                drawnWinners.push(winner);
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
        const selectedAward = document.querySelector('.awards input[name="award"]:checked');
        if (selectedAward && selectedAward.value === 'all') {
            return;
        }

        if (drawnCount === currentAwardCount) return;

        // 按下 toggle 後立即鎖住所有控制項，防止重複點擊或切換獎項
        toggleButton.disabled = true;
        clearLastButton.disabled = true;
        // 鎖住所有 radio 按鈕
        awards.forEach(radio => radio.disabled = true);

        const winner = getRandomWinner();
        if (winner) {
            const barImage = document.getElementById('bar');
            const originalSrc = barImage.src;
            const animationStartDelay = ANIMATION_START_DELAY;
            const hideScrollingDelay = (NAME_SCROLL_DURATION - 2) * 1000;
            const departmentDuration = (DEPARTMENT_SCROLL_DURATION - 2) * 1000; // 部門停止時間(毫秒)

            // toggle 按下時清空 result-box 的文字
            departmentText.textContent = '';
            nameText.textContent = '';

            barImage.src = 'pullbar2.png';

            setTimeout(() => {
                // 換回原圖後,重新設定動畫內容並啟動
                barImage.src = originalSrc;

                // 重置捲動位置到第一筆
                resetScrollingPosition();

                // 顯示捲動容器
                scrollingContainer.classList.add('active');

                // 啟動捲動動畫
                const scrollingDepartment = document.getElementById('scrollingDepartment');
                const scrollingName = document.getElementById('scrollingName');

                // 重要：CSS 動畫重新觸發機制
                scrollingDepartment.classList.remove('animate');
                scrollingName.classList.remove('animate');

                // 強制瀏覽器重新計算樣式（觸發 reflow）
                void scrollingDepartment.offsetWidth;
                void scrollingName.offsetWidth;

                // 同時添加 animate class，兩者同時開始捲動
                // 但部門會因為 CSS 中設定較短的 duration 而提早停止
                scrollingDepartment.classList.add('animate');
                scrollingName.classList.add('animate');

                // 部門捲動完成後，先顯示部門結果
                setTimeout(() => {
                    departmentText.textContent = winner.department;
                }, departmentDuration);

                // 人名捲動完成後，隱藏 scrolling-box 並顯示人名結果
                setTimeout(() => {
                    // 隱藏捲動容器
                    scrollingContainer.classList.remove('active');

                    // 重置捲動位置回第一筆
                    scrollingDepartment.classList.remove('animate');
                    scrollingName.classList.remove('animate');

                    // 顯示人名結果（部門已在之前顯示）
                    nameText.textContent = winner.name;

                    // 更新得獎名單
                    const listItems = list.querySelectorAll('li');
                    listItems[drawnCount].textContent = `${drawnCount + 1}. ${winner.department} - ${winner.name}`;
                    drawnWinners.push(winner);
                    allWinners.push(winner);
                    awardWinners[currentAward].push(winner);
                    drawnCount++;

                    // 當抽出第11個(含)以後的得獎人時,自動捲動到該項目
                    if (drawnCount >= 11) {
                        listItems[drawnCount - 1].scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest'
                        });
                    }

                    // 顯示得獎人後，解鎖所有控制項（toggle 按鈕除非已抽完所有名額）
                    toggleButton.disabled = drawnCount === currentAwardCount;
                    clearLastButton.disabled = false;
                    // 解鎖所有 radio 按鈕
                    awards.forEach(radio => radio.disabled = false);
                }, hideScrollingDelay);
            }, animationStartDelay);


        } else {
            // 如果沒有得獎人（隊列為空），解鎖所有控制項
            toggleButton.disabled = false;
            clearLastButton.disabled = false;
            awards.forEach(radio => radio.disabled = false);
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
        }
    });

    // 初始設定
    initializeScrollingList();  // 頁面載入時一次性建立動畫清單
    updateList();
});
