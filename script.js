const works = [
  {
    title: "家装项目 01",
    titleEn: "Residence 01",
    category: "家装项目",
    categoryEn: "Residential",
    note: "住宅空间概念与实景表达",
    images: ["home-01-01", "home-01-02", "home-01-03"],
  },
  {
    title: "家装项目 02",
    titleEn: "Residence 02",
    category: "家装项目",
    categoryEn: "Residential",
    note: "客厅、卧室与公共起居空间",
    images: ["home-02-01", "home-02-02", "home-02-03"],
  },
  {
    title: "家装项目 03",
    titleEn: "Residence 03",
    category: "家装项目",
    categoryEn: "Residential",
    note: "柔和材质、灯光与生活场景",
    images: ["home-03-01", "home-03-02", "home-03-03"],
  },
  {
    title: "家装项目 04",
    titleEn: "AI Residence Study",
    category: "家装项目",
    categoryEn: "Residential",
    note: "AI 辅助住宅空间概念探索",
    images: ["home-04-01", "home-04-02", "home-04-03"],
  },
  {
    title: "家装项目 05",
    titleEn: "Residence 05",
    category: "家装项目",
    categoryEn: "Residential",
    note: "客厅、餐厨与动线组织",
    images: ["home-05-01", "home-05-02", "home-05-03"],
  },
  {
    title: "家装项目 06",
    titleEn: "Residence 06",
    category: "家装项目",
    categoryEn: "Residential",
    note: "现代住宅空间与细节表达",
    images: ["home-06-01", "home-06-02", "home-06-03"],
  },
  {
    title: "健身房",
    titleEn: "Fitness Club",
    category: "工装项目",
    categoryEn: "Commercial",
    note: "运动空间与复合功能场景",
    images: ["commercial-01-01", "commercial-01-02", "commercial-01-03"],
  },
  {
    title: "办公室",
    titleEn: "Office Space",
    category: "工装项目",
    categoryEn: "Commercial",
    note: "办公、展示与建筑空间表达",
    images: ["commercial-02-01", "commercial-02-02", "commercial-02-03"],
  },
  {
    title: "口腔诊所",
    titleEn: "Dental Clinic",
    category: "工装项目",
    categoryEn: "Commercial",
    note: "医疗接待与服务空间体验",
    images: ["commercial-03-01", "commercial-03-02", "commercial-03-03"],
  },
  {
    title: "西餐厅",
    titleEn: "Western Restaurant",
    category: "工装项目",
    categoryEn: "Commercial",
    note: "餐饮空间、吧台与品牌氛围",
    images: ["commercial-04-01", "commercial-04-02", "commercial-04-03"],
  },
  {
    title: "轻餐饮",
    titleEn: "Light Dining",
    category: "工装项目",
    categoryEn: "Commercial",
    note: "轻餐饮空间、座席与灯光氛围",
    images: ["commercial-05-01", "commercial-05-02", "commercial-05-03"],
  },
];

const experiences = [
  { company: "深圳市境城文化创意有限公司", role: "设计总监", field: "建筑 & 室内", period: "2019-至今" },
  { company: "清华大学建筑设计研究院（深圳）", role: "设计负责人", field: "建筑", period: "2017-2019" },
  { company: "北京中外建筑设计有限公司（深圳）", role: "建筑设计师", field: "建筑", period: "2014-2017" },
  { company: "CCDI 悉地国际（深圳）有限公司", role: "设计师助理", field: "建筑", period: "2012-2014" },
];

const featuredProjects = [
  works[0],
  works[6],
  works[9],
];

const filters = ["全部", ...new Set(works.map((work) => work.category))];
const filterBar = document.querySelector(".filter-bar");
const workGrid = document.querySelector("#workGrid");
const timeline = document.querySelector("#timeline");
const projectStack = document.querySelector("#projectStack");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxCaption = document.querySelector("#lightboxCaption");
const zoomToggle = document.querySelector('[data-zoom="toggle"]');
let activeFilter = "全部";
let activeIndex = 0;
let activeImageIndex = 0;
let currentWorks = [...works];
let lightboxWorks = [...works];
let isZoomed = false;
let isDragging = false;
let didDrag = false;
let dragStart = { x: 0, y: 0 };
let pan = { x: 0, y: 0 };
let lightboxTimer = null;

