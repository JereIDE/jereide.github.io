// Custom JavaScript to modify the mdbook menu bar
// Runs after the page loads

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    modifyMenuBar();
  }, 100);
});

function modifyMenuBar() {
  const menuBar = document.getElementById("mdbook-menu-bar");
  if (!menuBar) return;

  // 1. Remove the "JereIDE Wiki" title
  const title = menuBar.querySelector(".menu-title");
  if (title) title.remove();

  // 2. Add a JereIDE home icon to the left buttons
  const leftButtons = menuBar.querySelector(".left-buttons");
  if (leftButtons && !leftButtons.querySelector(".home-link")) {
    const homeLink = document.createElement("a");
    homeLink.className = "home-link";
    homeLink.href = "../";
    homeLink.title = "JereIDE Home";
    homeLink.setAttribute("aria-label", "JereIDE Home");

    const iconImg = document.createElement("img");
    iconImg.src = "../assets/AppIcon.png";
    iconImg.alt = "JereIDE";
    iconImg.width = 24;
    iconImg.height = 24;

    homeLink.appendChild(iconImg);
    leftButtons.prepend(homeLink);
  }

  // 3. Move the search results popup to <body> so no ancestor transform/overflow can clip it
  const resultsOuter = document.getElementById("mdbook-searchresults-outer");
  if (resultsOuter) {
    document.body.appendChild(resultsOuter);

    if (!resultsOuter.querySelector(".searchresults-close")) {
      const closeBtn = document.createElement("button");
      closeBtn.className = "searchresults-close";
      closeBtn.type = "button";
      closeBtn.textContent = "\u00d7";
      closeBtn.title = "Close search results";
      closeBtn.setAttribute("aria-label", "Close search results");
      resultsOuter.appendChild(closeBtn);
      closeBtn.addEventListener("click", function () {
        resultsOuter.classList.add("hidden");
      });
    }
  }

  // 4. Preload the search index so searching works immediately (mdbook only
  //    loads it when the search icon is clicked, which we have hidden).
  const searchToggle = document.getElementById("mdbook-search-toggle");
  if (searchToggle) {
    searchToggle.click();
  }

  // 5. Keep the sidebar visible and prevent toggling it off
  const sidebarToggleAnchor = document.getElementById(
    "mdbook-sidebar-toggle-anchor",
  );
  if (sidebarToggleAnchor) {
    sidebarToggleAnchor.checked = true;
    document.documentElement.classList.add("sidebar-visible");
  }
}
