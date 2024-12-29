const style = 'font-size: 16px; font-weight: bold; font-family: "Arial"; background-color: black; padding: 5px; border: 2px solid blue; border-radius: 5px;';
console.log('%c 欢迎来到AlightMotionWiki', style);
document.addEventListener('DOMContentLoaded', function() {
  const navItems = document.querySelectorAll('.nav-item');
  const sliderBar = document.querySelector('.slider-bar');
  const modeToggle = document.getElementById('modeToggle');
  const contents = document.querySelectorAll('.content');
  const searchBox = document.querySelector('.search-box');
  const searchButton = document.querySelector('.search-button');
  const searchModal = document.getElementById('searchModal');
  const searchResults = document.getElementById('searchResults');
  const closeBtn = document.querySelector('.close');
  let allPosts = []; // 用于存储所有帖子数据

  // 更新滑动条位置
  function updateSliderPosition() {
    const activeItem = document.querySelector('.nav-item.active');
    if (activeItem) {
      const rect = activeItem.getBoundingClientRect();
      sliderBar.style.width = `${rect.width}px`;
      sliderBar.style.left = `${rect.left}px`;
    }
  }

  // 切换暗色模式
  function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    updateModeToggleIcons();
  }

  // 更新模式切换按钮的图标显示
  function updateModeToggleIcons() {
    if (document.body.classList.contains('dark-mode')) {
      modeToggle.querySelector('.fa-sun').style.display = 'inline-block';
      modeToggle.querySelector('.fa-moon').style.display = 'none';
    } else {
      modeToggle.querySelector('.fa-sun').style.display = 'none';
      modeToggle.querySelector('.fa-moon').style.display = 'inline-block';
    }
  }

  // 显示特定内容区域
  function showContent(target) {
    contents.forEach(content => {
      if (content.id === target) {
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
        content.classList.add('active');
      } else {
        content.classList.remove('active');
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
      }
    });
    updateSliderPosition();
  }

  // 初始化滑动条位置
  updateSliderPosition();

  // 导航项点击事件
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      navItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      const target = this.getAttribute('data-target');
      showContent(target);
    });
  });

  // 模式切换按钮点击事件
  modeToggle.addEventListener('click', toggleDarkMode);

  // 读取JSON索引文件并渲染帖子
  fetch('index.json')
    .then(response => response.json())
    .then(data => {
      allPosts = [].concat(data.tutorial, data.downloads, data.announcements);
      renderPosts('tutorial', data.tutorial);
      renderPosts('downloads', data.downloads);
      renderPosts('announcements', data.announcements);
    })
    .catch(error => console.error('Error loading the index JSON:', error));

  // 搜索功能
  searchButton.addEventListener('click', function() {
    const query = searchBox.value.trim().toLowerCase();
    displayLoading(); // 显示加载动画
    if (query) {
      const regex = new RegExp(escapeRegExp(query), 'i');
      const results = allPosts.filter(post =>
        regex.test(post.title) ||
        regex.test(post.summary) ||
        regex.test(post.searchable)
      );
      displaySearchResults(results);
      openModal();
    } else {
      displaySearchResults(allPosts); // 如果没有输入，显示所有内容
      openModal();
    }
  });

  // 用来转义正则表达式中的特殊字符
  function escapeRegExp(string) {
    return string.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
  }

  // 显示搜索结果
  function displaySearchResults(results) {
    searchResults.innerHTML = ''; // 清空之前的搜索结果
    if (results.length === 0) {
      searchResults.innerHTML = '<li>没有找到相关内容。</li>';
    } else {
      results.forEach(result => {
        const li = document.createElement('li');
        const highlightedTitle = result.title.replace(new RegExp(searchBox.value, 'gi'), match => `<span class="highlight">${match}</span>`);
        const highlightedSummary = result.summary.replace(new RegExp(searchBox.value, 'gi'), match => `<span class="highlight">${match}</span>`);
        const highlightedKeywords = result.searchable.replace(new RegExp(searchBox.value, 'gi'), match => `<span class="highlight">${match}</span>`);
        li.innerHTML = `<a href="${result.href}" target="_blank">${highlightedTitle}</a><br><span class="keywords">${highlightedSummary}</span><br><span class="keywords">${highlightedKeywords}</span>`;
        searchResults.appendChild(li);
      });
    }
  }

  // 显示加载动画
  function displayLoading() {
    searchResults.innerHTML = '<li>加载中...</li>';
  }

  // 打开模态框
  function openModal() {
    searchModal.style.display = 'block';
  }

  // 关闭模态框
  closeBtn.addEventListener('click', function() {
    searchModal.style.display = 'none';
  });

  // 渲染帖子到指定内容区域
  function renderPosts(contentId, posts) {
    const content = document.getElementById(contentId);
    content.innerHTML = ''; // 清空内容区域
    posts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.className = 'post';
      postElement.innerHTML = `
        <h3 class="post-title">${post.title}</h3>
        <p class="post-summary">${post.summary}</p>
        <div class="post-tags">
          <span class="version-tag">${post.version || '未指定版本'}</span>
          <span class="keywords">${post.searchable}</span>
        </div>
      `;
      postElement.addEventListener('click', function() {
        window.location.href = post.href;
      });
      content.appendChild(postElement);
      postElement.style.animation = 'slide-in 0.5s ease forwards';
    });
  }
});
