export default class DragnDrop {
  constructor(list, callback) {
    this.onUpdate = callback;
    this.rootEl = list;
    this.dragEl = null;
    this.nextEl = null;
    this.sortable(list);
  }

  onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const { target } = e;
    const el = this.rootEl.children[0] !== target ? target.nextSibling : target;
    if (target && target !== this.dragEl && target.classList.contains('draggable')) {
      this.rootEl.insertBefore(this.dragEl, el);
    }
  }

  onDragEnd(e) {
    e.preventDefault();
    this.dragEl.classList.remove('ghost');
    this.rootEl.removeEventListener('dragover', this.onDragOver, false);
    this.rootEl.removeEventListener('dragend', this.onDragEnd, false);

    if (this.nextEl !== this.dragEl.nextSibling) {
      this.onUpdate(this.dragEl);
    }
  }

  onDragStart(e) {
    if (e.target.parentNode !== this.rootEl) { e.preventDefault(); return; }
    const dragEl = e.target;
    this.dragEl = dragEl;
    this.nextEl = dragEl.nextSibling;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('Text', dragEl.textContent);

    this.rootEl.addEventListener('dragover', (event) => this.onDragOver(event), false);
    this.rootEl.addEventListener('dragend', (event) => this.onDragEnd(event), false);

    dragEl.classList.add('ghost');
  }

  sortable(rootEl) {
    const elems = [].slice.call(rootEl.children);
    elems.forEach((el, i) => {
      elems[i].draggable = true;
    });

    rootEl.addEventListener('dragstart', (e) => this.onDragStart(e));
  }
}
