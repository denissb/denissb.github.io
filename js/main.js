import Searcher from "./vendor/searcher/searcher.js";

customElements.define("oom-search", Searcher);

document.querySelectorAll("oom-search").forEach((el) => {
  el.addEventListener("selected", (ev) => {
    const { value } = ev.detail;
    window.location.href = value;
  });
});


const animationObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animating');
    }
  });
});

document.querySelectorAll('.bar-progress').forEach((el) =>
  animationObserver.observe(el)
);
