const downloadLabel = document.querySelector(".version");
const navbar = document.querySelector(".navbar");
const starsCount = document.getElementById("stars-count");
const commitTime = document.getElementById("commit-time");
const versionsCount = document.getElementById("versions-count");

function fetchGitHub(url) {
  return fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`GitHub API request failed (${res.status})`);
    }
    return res.json();
  });
}

function timeAgo(date) {
  const time = new Date(date).getTime();
  if (Number.isNaN(time)) return "-";
  const seconds = Math.floor((Date.now() - time) / 1000);
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
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
}

fetchGitHub("https://api.github.com/repos/JereIDE/JereIDE/releases/latest")
  .then((data) => {
    if (!data || typeof data.tag_name !== "string") {
      throw new Error("Unexpected release response");
    }
    const tag = data.tag_name;
    const version = `v${tag.replace(/^v/i, "")}`;
    downloadLabel.textContent = `${version} · macOS 12+ · Windows 10+`;
    downloadLabel.href = data.html_url;
  })
  .catch(() => {
    downloadLabel.textContent = "macOS 12+ · Windows 10+";
  });

// Fetch repo data for stars and last commit
fetchGitHub("https://api.github.com/repos/JereIDE/JereIDE")
  .then((repoData) => {
    if (!repoData || !Number.isFinite(repoData.stargazers_count)) {
      throw new Error("Unexpected repository response");
    }

    animateCount(starsCount, repoData.stargazers_count);
    commitTime.textContent = timeAgo(repoData.pushed_at);
  })
  .catch(() => {
    starsCount.textContent = "-";
    commitTime.textContent = "-";
  });

function animateCount(el, target) {
  if (!Number.isFinite(target) || target <= 0) {
    el.textContent = "0";
    return;
  }

  let current = 0;
  const increment = target > 100 ? Math.ceil(target / 50) : 1;
  const duration = 1500;
  const stepTime = Math.max(16, Math.floor(duration / (target / increment)));

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
fetchGitHub("https://api.github.com/repos/JereIDE/JereIDE/releases")
  .then((releases) => {
    if (!Array.isArray(releases)) {
      throw new Error("Unexpected releases response");
    }
    animateCount(versionsCount, releases.length);
  })
  .catch(() => {
    versionsCount.textContent = "-";
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

// Grow the screenshot as the user scrolls through its section
const screenshotSection = document.querySelector(".screenshot");
const screenshotImg = document.querySelector(".screenshot-img");

if (screenshotSection && screenshotImg) {
  const sticky = screenshotSection.querySelector(".screenshot-sticky");
  let ticking = false;

  const updateScreenshotScale = () => {
    ticking = false;
    const rect = screenshotSection.getBoundingClientRect();
    const travel = rect.height - sticky.offsetHeight;
    const progress =
      travel > 0 ? Math.min(Math.max(-rect.top / travel, 0), 1) : 0;
    const eased = progress * progress * (3 - 2 * progress);
    screenshotImg.style.setProperty(
      "--screenshot-scale",
      (1 + eased * 0.6).toFixed(3),
    );
    screenshotImg.style.setProperty(
      "--screenshot-rise",
      `${((1 - eased) * 32).toFixed(1)}px`,
    );

    // Fade out once 15% of the photo is hidden above the viewport,
    // and be fully gone when only the bottom 10% is still visible.
    const imgRect = screenshotImg.getBoundingClientRect();
    const covered = Math.min(Math.max(-imgRect.top / imgRect.height, 0), 1);
    const fade = Math.min(Math.max((covered - 0.15) / (0.9 - 0.15), 0), 1);
    screenshotImg.style.setProperty(
      "--screenshot-opacity",
      (1 - fade).toFixed(3),
    );
  };

  const requestScreenshotUpdate = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateScreenshotScale);
    }
  };

  updateScreenshotScale();
  window.addEventListener("scroll", requestScreenshotUpdate, { passive: true });
  window.addEventListener("resize", requestScreenshotUpdate, { passive: true });
}
