// Theme Toggle Function
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  const icon = document.getElementById("themeIcon");
  

  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  // Change icon
  if (newTheme === "dark") {
    icon.className = "fas fa-sun";
  } else {
    icon.className = "fas fa-moon";
  }
}
//btn
const themeToggleBtn = document.getElementById("themeToggleBtn");
themeToggleBtn.addEventListener("click", toggleTheme);


// Load saved theme
document.addEventListener("DOMContentLoaded", function () {
  const savedTheme = localStorage.getItem("theme") || "light";
  const icon = document.getElementById("themeIcon");

  document.documentElement.setAttribute("data-theme", savedTheme);

  if (savedTheme === "dark") {
    icon.className = "fas fa-sun";
  }
});

// Navbar scroll effect
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".main-navbar");
  if (window.scrollY > 50) {
    navbar.style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)";
  } else {
    navbar.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
  }
});



