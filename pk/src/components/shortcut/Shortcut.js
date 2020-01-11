export default class Shortcut {
  constructor(data) {
    this.keysItems = {};
    this.modal = document.getElementById('modal');
    this.btnOpenModal = document.getElementById('btnOpenModal');
    this.btnCloseModal = document.getElementById('btnCloseModal');
    this.btnSaveModal = document.getElementById('btnSaveModal');
    this.inpList = this.modal ? this.modal.querySelectorAll('[data-item]') : null;
    this.itemsList = document.querySelectorAll('[data-tip]');
    this.tipEl = null;
    this.tipTarget = null;
    this.data = data;
    this.itemsKeys = null;
    document.addEventListener('mouseover', (e) => this.showTip(e));
    document.addEventListener('mouseout', (e) => this.hideTip(e));
  }

  setItemKeys() {
    this.itemsKeys = JSON.parse(localStorage.getItem('itemsKeys'));
    if (this.itemsKeys) return;
    this.itemsKeys = {};
    const { data } = this;
    Object.keys(data).forEach((item) => { this.itemsKeys[item] = data[item].key; });
  }

  hideTip(e) {
    if (e.target === this.tipTarget) {
      this.tipEl.remove();
      this.tipEl = null;
      this.tipTarget = null;
    }
  }

  showTip(e) {
    if (this.tipTarget && !document.body.contains(this.tipTarget)) {
      this.tipEl.remove();
      this.tipEl = null;
      this.tipTarget = null;
    }

    if (this.tipEl) return;
    const { target } = e;
    const tip = this.itemsKeys[target.dataset.tip];
    if (!tip) return;

    const tooltipElem = document.createElement('div');
    tooltipElem.classList.add('bg-dark', 'text-light', 'p-1', 'rounded');
    tooltipElem.style.position = 'fixed';
    tooltipElem.textContent = `(${tip})`;
    document.body.appendChild(tooltipElem);

    const coords = target.getBoundingClientRect();
    let left = coords.left + (target.offsetWidth);
    if (left < 0) left = 0;
    const { top } = coords;

    this.tipEl = tooltipElem;
    this.tipTarget = target;
    tooltipElem.style.left = `${left}px`;
    tooltipElem.style.top = `${top}px`;
  }

  saveItemsToLocal() {
    localStorage.setItem('itemsKeys', JSON.stringify(this.itemsKeys));
  }

  setItemCodes() {
    this.keysItems = {};
    const { itemsKeys } = this;
    Object.keys(itemsKeys).forEach((key) => {
      this.keysItems[itemsKeys[key]] = key;
    });

    this.inpList.forEach((inp, i) => {
      const { item } = inp.dataset;
      this.inpList[i].value = itemsKeys[item];
    });
  }

  showModal() {
    this.modal.style.display = 'block';
  }

  disableModal() {
    this.modal.style.display = 'none';
  }

  saveModal() {
    this.inpList.forEach((inp) => {
      const { item } = inp.dataset;
      this.itemsKeys[item] = inp.value.toLowerCase();
    });
    this.setItemCodes();
    this.saveItemsToLocal();
  }

  start() {
    this.setItemKeys();
    document.addEventListener('keydown', (e) => this.callByKey(e));
    this.btnCloseModal.addEventListener('click', () => this.disableModal());
    this.btnOpenModal.addEventListener('click', () => this.showModal());
    this.btnSaveModal.addEventListener('click', () => { this.disableModal(); this.saveModal(); });
    this.setItemCodes();
  }

  callByKey(e) {
    const key = e.key.toLowerCase();
    const item = this.keysItems[key];
    if (!item) return;

    const v = this.data[item];
    v.f(v.arg);
  }
}