function assetPath(imageId, suffix = "") {
  return `./public/assets/projects/${imageId}${suffix}.webp`;
}

function renderFilters() {
  filterBar.innerHTML = filters
    .map(
      (filter) =>
        `<button class="filter-button ${filter === activeFilter ? "active" : ""}" type="button" data-filter="${filter}">${filter}</button>`,
    )
    .join("");
}

function renderWorks() {
  currentWorks = activeFilter === "全部" ? [...works] : works.filter((work) => work.category === activeFilter);
  workGrid.innerHTML = currentWorks
    .map(
      (work, index) => `
        <figure class="work-card" data-index="${index}" tabindex="0" role="button" aria-label="查看${work.title}">
          <img src="${assetPath(work.images[0], "-thumb")}" alt="${work.title}" loading="lazy" />
          <figcaption>
            <h3>${work.titleEn}</h3>
            <p>${work.title} / ${work.category} / ${work.note}</p>
          </figcaption>
        </figure>
      `,
    )
    .join("");
}

function renderTimeline() {
  timeline.innerHTML = experiences
    .map(
      (item) => `
        <article>
          <div>
            <h3>${item.company}</h3>
            <p>${item.role} / ${item.field}</p>
          </div>
          <time>${item.period}</time>
        </article>
      `,
    )
    .join("");
}

function renderProjectStack() {
  projectStack.innerHTML = featuredProjects
    .map((work, index) => {
      const number = String(index + 1).padStart(2, "0");
      return `
        <div class="project-slot">
          <article class="project-card" data-project-index="${index}" style="--stack-offset: ${index * 28}px;">
            <header class="project-card-header">
              <span class="project-card-number">${number}</span>
              <div>
                <p class="project-card-kicker">${work.categoryEn} / ${work.title}</p>
                <h3>${work.titleEn}</h3>
              </div>
              <button class="live-button" type="button" data-featured-index="${index}">Live Project</button>
            </header>
            <div class="project-images">
              <div class="project-col">
                <button class="project-image" type="button" data-featured-index="${index}" data-image-index="0">
                  <img src="${assetPath(work.images[0], "-thumb")}" alt="${work.title} 01" loading="lazy" />
                </button>
                <button class="project-image" type="button" data-featured-index="${index}" data-image-index="1">
                  <img src="${assetPath(work.images[1], "-thumb")}" alt="${work.title} 02" loading="lazy" />
                </button>
              </div>
              <button class="project-image project-feature" type="button" data-featured-index="${index}" data-image-index="2">
                <img src="${assetPath(work.images[2], "-thumb")}" alt="${work.title} 03" loading="lazy" />
              </button>
            </div>
          </article>
        </div>
      `;
    })
    .join("");
}

function renderMarquee() {
  const rows = document.querySelectorAll(".marquee-row");
  const firstRow = works.slice(0, 6).flatMap((work) => work.images.slice(0, 2));
  const secondRow = works.slice(6).flatMap((work) => work.images.slice(0, 2));
  [firstRow, secondRow].forEach((images, rowIndex) => {
    rows[rowIndex].innerHTML = [...images, ...images, ...images]
      .map(
        (imageId) => `
          <figure class="marquee-tile">
            <img src="${assetPath(imageId, "-thumb")}" alt="" loading="lazy" />
          </figure>
        `,
      )
      .join("");
  });
}

function openLightbox(index, source = currentWorks, imageIndex = 0) {
  lightboxWorks = source;
  activeIndex = index;
  activeImageIndex = imageIndex;
  showActiveImage();
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  startLightboxAutoplay();
}

function showActiveImage() {
  resetZoom();
  const work = lightboxWorks[activeIndex];
  const imageId = work.images[activeImageIndex];
  lightboxImage.src = assetPath(imageId);
  lightboxImage.alt = work.title;
  lightboxCaption.textContent = `${work.title} - ${work.category} - ${work.note} - ${activeImageIndex + 1} / ${work.images.length}`;
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.removeAttribute("src");
  document.body.style.overflow = "";
  stopLightboxAutoplay();
  resetZoom();
}

function moveLightbox(direction) {
  const work = lightboxWorks[activeIndex];
  activeImageIndex = (activeImageIndex + direction + work.images.length) % work.images.length;
  showActiveImage();
}

