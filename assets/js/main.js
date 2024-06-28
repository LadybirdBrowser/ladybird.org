new Accordion(".accordion-container");

document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  // Toggle class to show or hide the mobile menu
  hamburger.addEventListener("click", function () {
    navMenu.classList.toggle("is-active");
  });
});
