//Set for hamburgerBtn
const header = document.querySelector(".header");
const hamburgerBtn = document.querySelector("#hamburger-btn");
const closeMenuBtn = document.querySelector("#close-menu-btn");
// Toggle mobile menu on hamburger button click
hamburgerBtn.addEventListener("click", () => header.classList.toggle("show-mobile-menu"));
// Close mobile menu on close button click
closeMenuBtn.addEventListener("click", () => hamburgerBtn.click());

//
const productsLink = document.querySelector('.products-link');
const subNavbar = document.querySelector('.sub-navbar');
const icon = productsLink.querySelector('.material-symbols-outlined');

// Function to toggle icon
function toggleIcon(show) {
    icon.style.transform = show ? 'rotate(180deg)' : 'rotate(0deg)';
}

// Event listeners
productsLink.addEventListener('mouseover', () => toggleIcon(true));
productsLink.addEventListener('mouseout', () => toggleIcon(false));
subNavbar.addEventListener('mouseover', () => toggleIcon(true));
subNavbar.addEventListener('mouseout', () => toggleIcon(false));


// 平滑滚动到页面顶部
document.querySelector('.scroll-to-top').addEventListener('click', function(e) {
    e.preventDefault(); // 阻止 <a> 标签的默认跳转行为
    window.scrollTo({top: 0, behavior: 'smooth'}); // 平滑滚动到页面顶部
  });

// Set for tab indicator line
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
 // document.getElementById('cancelButton').addEventListener('click', function() {
 //   document.querySelector('.modal').style.display = 'none';
//});
  
