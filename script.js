document.addEventListener('DOMContentLoaded', function() {
  const navItems = document.querySelectorAll('.nav-item');
  const sliderBar = document.querySelector('.slider-bar');
  const modeToggle = document.getElementById('modeToggle');
  const contents = document.querySelectorAll('.content');

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
      renderPosts('encyclopedia', data.encyclopedia);
      renderPosts('downloads', data.downloads);
      renderPosts('announcements', data.announcements);
    })
    .catch(error => console.error('Error loading the index JSON:', error));

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
      `;
      postElement.addEventListener('click', function() {
        window.location.href = post.href;
      });
      content.appendChild(postElement);
      postElement.style.animation = 'slide-in 0.5s ease forwards';
    });
  }
});
