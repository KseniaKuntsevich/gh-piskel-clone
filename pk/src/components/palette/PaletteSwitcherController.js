export default class PaletteSwitcherController {
  constructor(paletteSwitcher) {
    this.menu = document.querySelector('[data-tools-menu]');
    this.toogle = this.toogle.bind(this);
    this.callById = {
      pen:
        {
          activate: paletteSwitcher.activatePen.bind(paletteSwitcher),
          unactivate: paletteSwitcher.unactivatePen.bind(paletteSwitcher),
        },
      eraser:
        {
          activate: paletteSwitcher.activateEraser.bind(paletteSwitcher),
          unactivate: paletteSwitcher.unactivateEraser.bind(paletteSwitcher),
        },
      bucket:
        {
          activate: paletteSwitcher.activateBucket.bind(paletteSwitcher),
          unactivate: paletteSwitcher.unactivateBucket.bind(paletteSwitcher),
        },
      fillSame:
        {
          activate: paletteSwitcher.activateFillSame.bind(paletteSwitcher),
          unactivate: paletteSwitcher.unactivateFillSame.bind(paletteSwitcher),
        },
      stroke:
        {
          activate: paletteSwitcher.activateStroke.bind(paletteSwitcher),
          unactivate: paletteSwitcher.unactivateStroke.bind(paletteSwitcher),
        },
      picker:
        {
          activate: paletteSwitcher.activatePicker.bind(paletteSwitcher),
          unactivate: paletteSwitcher.unactivatePicker.bind(paletteSwitcher),
        },
    };
  }

  start() {
    const activeTool = localStorage.getItem('tool') || 'pen';
    this.toogle(activeTool);
    this.menu.addEventListener('click', (e) => this.toogle(e.target.dataset.toolsId));
  }

  toogle(toolId) {
    if (!toolId) return;
    const next = this.menu.querySelector(`[data-tools-id="${toolId}"]`);
    const prev = this.menu.querySelector('li.active');
    if (next.classList.contains('active')) return;
    if (prev) {
      this.callById[prev.dataset.toolsId].unactivate();
      prev.classList.remove('active', 'bg-secondary');
    }
    this.callById[toolId].activate();
    next.classList.add('active', 'bg-secondary', 'border-0');
    localStorage.setItem('tool', toolId);
  }
}
