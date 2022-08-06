// import axios from 'axios';
import Swiper, { Mousewheel } from "swiper";
import { gsap } from "gsap";

window.addEventListener("load", () => {
  let slides;
  let currentTimeline;
  let initialLoad = false;
  const textCarousel = document.querySelector(".text-carousel");
  const imageShowcase = document.querySelector(".image-showcase");
  const imageSlides = document.querySelectorAll(".image-showcase__item");
  const imageCloseBtn = document.querySelector(".image-showcase__close");

  const componentClasses = {
    active: "js-is-active",
    expanded: "js-is-expanded",
    disabled: "js-is-disabled",
  };

  // Activate slide hover.
  const activateSlide = (idx) => {
    // Deactivate all existing slides before activating new one.
    slides.forEach((slide) => {
      slide.classList.remove(componentClasses.active);
    });

    // Find current text slides by index.
    const slidesByIdx = document.querySelectorAll(
      `.swiper-slide[data-index='${idx}']`
    );

    // Activate all slides by slide index.
    slidesByIdx.forEach((slide) => {
      slide.classList.add(componentClasses.active);
    });

    // Deactivate all image showcase items before activating new one.
    imageSlides.forEach((imageSlide) => {
      imageSlide.classList.remove(componentClasses.active);
    });

    // Find current image showcase by index.
    const currentImage = document.querySelector(
      `.image-showcase__item[data-index='${idx}']`
    );

    // Activate image showcase item if element exists.
    if (currentImage) {
      currentImage.classList.add(componentClasses.active);
    }

    // If current slide has a video, play the video.
    const videoElem = currentImage.querySelector("video");
    if (videoElem) {
      videoElem.play();
      return;
    }

    // Pause all videos in the background.
    imageSlides.forEach((imageSlide) => {
      const videoElem = imageSlide.querySelector("video");
      if (videoElem) {
        videoElem.pause();
      }
    });
  };

  // Expand slide.
  const expandSlide = (idx) => {
    const currentImage = document.querySelector(
      `.image-showcase__item[data-index='${idx}']`
    );
    if (currentImage) {
      imageShowcase.classList.add(componentClasses.expanded);
      textCarousel.classList.add(componentClasses.disabled);
      currentTimeline = gsap.timeline();

      currentTimeline.fromTo(
        ".image-showcase__text span",
        {
          y: 150,
          ease: "power4.out",
          skewY: 8,
        },
        {
          y: 0,
          skewY: 0,
          duration: 0.7,
          delay: 0.6,
          stagger: {
            amount: 0.3,
          },
        }
      );
    }
  };

  // Initialize swiper.
  new Swiper(".swiper", {
    modules: [Mousewheel],
    slidesPerView: "auto",
    loop: "true",
    resistance: true,
    resistanceRatio: 0,
    speed: 1200,
    mousewheel: {
      sensitivity: 2,
    },
    on: {
      init: function () {
        slides = document.querySelectorAll(".swiper-slide");
        slides.forEach((slide) => {
          const slideIdx = slide.dataset.index;
          slide.addEventListener("mouseover", () => {
            activateSlide(slideIdx);
          });
          slide.addEventListener("click", () => {
            expandSlide(slideIdx);
          });
          // Activate first slide on init.
          if (slideIdx == 1 && !initialLoad) {
            activateSlide(slideIdx);
            initialLoad = true;
          }
        });
      },
    },
  });

  // Image close button functionality.
  imageCloseBtn.addEventListener("click", () => {
    if (imageShowcase.classList.contains("js-is-expanded")) {
      imageShowcase.classList.remove("js-is-expanded");
      textCarousel.classList.remove("js-is-disabled");
      currentTimeline.reverse();
    }
  });

  // Cursor functionality
  const hoverCursor = document.querySelector(".custom-cursor");

  const mouseOver = () => {
    hoverCursor.classList.add(componentClasses.active);
    gsap.fromTo(
      hoverCursor,
      { scale: 1 },
      {
        scale: 2,
        duration: 0.8,
      }
    );
  };

  const mouseOut = () => {
    hoverCursor.classList.remove(componentClasses.active);
    gsap.to(hoverCursor, {
      scale: 1,
      duration: 0.4,
    });
  };

  const moveCursor = (e) => {
    gsap.to(hoverCursor, {
      x: e.clientX - 25,
      y: e.clientY - 25,
      duration: 0.3,
      delay: 0.1,
    });
  };

  slides.forEach((slide) => {
    slide.addEventListener("mouseover", mouseOver);
    slide.addEventListener("mouseout", mouseOut);
  });
  window.addEventListener("mousemove", moveCursor);
});
