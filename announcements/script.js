document.addEventListener('DOMContentLoaded', function() {
  const modeToggle = document.getElementById('modeToggle');
  const navItem = document.querySelector('.nav-item[data-target="tutorial"]');

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

  // 模式切换按钮点击事件
  modeToggle.addEventListener('click', toggleDarkMode);

  // 导航到上一目录的index文件
  navItem.addEventListener('click', function() {
    window.location.href = '../index.html'; // 假设上一目录中的index文件名为index.html
  });
});