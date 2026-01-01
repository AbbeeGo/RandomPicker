# RandomPicker - 隨機抽獎系統

網頁抽獎應用程式，提供拉霸抽獎和輪盤抽獎兩種模式。

## 快速開始

1. **下載專案**:
   ```bash
   git clone https://github.com/AbbeeGo/RandomPicker.git
   ```

2. **開啟網頁**:
   - **拉霸抽獎**: 開啟 `pullbar.htm`
   - **輪盤抽獎**: 開啟 `wheel.htm`

## 抽獎模式

### 🎰 拉霸抽獎 (`pullbar.htm`)
- 拉霸捲動動畫效果
- 支援多獎項管理（頭獎、二獎、三獎）
- 自動避免重複抽中
- 可清除最後一筆結果

**使用方式**:
1. 選擇獎項
2. 點擊 GO 按鈕（或按 Enter）
3. 觀看動畫並查看得獎人

### 🎡 輪盤抽獎 (`wheel.htm`)
- 輪盤旋轉動畫
- 可排除特定桌次
- 支援多次抽獎

**使用方式**:
1. 輸入抽獎次數
2. 點擊「開始」按鈕
3. 查看抽獎結果

## 自訂設定

### 拉霸抽獎

所有常用參數都在 `pullbar.js` 最上方（第 1-41 行）：

```javascript
// 抽獎人名單（格式: 部門,姓名）
const users = `數位田曰總處,陳田曰
數位田曰業務處,傅田
...`;

// 捲動動畫時間（秒）
const SCROLL_DURATION = 5;

// 拉霸動畫後延遲時間（毫秒）
const ANIMATION_START_DELAY = 500;

// 捲動後顯示結果延遲時間（毫秒）
const HIDE_SCROLLING_DELAY = 2000;

// 動畫列表項目數量
const ANIMATION_LIST_SIZE = 20;
```

**修改獎項**: 編輯 `pullbar.htm` 第 14-17 行
```html
<label><input type="radio" name="award" value="5"><span>頭獎(5)</span></label>
<label><input type="radio" name="award" value="10"><span>二獎(10)</span></label>
```

### 輪盤抽獎

**修改桌次範圍**: 編輯 `wheel.js`
```javascript
const startValue = 1;
const endValue = 16;
```

**排除特定桌次**: 編輯 `wheel.js`
```javascript
const excludedDesks = [2, 3];  // 排除 2 和 3 桌
```

## 檔案結構

```
RandomPicker/
├── pullbar.htm          # 拉霸抽獎頁面
├── pullbar.js           # 拉霸抽獎邏輯
├── pullbar.css          # 拉霸機樣式
├── pullbar.png          # 拉霸機圖片（正常）
├── pullbar2.png         # 拉霸機圖片（拉桿下拉）
├── wheel.htm            # 輪盤抽獎頁面
├── wheel.js             # 輪盤抽獎邏輯
├── wheel.css            # 輪盤樣式
├── wheel.png            # 輪盤圖片
├── arrow.png            # 箭頭指標
├── util.js              # 工具函式
└── bg.png               # 背景圖片
```

## 執行畫面

### 輪盤抽獎模式
<img width="1641" height="910" alt="設定次數後初始畫面" src="https://github.com/user-attachments/assets/02333565-77bc-4f2e-9d5a-90e7c133072c" />

<img width="1644" height="915" alt="輪盤使用過程" src="https://github.com/user-attachments/assets/33f54607-08be-459c-bb9e-e26350712638" />

### 拉霸抽獎模式
<img width="1641" height="910" alt="初始畫面" src="https://dotblogsfile.blob.core.windows.net/user/abbee/17b7e60d-8483-4611-a7be-b16938fbc86c/1767279016.png.png" />

<img width="1641" height="910" alt="使用過程" src="https://dotblogsfile.blob.core.windows.net/user/abbee/17b7e60d-8483-4611-a7be-b16938fbc86c/1767279035.png.png" />

<img width="1641" height="910" alt="使用過程" src="https://dotblogsfile.blob.core.windows.net/user/abbee/17b7e60d-8483-4611-a7be-b16938fbc86c/1767279075.png.png" />