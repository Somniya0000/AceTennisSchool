document.addEventListener('DOMContentLoaded', function () {
  const tabs = Array.from(document.querySelectorAll('.day-tab'));
  const grid = document.querySelector('[data-schedule-grid]');
  const title = document.querySelector('[data-schedule-title]');
  const tplA = document.getElementById('schedule-template-a');
  const tplB = document.getElementById('schedule-template-b');

  if (!tabs.length || !grid || !title || (!tplA && !tplB)) return;

  const dayNames = {
    pn: 'Понедельник',
    vt: 'Вторник',
    sr: 'Среда',
    cht: 'Четверг',
    pt: 'Пятница',
    sb: 'Суббота',
    vs: 'Воскресенье',
  };

  function renderTemplateFor(dayKey) {
    // choose template A for ПН/СР/ПТ/ВС, B for ВТ/ЧТ/СБ
    const useA = ['pn', 'sr', 'pt', 'vs'].includes(dayKey);
    const tpl = useA ? tplA : tplB;
    if (!tpl) return;
    grid.innerHTML = '';
    const clone = tpl.content.cloneNode(true);
    grid.appendChild(clone);
  }

  // utility: activate tab by index
  function activateIndex(index) {
    if (index < 0 || index >= tabs.length) return;
    tabs.forEach((t, i) => {
      const isActive = i === index;
      t.classList.toggle('is-active', isActive);
      t.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      t.setAttribute('tabindex', isActive ? '0' : '-1');
    });
    const tab = tabs[index];
    const key = (tab.dataset.day || tab.textContent).trim().toLowerCase();
    title.textContent = dayNames[key] || title.textContent;
    renderTemplateFor(key);
    // focus for keyboard users
    tab.focus({preventScroll: true});
  }

  // enhance tabs: ARIA, keyboard and click
  const tabsContainer = document.querySelector('.day-tabs');
  if (tabsContainer) tabsContainer.setAttribute('role', 'tablist');

  tabs.forEach((tab, idx) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-pressed', tab.classList.contains('is-active') ? 'true' : 'false');
    tab.setAttribute('tabindex', tab.classList.contains('is-active') ? '0' : '-1');
    tab.addEventListener('click', function () {
      activateIndex(idx);
    });
    tab.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') {
        activateIndex((idx + 1) % tabs.length);
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        activateIndex((idx - 1 + tabs.length) % tabs.length);
        e.preventDefault();
      }
    });
  });

  // initial render — find active tab or default to pn
  const activeIndex = tabs.findIndex(t => t.classList.contains('is-active'));
  activateIndex(activeIndex >= 0 ? activeIndex : 0);

  // Touch / swipe support on grid (mobile): swipe left -> next, right -> prev
  let touchStartX = null;
  let touchStartTime = 0;
  const swipeThreshold = 50; // px

  grid.addEventListener('touchstart', function (e) {
    if (!e.touches || e.touches.length > 1) return;
    touchStartX = e.touches[0].clientX;
    touchStartTime = Date.now();
  }, {passive: true});

  grid.addEventListener('touchend', function (e) {
    if (touchStartX === null) return;
    const dx = (e.changedTouches[0].clientX - touchStartX);
    const dt = Date.now() - touchStartTime;
    if (Math.abs(dx) > swipeThreshold && dt < 1000) {
      const cur = tabs.findIndex(t => t.classList.contains('is-active'));
      if (dx < 0) {
        // left swipe -> next
        activateIndex((cur + 1) % tabs.length);
      } else {
        // right swipe -> prev
        activateIndex((cur - 1 + tabs.length) % tabs.length);
      }
    }
    touchStartX = null;
  }, {passive: true});
});
