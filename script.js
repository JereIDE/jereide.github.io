const downloadBtn = document.querySelector(".button-accent");
const navbar = document.querySelector(".navbar");
const container = document.querySelector(".container");

fetch("https://api.github.com/repos/JereIDE/JereIDE/releases/latest")
  .then((res) => res.json())
  .then((data) => {
    const tag = data.tag_name;
    downloadBtn.textContent = `Download Version ${tag.replace(/^v/i, "")}`;
    downloadBtn.href = data.html_url;
  })
  .catch(() => {
    downloadBtn.textContent = "Download Latest Release";
  });

window.addEventListener(
  "scroll",
  () => {
    const threshold = 250;
    if (window.scrollY > threshold) {
      if (!navbar.classList.contains("navbar-fixed")) {
        navbar.classList.add("navbar-fixed");
        container.style.marginTop = navbar.offsetHeight + "px";
      }
    } else {
      if (navbar.classList.contains("navbar-fixed")) {
        navbar.classList.remove("navbar-fixed");
        container.style.marginTop = "";
      }
    }
  },
  { passive: true },
);
