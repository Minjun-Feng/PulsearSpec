
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