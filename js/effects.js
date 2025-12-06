// 点击屏幕特效
const effectContainer = document.getElementById('click-effect-container');
const effects = ['❤️', '✨', '💖', '🌟', '💕'];

// 监听屏幕点击事件
document.addEventListener('click', (e) => {
    // 排除特定元素的点击（如按钮、输入框等）
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || 
        e.target.classList.contains('article-card') || e.target.closest('.article-card')) {
        return;
    }
    
    createClickEffect(e.clientX, e.clientY);
});

// 创建点击特效
function createClickEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    
    // 随机选择一个特效符号
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    effect.textContent = randomEffect;
    
    // 设置位置
    effect.style.left = `${x - 15}px`; // 调整位置使其居中显示
    effect.style.top = `${y - 15}px`;
    
    // 设置随机颜色（粉色系渐变）
    const colors = ['#ff6b81', '#ff8fab', '#ff9ff3', '#feca57', '#ff9ff3'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    effect.style.color = randomColor;
    
    // 设置随机动画延迟
    effect.style.animationDelay = `${Math.random() * 0.2}s`;
    
    // 添加到容器
    effectContainer.appendChild(effect);
    
    // 动画结束后移除元素
    setTimeout(() => {
        effect.remove();
    }, 1000);
}

// 页面滚动时添加一些微妙的视觉效果
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // 为标题添加视差效果
    const headers = document.querySelectorAll('h1, h2, h3');
    headers.forEach(header => {
        const headerTop = header.getBoundingClientRect().top;
        if (headerTop > -100 && headerTop < window.innerHeight) {
            header.style.transform = `translateY(${scrollY * 0.02}px)`;
        }
    });
    
    // 为文章卡片添加滚动显示动画
    const cards = document.querySelectorAll('.article-card');
    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        if (cardTop < window.innerHeight - 100) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
});

// 为文章卡片添加初始动画样式
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.article-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // 触发一次滚动事件以显示初始可见的卡片
    window.dispatchEvent(new Event('scroll'));
});

// 为页面切换添加淡入淡出效果
function fadeInPage(pageElement) {
    pageElement.style.opacity = '0';
    pageElement.classList.remove('hidden');
    
    let opacity = 0;
    const interval = setInterval(() => {
        opacity += 0.1;
        pageElement.style.opacity = opacity;
        
        if (opacity >= 1) {
            clearInterval(interval);
        }
    }, 30);
}

function fadeOutPage(pageElement) {
    let opacity = 1;
    const interval = setInterval(() => {
        opacity -= 0.1;
        pageElement.style.opacity = opacity;
        
        if (opacity <= 0) {
            clearInterval(interval);
            pageElement.classList.add('hidden');
        }
    }, 30);
}