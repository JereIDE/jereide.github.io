const downloadLabel = document.querySelector(".version");
const navbar = document.querySelector(".navbar");

fetch("https://api.github.com/repos/JereIDE/JereIDE/releases/latest")
  .then((res) => res.json())
  .then((data) => {
    const tag = data.tag_name;
    const version = `v${tag.replace(/^v/i, "")}`;
    downloadLabel.textContent = `${version} · macOS 12+ · Windows 10+`;
    downloadLabel.href = data.html_url;
  })
  .catch(() => {
    downloadLabel.textContent = "macOS 12+ · Windows 10+";
  });

window.addEventListener(
  "scroll",
  () => {
    const threshold = 250;
    if (window.scrollY > threshold) {
      if (!navbar.classList.contains("navbar-fixed")) {
        navbar.classList.add("navbar-fixed");
        document.body.style.paddingTop = navbar.offsetHeight + "px";
      }
    } else {
      if (navbar.classList.contains("navbar-fixed")) {
        navbar.classList.remove("navbar-fixed");
        document.body.style.paddingTop = "";
      }
    }
  },
  { passive: true },
);
