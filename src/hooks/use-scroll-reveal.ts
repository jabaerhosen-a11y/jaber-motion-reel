import { useEffect, type RefObject } from "react";

/** Progressive enhancement: content remains visible without JS or with reduced motion. */
export function useScrollReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const setup = () => {
      observer?.disconnect();
      root.querySelectorAll(".scroll-reveal").forEach((el) => el.classList.remove("scroll-reveal", "is-revealed"));
      if (motion.matches) return;
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer?.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -32px 0px" });
      root.querySelectorAll("h1, h2, section .eyebrow, .hero-copy > p, .hero-copy > div, .work-tile, .services-carousel, #about > div, #contact form, #contact .contact-links").forEach((el) => {
        el.classList.add("scroll-reveal");
        observer?.observe(el);
      });
    };
    setup();
    const mutations = new MutationObserver(() => {
      if (motion.matches) return;
      root.querySelectorAll(".work-tile:not(.scroll-reveal)").forEach((el) => {
        el.classList.add("scroll-reveal");
        observer?.observe(el);
      });
    });
    mutations.observe(root, { childList: true, subtree: true });
    motion.addEventListener("change", setup);
    return () => { observer?.disconnect(); mutations.disconnect(); motion.removeEventListener("change", setup); };
  }, [ref]);
}