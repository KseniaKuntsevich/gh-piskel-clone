export default class PaletteSwitcher {
  constructor(palette) {
    this.palette = palette;
    this.canvas = palette.canvas.canvas;
    this.canvas.style.cursor = 'pointer';

    this.penDraw = palette.penDraw.bind(palette);
    this.strokeDraw = palette.strokeDraw.bind(palette);
    this.bucketFill = palette.bucketFill.bind(palette);
    this.fillSame = palette.fillSame.bind(palette);
    this.getUnderMouseColor = this.getUnderMouseColor.bind(this);
    this.mouseOn = palette.mouseOn.bind(palette);
    this.mouseOff = palette.mouseOff.bind(palette);
    this.resize = palette.resize.bind(palette);
    this.setInputColor = this.setInputColor.bind(this);
    this.setPreviousColor = this.setPreviousColor.bind(this);
    this.setPreviousCellPosition = palette.setPreviousCellPosition.bind(palette);

    this.input = document.querySelector('[data-palette-input]');
    this.penSizeSwitcher = document.getElementById('resizePen');
    this.btnResizeCanvas = document.getElementById('resizeCanvas');
    this.colorHolder = [
      document.querySelector('[data-palette-color-holder="current"]'),
      document.querySelector('[data-palette-color-holder="previous"]'),
    ];

    this.setColor(this.palette.activeColor);
    this.activateColor();

    this.btnResizeCanvas.addEventListener('click', (e) => this.resize(+e.target.dataset.size));
    this.penSizeSwitcher.addEventListener('click', (e) => this.setPenSize(e));
  }

  activateFillSame() {
    this.canvas.addEventListener('click', this.fillSame);
  }

  unactivateFillSame() {
    this.canvas.removeEventListener('click', this.fillSame);
  }

  activateColor() {
    this.input.addEventListener('change', this.setInputColor);
    document.addEventListener('click', this.setPreviousColor);
    this.input.removeAttribute('disabled');
    this.input.parentNode.parentNode.style.cursor = 'default';
    this.input.style.cursor = 'pointer';
  }

  unactivateColor() {
    this.input.removeEventListener('change', this.setInputColor);
    document.removeEventListener('click', this.setPreviousColor);
    this.input.setAttribute('disabled', 'disabled');
    this.input.parentNode.parentNode.style.cursor = 'not-allowed';
    this.input.style.cursor = 'not-allowed';
  }

  activateBucket() {
    this.canvas.addEventListener('click', this.bucketFill);
  }

  unactivateBucket() {
    this.canvas.removeEventListener('click', this.bucketFill);
  }

  activateEraser() {
    this.palette.activeColor = '#ffffff';
    this.activatePen();
    this.unactivateColor();
  }

  unactivateEraser() {
    this.palette.activeColor = localStorage.getItem('color') || 'white';
    this.unactivatePen();
    this.activateColor();
  }

  activatePen() {
    this.canvas.addEventListener('click', this.penDraw);
    this.canvas.addEventListener('mousemove', this.penDraw);
    this.canvas.addEventListener('mousedown', this.mouseOn);
    document.addEventListener('mouseup', this.mouseOff);
    document.addEventListener('mousemove', this.setPreviousCellPosition);
  }

  unactivatePen() {
    this.canvas.removeEventListener('click', this.penDraw);
    this.canvas.removeEventListener('mousemove', this.penDraw);
    this.canvas.removeEventListener('mousedown', this.mouseOn);
    document.removeEventListener('mouseup', this.mouseOff);
    document.removeEventListener('mousemove', this.setPreviousCellPosition);
  }

  activateStroke() {
    this.canvas.addEventListener('mouseup', this.strokeDraw);
    this.canvas.addEventListener('mousedown', this.strokeDraw);
    document.addEventListener('mouseup', this.mouseOff);
    this.canvas.style.cursor = 'crosshair';
  }

  unactivateStroke() {
    this.canvas.removeEventListener('mouseup', this.strokeDraw);
    this.canvas.removeEventListener('mousedown', this.strokeDraw);
    document.removeEventListener('mouseup', this.mouseOff);
    this.canvas.style.cursor = 'pointer';
  }

  activatePicker() {
    this.canvas.addEventListener('click', this.getUnderMouseColor);
  }

  unactivatePicker() {
    this.canvas.removeEventListener('click', this.getUnderMouseColor);
  }

  getUnderMouseColor(e) {
    const x = e.layerX;
    const y = e.layerY;
    const ctx = this.canvas.getContext('2d');
    const pixel = ctx.getImageData(x, y, 1, 1);
    const { data } = pixel;
    const getHex = (d) => (d | 1 << 8);
    const hex = (getHex(data[0])).toString(16).slice(1)
    + (getHex(data[1])).toString(16).slice(1)
    + (getHex(data[2])).toString(16).slice(1);
    this.setColor(`#${hex}`);
  }

  setPenSize(e) {
    this.penSizeSwitcher.querySelector('.active').classList.remove('active');
    this.palette.penSize = +e.target.dataset.size;
    e.target.classList.add('active');
  }

  setInputColor() {
    this.setColor(this.input.value);
  }

  setPreviousColor(e) {
    const { color } = e.target.dataset;
    if (color) {
      this.setColor(color);
    }
  }

  setColor(color) {
    this.palette.activeColor = color;
    this.input.value = color;
    const { colorHolder } = this;

    if (colorHolder[0].dataset.color === color) return;
    if (this.palette.isColorUsed) {
      colorHolder[1].dataset.color = colorHolder[0].dataset.color;
      this.palette.isColorUsed = false;
    }

    colorHolder[0].dataset.color = color;
    localStorage.setItem('color', color);
    colorHolder[0].style.backgroundColor = colorHolder[0].dataset.color;
    colorHolder[1].style.backgroundColor = colorHolder[1].dataset.color;
  }
}
