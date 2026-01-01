function bindEnterToButton(buttonId) {
    function handler(e) {
        if (e.key !== 'Enter') return;

        const el = e.target;
        const isTyping =
            el.tagName === 'TEXTAREA' ||
            (el.tagName === 'INPUT' && !['button', 'submit', 'checkbox', 'radio'].includes(el.type)) ||
            el.isContentEditable;

        if (isTyping) return;// 使用者正在輸入時，不攔截 Enter
        e.preventDefault();
        const btn = document.getElementById(buttonId);
        btn?.click();
    }
    document.addEventListener('keydown', handler);
}