function startLightboxAutoplay() {
  stopLightboxAutoplay();
  lightboxTimer = window.setInterval(() => {
    if (lightbox.hidden || isZoomed) return;
    moveLightbox(1);
  }, 3200);
}

function stopLightboxAutoplay() {
  if (!lightboxTimer) return;
  window.clearInterval(lightboxTimer);
  lightboxTimer = null;
}

function applyZoom() {
  lightbox.classList.toggle("zoomed", isZoomed);
  lightboxImage.style.setProperty("--zoom", isZoomed ? "2.2" : "1");
  lightboxImage.style.setProperty("--pan-x", `${pan.x}px`);
  lightboxImage.style.setProperty("--pan-y", `${pan.y}px`);
  zoomToggle.textContent = isZoomed ? "退出放大" : "放大查看";
}

function resetZoom() {
  isZoomed = false;
  isDragging = false;
  didDrag = false;
  pan = { x: 0, y: 0 };
  if (!lightboxImage) return;
  applyZoom();
}

function toggleZoom() {
  isZoomed = !isZoomed;
  if (!isZoomed) {
    pan = { x: 0, y: 0 };
  }
  applyZoom();
}

function setupReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  items.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${Math.min(index * 55, 420)}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "50px", threshold: 0 },
  );

  items.forEach((item) => observer.observe(item));
}

function updateProjectStack() {
  const cards = document.querySelectorAll(".project-card");
  cards.forEach((card, index) => {
    const slot = card.closest(".project-slot");
    const rect = slot.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.2 - rect.top) / window.innerHeight));
    const targetScale = 1 - (cards.length - 1 - index) * 0.03;
    const scale = 1 - progress * (1 - targetScale);
    card.style.setProperty("--stack-scale", scale.toFixed(3));
  });
}

function handleScrollEffects() {
  updateProjectStack();
}

filterBar.addEventListener("click", (event) => {
  const button = event.target.closest(".filter-button");
  if (!button) return;
  activeFilter = button.dataset.filter;
  renderFilters();
  renderWorks();
});

workGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".work-card");
  if (!card) return;
  openLightbox(Number(card.dataset.index), currentWorks);
});

workGrid.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest(".work-card");
  if (!card) return;
  event.preventDefault();
  openLightbox(Number(card.dataset.index), currentWorks);
});

projectStack.addEventListener("click", (event) => {
  const target = event.target.closest("[data-featured-index]");
  if (!target) return;
  const featuredIndex = Number(target.dataset.featuredIndex);
  const imageIndex = Number(target.dataset.imageIndex || 0);
  openLightbox(featuredIndex, featuredProjects, imageIndex);
});

lightbox.addEventListener("click", (event) => {
  if (event.target.matches(".lightbox-close")) closeLightbox();
  if (event.target.matches(".prev")) moveLightbox(-1);
  if (event.target.matches(".next")) moveLightbox(1);
  if (event.target.matches('[data-zoom="toggle"]')) toggleZoom();
  if (event.target.matches('[data-zoom="reset"]')) resetZoom();
  if (event.target === lightboxImage && !didDrag) toggleZoom();
  didDrag = false;
  if (event.target === lightbox) closeLightbox();
});

lightboxImage.addEventListener("pointerdown", (event) => {
  if (!isZoomed) return;
  isDragging = true;
  didDrag = false;
  dragStart = { x: event.clientX - pan.x, y: event.clientY - pan.y };
  lightboxImage.setPointerCapture(event.pointerId);
});

lightboxImage.addEventListener("pointermove", (event) => {
  if (!isDragging || !isZoomed) return;
  pan = {
    x: event.clientX - dragStart.x,
    y: event.clientY - dragStart.y,
  };
  didDrag = Math.abs(pan.x) > 4 || Math.abs(pan.y) > 4;
  applyZoom();
});

lightboxImage.addEventListener("pointerup", () => {
  isDragging = false;
});

lightboxImage.addEventListener("pointercancel", () => {
  isDragging = false;
});

document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);
  if (event.key === "+" || event.key === "=") toggleZoom();
  if (event.key === "0") resetZoom();
});

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

window.addEventListener("scroll", handleScrollEffects, { passive: true });
window.addEventListener("resize", handleScrollEffects);

renderFilters();
renderWorks();
renderTimeline();
renderProjectStack();
renderMarquee();
setupReveal();
handleScrollEffects();
