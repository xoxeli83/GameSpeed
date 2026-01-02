(function () {
  const host = document.getElementById("menu");
  if (!host) return;

  host.innerHTML = `
    <header class="main-menu" id="mainMenu">
      <nav>
        <a href="/">GameSpeed</a>
        <a href="/ahorcado/">Ahorcado</a>
        <a href="/simon/">Simon</a>
        <a href="/palillos/">Palillos</a>
        <a href="/timbiriche/">Timbiriche</a>
        <a href="https://www.google.com" target="_blank" rel="noopener" class="right">Pánico</a>
        <a href="/ranking/" class="right">Ranking</a>
      </nav>
    </header>
  `;

  function applyMenuHeight() {
    const menu = document.getElementById("mainMenu");
    if (!menu) return;
    const h = Math.ceil(menu.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--menu-h", h + "px");
  }

  // Espera a que el DOM pinte y calcule bien alturas
  requestAnimationFrame(applyMenuHeight);
  window.addEventListener("resize", applyMenuHeight);
})();
