const works = [
  {
    title: "家装项目 01",
    category: "家装项目",
    note: "住宅空间概念与实景表达",
    images: ["home-01-01", "home-01-02", "home-01-03"],
  },
  {
    title: "家装项目 02",
    category: "家装项目",
    note: "客厅、卧室与公共起居空间",
    images: ["home-02-01", "home-02-02", "home-02-03"],
  },
  {
    title: "家装项目 03",
    category: "家装项目",
    note: "柔和材质、灯光与生活场景",
    images: ["home-03-01", "home-03-02", "home-03-03"],
  },
  {
    title: "家装项目 04",
    category: "家装项目",
    note: "AI 辅助住宅空间概念探索",
    images: ["home-04-01", "home-04-02", "home-04-03"],
  },
  {
    title: "家装项目 05",
    category: "家装项目",
    note: "客厅、餐厨与动线组织",
    images: ["home-05-01", "home-05-02", "home-05-03"],
  },
  {
    title: "家装项目 06",
    category: "家装项目",
    note: "现代住宅空间与细节表达",
    images: ["home-06-01", "home-06-02", "home-06-03"],
  },
  {
    title: "健身房",
    category: "工装项目",
    note: "运动空间与复合功能场景",
    images: ["commercial-01-01", "commercial-01-02", "commercial-01-03"],
  },
  {
    title: "办公室",
    category: "工装项目",
    note: "办公、展示与建筑空间表达",
    images: ["commercial-02-01", "commercial-02-02", "commercial-02-03"],
  },
  {
    title: "口腔诊所",
    category: "工装项目",
    note: "医疗接待与服务空间体验",
    images: ["commercial-03-01", "commercial-03-02", "commercial-03-03"],
  },
  {
    title: "西餐厅",
    category: "工装项目",
    note: "餐饮空间、吧台与品牌氛围",
    images: ["commercial-04-01", "commercial-04-02", "commercial-04-03"],
  },
  {
    title: "轻餐饮",
    category: "工装项目",
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

const filters = ["全部", ...new Set(works.map((work) => work.category))];
const filterBar = document.querySelector(".filter-bar");
const workGrid = document.querySelector("#workGrid");
const timeline = document.querySelector("#timeline");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxCaption = document.querySelector("#lightboxCaption");
const zoomToggle = document.querySelector('[data-zoom="toggle"]');
let activeFilter = "全部";
let activeIndex = 0;
let activeImageIndex = 0;
let visibleWorks = [...works];
let isZoomed = false;
let isDragging = false;
let didDrag = false;
let dragStart = { x: 0, y: 0 };
let pan = { x: 0, y: 0 };

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
  visibleWorks = activeFilter === "全部" ? [...works] : works.filter((work) => work.category === activeFilter);
  workGrid.innerHTML = visibleWorks
    .map(
      (work, index) => `
        <figure class="work-card" data-index="${index}" tabindex="0" role="button" aria-label="查看${work.title}">
          <img src="${assetPath(work.images[0], "-thumb")}" alt="${work.title}" loading="lazy" />
          <figcaption>
            <h3>${work.title}</h3>
            <p>${work.category} / ${work.note}</p>
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

function openLightbox(index) {
  activeIndex = index;
  activeImageIndex = 0;
  showActiveImage();
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
}

function showActiveImage() {
  resetZoom();
  const work = visibleWorks[activeIndex];
  const imageId = work.images[activeImageIndex];
  lightboxImage.src = assetPath(imageId);
  lightboxImage.alt = work.title;
  lightboxCaption.textContent = `${work.title} - ${work.category} - ${work.note} - ${activeImageIndex + 1} / ${work.images.length}`;
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.removeAttribute("src");
  document.body.style.overflow = "";
  resetZoom();
}

function moveLightbox(direction) {
  const work = visibleWorks[activeIndex];
  activeImageIndex = (activeImageIndex + direction + work.images.length) % work.images.length;
  showActiveImage();
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
  openLightbox(Number(card.dataset.index));
});

workGrid.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest(".work-card");
  if (!card) return;
  event.preventDefault();
  openLightbox(Number(card.dataset.index));
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

renderFilters();
renderWorks();
renderTimeline();
