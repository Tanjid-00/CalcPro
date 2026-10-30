const menuToggle = document.getElementById("menuToggle");
const appMenu = document.getElementById("appMenu");

const aboutMenuItem = document.getElementById("aboutMenuItem");
const aboutPanel = document.getElementById("aboutPanel");
const closeAbout = document.getElementById("closeAbout");

function closeMenu() {
  appMenu.hidden = true;
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  appMenu.hidden = !appMenu.hidden;

  menuToggle.setAttribute("aria-expanded", String(!appMenu.hidden));
});

aboutMenuItem.addEventListener("click", () => {
  closeMenu();
  aboutPanel.hidden = false;
});

closeAbout.addEventListener("click", () => {
  aboutPanel.hidden = true;
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".menu-wrapper")) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    aboutPanel.hidden = true;
  }
});
