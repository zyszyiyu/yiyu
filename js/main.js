// 页面元素
const homePage = document.getElementById('home-page');
const categoryPage = document.getElementById('category-page');
const searchPage = document.getElementById('search-page');
const articlePage = document.getElementById('article-page');

// 按钮元素
const searchBtn = document.getElementById('search-btn');
const categorySearchBtn = document.getElementById('category-search-btn');
const backToHomeBtn = document.getElementById('back-to-home');
const searchBackToHomeBtn = document.getElementById('search-back-to-home');
const articleBackBtn = document.getElementById('article-back');
const searchSubmitBtn = document.getElementById('search-submit');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const searchPrevPageBtn = document.getElementById('search-prev-page');
const searchNextPageBtn = document.getElementById('search-next-page');

// 轮播图元素
const carouselSlide = document.querySelector('.carousel-slide');
const carouselImg = document.querySelector('.carousel-img');
const carouselTitle = document.querySelector('.carousel-title');
const carouselAuthor = document.querySelector('.carousel-author');
const carouselPrev = document.querySelector('.carousel-prev');
const carouselNext = document.querySelector('.carousel-next');

// 其他元素
const categoryList = document.querySelector('.category-list');
const categoryTitle = document.querySelector('.category-title');
const articleList = document.querySelector('.article-list');
const searchResults = document.querySelector('.search-results');
const searchInput = document.getElementById('search-input');
const pageInfo = document.getElementById('page-info');
const searchPageInfo = document.getElementById('search-page-info');
const articleTitle = document.querySelector('.article-title');
const articleAuthor = document.querySelector('.article-author');
const articleDate = document.querySelector('.article-date');
const articleBody = document.querySelector('.article-body');

// 全局变量
let articles = [];
let currentCategory = '';
let currentSearchTerm = '';
let currentPage = 1;
let currentSearchPage = 1;
const itemsPerPage = 5;
let fromPage = 'home'; // 用于记录来源页面，方便返回
let featuredArticles = [];
let currentCarouselIndex = 0;

// 初始化函数
function init() {
    // 加载文章数据
    loadData();
    
    // 设置事件监听器
    setupEventListeners();
    
    // 初始化轮播图
    // 注意：轮播图初始化将在数据加载完成后进行
    
    // 初始化分类导航
    // 注意：分类导航初始化将在数据加载完成后进行
}

// 加载文章数据
function loadData() {
    // 从 JSON 文件加载数据
    fetch('js/data.json')
        .then(response => response.json())
        .then(data => {
            articles = data;
            console.log('文章数据加载完成');
            // 数据加载完成后初始化轮播图和分类导航
            initCarousel();
            initCategories();
        })
        .catch(error => {
            console.error('加载数据失败:', error);
        });
}

// 设置事件监听器
function setupEventListeners() {
    // 搜索按钮点击事件
    searchBtn.addEventListener('click', () => {
        navigateToSearchPage();
    });
    
    categorySearchBtn.addEventListener('click', () => {
        fromPage = 'category';
        navigateToSearchPage();
    });
    
    // 返回主页按钮点击事件
    backToHomeBtn.addEventListener('click', navigateToHomePage);
    searchBackToHomeBtn.addEventListener('click', navigateToHomePage);
    
    // 文章页面返回按钮点击事件
    articleBackBtn.addEventListener('click', () => {
        if (fromPage === 'category') {
            navigateToCategoryPage(currentCategory);
        } else if (fromPage === 'search') {
            navigateToSearchPage();
        } else {
            navigateToHomePage();
        }
    });
    
    // 搜索提交事件
    searchSubmitBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // 分页按钮事件
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayCategoryArticles(currentCategory, currentPage);
        }
    });
    
    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filterArticlesByCategory(currentCategory).length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayCategoryArticles(currentCategory, currentPage);
        }
    });
    
    searchPrevPageBtn.addEventListener('click', () => {
        if (currentSearchPage > 1) {
            currentSearchPage--;
            displaySearchResults(currentSearchTerm, currentSearchPage);
        }
    });
    
    searchNextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(searchArticles(currentSearchTerm).length / itemsPerPage);
        if (currentSearchPage < totalPages) {
            currentSearchPage++;
            displaySearchResults(currentSearchTerm, currentSearchPage);
        }
    });
    
    // 轮播图事件
    carouselPrev.addEventListener('click', showPrevSlide);
    carouselNext.addEventListener('click', showNextSlide);
    carouselSlide.addEventListener('click', () => {
        if (featuredArticles.length > 0) {
            navigateToArticlePage(featuredArticles[currentCarouselIndex].id);
        }
    });
    
    // 自动轮播
    setInterval(showNextSlide, 5000);
}

