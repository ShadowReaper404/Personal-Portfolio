document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  document.querySelectorAll(".skill-bar-fill").forEach((bar) => {
    const observer2 = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          bar.style.width = bar.getAttribute("data-width") + "%";
          observer2.unobserve(bar);
        }
      },
      { threshold: 0.3 }
    );
    observer2.observe(bar);
  });
});
