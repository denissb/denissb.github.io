import Searcher from "./vendor/searcher/searcher.js";

customElements.define("oom-search", Searcher);

document.querySelectorAll("oom-search").forEach((el) => {
  el.addEventListener("selected", (ev) => {
    const { value } = ev.detail;
    window.location.href = value;
  });
});

const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.remove("js-before-animation");
      entry.target.classList.add("js-animating");
    }
  });
});

document.querySelectorAll(".bar-progress").forEach((el) => {
  el.classList.add("js-before-animation");
  animationObserver.observe(el);
});
