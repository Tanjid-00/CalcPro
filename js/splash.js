// Calc Pro Splash Screen

window.addEventListener("load", () => {
  const splash = document.getElementById("splashScreen");

  setTimeout(() => {
    splash.classList.add("hide");

    setTimeout(() => {
      splash.remove();
    }, 600);
  }, 2000);
});
