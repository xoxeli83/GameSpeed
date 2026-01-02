(function () {
  const el = document.getElementById("menu");
  if (!el) return;

  el.innerHTML = `
    <header class="main-menu">
      <nav>
        <a href="/">GameSpeed</a>
        <a href="/ahorcado/">Ahorcado</a>
        <a href="/simon/">Simon</a>
        <a href="/palillos/">Palillos</a>
        <a href="/timbiriche/">Timbiriche</a>
        <a href="/ranking/" class="right">Ranking</a>
      </nav>
    </header>
  `;
})();
