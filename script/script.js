
const header = document.querySelector(".header");
const hamburgerBtn = document.querySelector("#hamburger-btn");
const closeMenuBtn = document.querySelector("#close-menu-btn");
// Toggle mobile menu on hamburger button click
hamburgerBtn.addEventListener("click", () => header.classList.toggle("show-mobile-menu"));
// Close mobile menu on close button click
closeMenuBtn.addEventListener("click", () => hamburgerBtn.click());

// 平滑滚动到页面顶部
document.querySelector('.scroll-to-top').addEventListener('click', function(e) {
    e.preventDefault(); // 阻止 <a> 标签的默认跳转行为
    window.scrollTo({top: 0, behavior: 'smooth'}); // 平滑滚动到页面顶部
  });


document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.content');
    const line = document.querySelector('.line');

    function updateLine(tab) {
        const tabRect = tab.getBoundingClientRect();
        const containerRect = tab.parentNode.getBoundingClientRect();
    
        line.style.width = tabRect.width + 'px';
        line.style.left = (tabRect.left - containerRect.left) + 'px';
        line.style.top = (tabRect.top - containerRect.top + tabRect.height) + 'px'; // Adjusted to position the line below the tab
    }
    
    // Rest of your code remains the same...
    

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            // 更新激活的标签样式
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // 更新指示线位置
            updateLine(tab);

            // 显示对应的内容
            contents.forEach(content => content.classList.remove('active'));
            contents[index].classList.add('active');
        });
    });

    // 初始化指示线位置
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
        updateLine(activeTab);
    }

    // 窗口大小改变时更新指示线位置
    window.addEventListener('resize', () => {
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab) {
            updateLine(activeTab);
        }
    });
});

// Click to get contact form

document.getElementById('contactLink').onclick = function() {
    document.getElementById('contactForm').style.display = 'block';
  };
  document.getElementsByClassName('close')[0].onclick = function() {
    document.getElementById('contactForm').style.display = 'none';
  };
// Click to get contact form
  document.getElementById('cancelButton').addEventListener('click', function() {
    document.querySelector('.modal').style.display = 'none';
});
  