// 初始化轮播图
function initCarousel() {
    // 从文章数据中选择精选文章
    featuredArticles = articles.filter(article => article.featured);
    
    if (featuredArticles.length > 0) {
        updateCarousel();
    }
}

// 使用fetch API重写图片加载函数
async function loadImageWithFetch(imgElement, imageName) {
    const imagePath = `images/${imageName}`;
    console.log(`开始加载图片: ${imagePath}`);
    
    try {
        // 使用fetch API获取图片
        const response = await fetch(imagePath, {
            method: 'GET',
            headers: {
                'Accept': 'image/jpeg, image/png, image/gif, image/webp, */*'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // 转换为Blob对象并创建Object URL
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        
        // 设置图片src
        imgElement.src = objectUrl;
        console.log(`图片加载成功: ${imagePath}`);
        
        // 图片加载完成后释放Object URL
        imgElement.onload = function() {
            URL.revokeObjectURL(objectUrl);
        };
        
        // 错误处理
        imgElement.onerror = function() {
            console.error(`图片设置失败: ${imagePath}`);
            // 设置默认图片
            imgElement.src = '';
        };
        
    } catch (error) {
        console.error(`图片加载失败: ${imagePath}`, error);
        // 加载失败时可以设置备用图片
        imgElement.src = '';
    }
}

// 更新轮播图内容
function updateCarousel() {
    const article = featuredArticles[currentCarouselIndex];
    console.log(`更新轮播图: ${article.title}, 封面: ${article.cover}`);
    
    // 使用fetch API加载图片
    loadImageWithFetch(carouselImg, article.cover);
    
    carouselImg.alt = article.title;
    carouselTitle.textContent = article.title;
    carouselAuthor.textContent = article.author;
}

// 显示上一张轮播图
function showPrevSlide() {
    currentCarouselIndex = (currentCarouselIndex - 1 + featuredArticles.length) % featuredArticles.length;
    updateCarousel();
}

// 显示下一张轮播图
function showNextSlide() {
    currentCarouselIndex = (currentCarouselIndex + 1) % featuredArticles.length;
    updateCarousel();
}

// 初始化分类导航
function initCategories() {
    // 提取所有不重复的分类
    const categories = [...new Set(articles.map(article => article.category))];
    
    categories.forEach(category => {
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.innerHTML = `<h3>${category}</h3>`;
        categoryItem.addEventListener('click', () => {
            navigateToCategoryPage(category);
        });
        categoryList.appendChild(categoryItem);
    });
    
    // 检查URL参数中是否有分类信息
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        navigateToCategoryPage(categoryParam);
    }
}

// 根据分类筛选文章
function filterArticlesByCategory(category) {
    return articles.filter(article => article.category === category);
}

// 搜索文章
function searchArticles(term) {
    return articles.filter(article => 
        article.title.toLowerCase().includes(term.toLowerCase())
    );
}

// 分页获取文章
function getPaginatedArticles(articleList, page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return articleList.slice(startIndex, endIndex);
}

// 显示分类文章列表
function displayCategoryArticles(category, page) {
    const filteredArticles = filterArticlesByCategory(category);
    const paginatedArticles = getPaginatedArticles(filteredArticles, page);
    
    articleList.innerHTML = '';
    
    if (paginatedArticles.length === 0) {
        articleList.innerHTML = '<p style="text-align: center; color: #ff6b81; font-size: 1.2rem;">该分类下暂无文章</p>';
    } else {
        paginatedArticles.forEach(article => {
            const articleCard = createArticleCard(article);
            articleList.appendChild(articleCard);
        });
    }
    
    // 更新分页信息
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
    pageInfo.textContent = `第 ${page} 页，共 ${totalPages} 页`;
    
    // 禁用/启用分页按钮
    prevPageBtn.disabled = page === 1;
    nextPageBtn.disabled = page === totalPages;
}

// 显示搜索结果
function displaySearchResults(term, page) {
    const searchResultArticles = searchArticles(term);
    const paginatedArticles = getPaginatedArticles(searchResultArticles, page);
    
    searchResults.innerHTML = '';
    
    if (paginatedArticles.length === 0) {
        searchResults.innerHTML = `<p style="text-align: center; color: #ff6b81; font-size: 1.2rem;">未找到与 "${term}" 相关的文章</p>`;
    } else {
        paginatedArticles.forEach(article => {
            const articleCard = createArticleCard(article);
            searchResults.appendChild(articleCard);
        });
    }
    
    // 更新分页信息
    const totalPages = Math.ceil(searchResultArticles.length / itemsPerPage);
    searchPageInfo.textContent = `第 ${page} 页，共 ${totalPages} 页`;
    
    // 禁用/启用分页按钮
    searchPrevPageBtn.disabled = page === 1;
    searchNextPageBtn.disabled = page === totalPages;
}

// 创建文章卡片
function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'article-card';
    
    // 先创建基本结构
    card.innerHTML = `
        <img class="article-cover" alt="${article.title}">
        <div class="article-info">
            <h3 class="article-card-title">${article.title}</h3>
            <div class="article-card-author">作者：${article.author}</div>
            <div class="article-card-date">发布时间：${article.date}</div>
            <p class="article-card-excerpt">${article.excerpt}</p>
        </div>
    `;
    
    // 获取img元素并使用fetch API加载图片
    const imgElement = card.querySelector('.article-cover');
    console.log(`创建文章卡片: ${article.title}, 封面: ${article.cover}`);
    loadImageWithFetch(imgElement, article.cover);
    
    card.addEventListener('click', () => {
        navigateToArticlePage(article.id);
    });
    
    return card;
}

// 执行搜索
function performSearch() {
    currentSearchTerm = searchInput.value.trim();
    currentSearchPage = 1;
    fromPage = 'search';
    
    if (currentSearchTerm) {
        displaySearchResults(currentSearchTerm, currentSearchPage);
    }
}

// 导航到主页
function navigateToHomePage() {
    // 隐藏所有页面
    fadeOutPage(categoryPage);
    fadeOutPage(searchPage);
    fadeOutPage(articlePage);
    
    // 显示主页
    setTimeout(() => {
        fadeInPage(homePage);
    }, 300);
}

// 导航到分类页面
function navigateToCategoryPage(category) {
    currentCategory = category;
    currentPage = 1;
    fromPage = 'category';
    
    categoryTitle.textContent = category;
    displayCategoryArticles(category, currentPage);
    
    // 隐藏当前页面，显示分类页面
    fadeOutPage(homePage);
    fadeOutPage(searchPage);
    fadeOutPage(articlePage);
    
    setTimeout(() => {
        fadeInPage(categoryPage);
    }, 300);
}

// 导航到搜索页面
function navigateToSearchPage() {
    // 隐藏当前页面，显示搜索页面
    fadeOutPage(homePage);
    fadeOutPage(categoryPage);
    fadeOutPage(articlePage);
    
    setTimeout(() => {
        fadeInPage(searchPage);
        // 聚焦搜索框
        searchInput.focus();
    }, 300);
}

// 导航到文章阅读页面
function navigateToArticlePage(articleId) {
    const article = articles.find(a => a.id === articleId);
    
    if (article) {
        articleTitle.textContent = article.title;
        articleAuthor.textContent = `作者：${article.author}`;
        articleDate.textContent = `发布时间：${article.date}`;
        
        // 渲染文章内容
        articleBody.innerHTML = '';
        const paragraphs = article.content.split('\n');
        paragraphs.forEach(paragraph => {
            if (paragraph.trim()) {
                const p = document.createElement('p');
                p.textContent = paragraph;
                p.className = 'article-paragraph';
                articleBody.appendChild(p);
            }
        });
        
        // 隐藏当前页面，显示文章页面
        fadeOutPage(homePage);
        fadeOutPage(categoryPage);
        fadeOutPage(searchPage);
        
        setTimeout(() => {
            fadeInPage(articlePage);
        }, 300);
    }
}

// 当页面加载完成后初始化
window.addEventListener('load', init);