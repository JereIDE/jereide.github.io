const downloadLabel = document.querySelector(".version");
const navbar = document.querySelector(".navbar");
const starsCount = document.getElementById("stars-count");
const commitTime = document.getElementById("commit-time");
const versionsCount = document.getElementById("versions-count");

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: "yr", seconds: 31536000 },
    { label: "mo", seconds: 2592000 },
    { label: "wk", seconds: 604800 },
    { label: "d", seconds: 86400 },
    { label: "hr", seconds: 3600 },
    { label: "min", seconds: 60 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count}${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
}

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

// Fetch repo data for stars and last commit
fetch("https://api.github.com/repos/JereIDE/JereIDE")
  .then((res) => res.json())
  .then((repoData) => {
    const stars = repoData.stargazers_count;

    // Animate the star count from 0 to the actual number
    let current = 0;
    const target = stars;
    const steps = target > 0 ? target : 1;
    const increment = target > 100 ? Math.ceil(target / 50) : 1;
    const duration = 1500;
    const stepTime = Math.floor(
      duration / (Math.min(target, steps) / increment),
    );

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      starsCount.textContent = current;
    }, stepTime);

    // Show time since last commit
    commitTime.textContent = timeAgo(repoData.pushed_at);
  })
  .catch(() => {
    starsCount.textContent = "0";
    commitTime.textContent = "-";
    versionsCount.textContent = "0";
  });

function animateCount(el, target) {
  let current = 0;
  const steps = target > 0 ? target : 1;
  const increment = target > 100 ? Math.ceil(target / 50) : 1;
  const duration = 1500;
  const stepTime = Math.floor(duration / (Math.min(target, steps) / increment));

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current;
  }, stepTime);
}

// Fetch release count for "Versions Released"
fetch("https://api.github.com/repos/JereIDE/JereIDE/releases")
  .then((res) => res.json())
  .then((releases) => {
    if (Array.isArray(releases)) {
      animateCount(versionsCount, releases.length);
    }
  })
  .catch(() => {
    versionsCount.textContent = "0";
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
