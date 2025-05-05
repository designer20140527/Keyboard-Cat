// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const keySpace = document.getElementById('key-space');
    const keyA = document.getElementById('key-a');
    const keyD = document.getElementById('key-d');
    const key1 = document.getElementById('key-1');
    const key9 = document.getElementById('key-9');
    const catUp = document.getElementById('cat-up');
    const catBongos = document.querySelector('.cat-bongos'); // 获取Bongs图片元素
    const catContainer = document.querySelector('.cat-container');
    
    // 获取触屏按钮元素
    const touchMeow = document.getElementById('touch-meow');
    const touchLeft = document.getElementById('touch-left');
    const touchRight = document.getElementById('touch-right');
    const touchButtons = document.querySelectorAll('.touch-button');
    
    // 检测是否为触屏设备
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isMobileDevice = window.innerWidth <= 1024;
    
    // 如果是桌面设备，隐藏触屏控制区域
    if (!isTouchDevice && !isMobileDevice) {
        const touchControlsContainer = document.querySelector('.touch-controls-container');
        if (touchControlsContainer) {
            touchControlsContainer.style.display = 'none';
        }
    }
    
    // 跟踪当前状态 - 是否在钢琴模式
    let isPianoMode = false;
    // 跟踪当前按下的数字键
    let currentPianoKey = null;
    
    // 预加载图片
    const images = {
        up: 'assets/images/up.png',
        upMeow: 'assets/images/up-meow.png',
        leftDown: 'assets/images/left-down.png',
        rightDown: 'assets/images/right-down.png',
        bongos: 'assets/images/Bongs.png',
        keyboard: 'assets/images/Keyboard.png'
    };
    
    // 预加载图片函数
    function preloadImages() {
        for (const key in images) {
            const img = new Image();
            img.src = images[key];
        }
    }
    
    // 调用预加载函数
    preloadImages();

    // 音效对象
    const sounds = {
        meow: new Audio('assets/sounds/meow.mp3'),
        bongoLeft: new Audio('assets/sounds/bongoleft.wav'),
        bongoRight: new Audio('assets/sounds/bongoright.wav'),
        piano: [
            new Audio('https://freesound.org/data/previews/39/39186_35187-lq.mp3'),
            new Audio('https://freesound.org/data/previews/39/39187_35187-lq.mp3'),
            new Audio('https://freesound.org/data/previews/39/39188_35187-lq.mp3'),
            new Audio('https://freesound.org/data/previews/39/39189_35187-lq.mp3'),
            new Audio('https://freesound.org/data/previews/39/39190_35187-lq.mp3'),
            new Audio('https://freesound.org/data/previews/39/39191_35187-lq.mp3'),
            new Audio('https://freesound.org/data/previews/39/39193_35187-lq.mp3'),
            new Audio('https://freesound.org/data/previews/39/39194_35187-lq.mp3'),
            new Audio('https://freesound.org/data/previews/39/39195_35187-lq.mp3')
        ]
    };

    // 创建钢琴音符元素
    function createPianoNote(noteNumber) {
        const note = document.createElement('div');
        note.className = 'piano-note';
        note.textContent = '♪';
        
        // 检测设备宽度，为移动设备设置不同的位置
        if (window.innerWidth <= 1024) {
            // iPad和移动设备上音符居中显示
            note.style.left = '50%';
            note.style.transform = 'translateX(-50%)';
            note.style.top = '50px';
        } else {
            // 桌面版保持原来的位置
            note.style.left = `${150 + (noteNumber - 1) * 20}px`;
            note.style.top = '50px';
        }
        
        catContainer.appendChild(note);
        
        setTimeout(() => {
            catContainer.removeChild(note);
        }, 1000);
    }

    // 切换到钢琴模式
    function switchToPianoMode() {
        if (!isPianoMode) {
            catBongos.src = images.keyboard;
            isPianoMode = true;
        }
    }

    // 切换到邦戈鼓模式
    function switchToBongoMode() {
        if (isPianoMode) {
            catBongos.src = images.bongos;
            isPianoMode = false;
        }
    }

    // 按键事件处理函数
    function handleKeyDown(event) {
        const key = event.key.toLowerCase();
        
        // 空格键 - 喵叫
        if (key === ' ' || key === 'spacebar') {
            // 阻止空格键的默认滚动行为
            event.preventDefault();
            keySpace.classList.add('key-active');
            // 猫咪喵叫动画 - 更改图片并增大
            catUp.src = images.upMeow;
            catUp.style.transform = 'scale(1.05)';
            sounds.meow.currentTime = 0;
            sounds.meow.play();
            // 切换回邦戈鼓模式
            switchToBongoMode();
        }
        
        // A键 - 左邦戈鼓
        if (key === 'a') {
            keyA.classList.add('key-active');
            // 切换为左边敲击图片
            catUp.src = images.leftDown;
            sounds.bongoLeft.currentTime = 0;
            sounds.bongoLeft.play();
            // 切换回邦戈鼓模式
            switchToBongoMode();
        }
        
        // D键 - 右邦戈鼓
        if (key === 'd') {
            keyD.classList.add('key-active');
            // 切换为右边敲击图片
            catUp.src = images.rightDown;
            sounds.bongoRight.currentTime = 0;
            sounds.bongoRight.play();
            // 切换回邦戈鼓模式
            switchToBongoMode();
        }
        
        // 数字键1-9 - 钢琴
        if (key >= '1' && key <= '9') {
            const noteNumber = parseInt(key);
            const keyElement = document.getElementById(`key-${key}`);
            if (keyElement) keyElement.classList.add('key-active');
            
            // 记录当前按下的键
            currentPianoKey = noteNumber;
            
            // 切换到钢琴模式
            switchToPianoMode();
            
            // 根据数字的奇偶性改变猫咪图片
            if (noteNumber % 2 === 1) { // 奇数: 1,3,5,7,9
                catUp.src = images.leftDown;
            } else { // 偶数: 2,4,6,8
                catUp.src = images.rightDown;
            }
            
            // 播放音效并创建音符
            const noteIndex = noteNumber - 1;
            sounds.piano[noteIndex].currentTime = 0;
            sounds.piano[noteIndex].play();
            createPianoNote(noteNumber);
        }
    }

    function handleKeyUp(event) {
        const key = event.key.toLowerCase();
        
        // 释放空格键
        if (key === ' ' || key === 'spacebar') {
            keySpace.classList.remove('key-active');
            // 恢复猫咪原始状态
            catUp.src = images.up;
            catUp.style.transform = 'scale(1)';
        }
        
        // 释放A键
        if (key === 'a') {
            keyA.classList.remove('key-active');
            // 恢复原始图片
            catUp.src = images.up;
        }
        
        // 释放D键
        if (key === 'd') {
            keyD.classList.remove('key-active');
            // 恢复原始图片
            catUp.src = images.up;
        }
        
        // 释放数字键1-9
        if (key >= '1' && key <= '9') {
            const keyElement = document.getElementById(`key-${key}`);
            if (keyElement) keyElement.classList.remove('key-active');
            
            // 如果释放的是当前按下的数字键，恢复猫咪图片
            if (currentPianoKey === parseInt(key)) {
                catUp.src = images.up;
                currentPianoKey = null;
            }
            
            // 注意：我们在这里不切换回邦戈鼓模式，因为我们希望保持钢琴模式
        }
    }

    // 触屏控制事件处理 - 喵叫
    function handleMeowTouch() {
        // 猫咪喵叫动画 - 更改图片并增大
        catUp.src = images.upMeow;
        catUp.style.transform = 'scale(1.05)';
        sounds.meow.currentTime = 0;
        sounds.meow.play();
        // 切换回邦戈鼓模式
        switchToBongoMode();
        
        // 添加活跃状态样式
        touchMeow.classList.add('active');
    }
    
    // 触屏控制事件处理 - 左邦戈鼓
    function handleLeftTouch() {
        // 切换为左边敲击图片
        catUp.src = images.leftDown;
        sounds.bongoLeft.currentTime = 0;
        sounds.bongoLeft.play();
        // 切换回邦戈鼓模式
        switchToBongoMode();
        
        // 添加活跃状态样式
        touchLeft.classList.add('active');
    }
    
    // 触屏控制事件处理 - 右邦戈鼓
    function handleRightTouch() {
        // 切换为右边敲击图片
        catUp.src = images.rightDown;
        sounds.bongoRight.currentTime = 0;
        sounds.bongoRight.play();
        // 切换回邦戈鼓模式
        switchToBongoMode();
        
        // 添加活跃状态样式
        touchRight.classList.add('active');
    }
    
    // 触屏控制事件处理 - 钢琴音符
    function handlePianoTouch(noteNumber) {
        // 切换到钢琴模式
        switchToPianoMode();
        
        // 根据数字的奇偶性改变猫咪图片
        if (noteNumber % 2 === 1) { // 奇数: 1,3,5
            catUp.src = images.leftDown;
        } else { // 偶数: 2
            catUp.src = images.rightDown;
        }
        
        // 播放音效并创建音符
        const noteIndex = noteNumber - 1;
        if (sounds.piano[noteIndex]) {
            sounds.piano[noteIndex].currentTime = 0;
            sounds.piano[noteIndex].play();
            createPianoNote(noteNumber);
        }
    }
    
    // 触屏控制结束事件处理
    function handleTouchEnd() {
        // 恢复猫咪原始状态
        catUp.src = images.up;
        catUp.style.transform = 'scale(1)';
        
        // 移除所有触屏按钮的活跃状态
        touchButtons.forEach(button => {
            button.classList.remove('active');
        });
    }
    
    // 添加触屏事件监听
    if (touchMeow) {
        touchMeow.addEventListener('touchstart', handleMeowTouch);
        touchMeow.addEventListener('touchend', handleTouchEnd);
        // 添加鼠标事件用于在桌面端测试
        touchMeow.addEventListener('mousedown', handleMeowTouch);
        touchMeow.addEventListener('mouseup', handleTouchEnd);
    }
    
    if (touchLeft) {
        touchLeft.addEventListener('touchstart', handleLeftTouch);
        touchLeft.addEventListener('touchend', handleTouchEnd);
        // 添加鼠标事件用于在桌面端测试
        touchLeft.addEventListener('mousedown', handleLeftTouch);
        touchLeft.addEventListener('mouseup', handleTouchEnd);
    }
    
    if (touchRight) {
        touchRight.addEventListener('touchstart', handleRightTouch);
        touchRight.addEventListener('touchend', handleTouchEnd);
        // 添加鼠标事件用于在桌面端测试
        touchRight.addEventListener('mousedown', handleRightTouch);
        touchRight.addEventListener('mouseup', handleTouchEnd);
    }
    
    // 为钢琴数字按钮添加事件监听
    const pianoBtns = [
        document.getElementById('touch-1'),
        document.getElementById('touch-2'),
        document.getElementById('touch-3')
    ];
    
    pianoBtns.forEach((btn, index) => {
        if (btn) {
            const noteNumber = index + 1;
            btn.addEventListener('touchstart', () => handlePianoTouch(noteNumber));
            btn.addEventListener('touchend', handleTouchEnd);
            // 添加鼠标事件用于在桌面端测试
            btn.addEventListener('mousedown', () => handlePianoTouch(noteNumber));
            btn.addEventListener('mouseup', handleTouchEnd);
        }
    });

    // 添加键盘事件监听
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}); 