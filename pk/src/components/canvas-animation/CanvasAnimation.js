import Canvas from '../canvas/Canvas';

export default class CanvasAnimation {
  constructor(canvEl, inp) {
    this.canvasConstructor = new Canvas(canvEl, {}, null);
    this.framesId = [];
    this.counter = 0;
    this.timerId = null;
    this.speed = JSON.parse(localStorage.getItem('amimationSpeed')) || 1;
    this.inpSpeed = inp || null;
  }

  start() {
    this.setInputValue(this.speed);
    this.setFramesFromStorage();
    this.changeFrame();
    this.setIntervalAnimation(this.speed);
    this.timerId2 = setInterval(() => {
      Promise.resolve().then(() => this.setFramesFromStorage());
    }, 1000);
    if (this.inpSpeed) this.inpSpeed.addEventListener('change', (e) => this.resetSpeed(e));
  }

  finish() {
    clearInterval(this.timerId);
    clearInterval(this.timerId2);
  }

  setInputValue(val) {
    if (this.inpSpeed) this.inpSpeed.value = val;
  }

  checkInpValue(v) {
    return v > 0 && v < 25 && typeof v === 'number';
  }

  resetSpeed(e) {
    const newSpeed = +e.target.value;
    if (this.checkInpValue(newSpeed)) {
      this.setIntervalAnimation(newSpeed);
      this.speed = newSpeed;
      localStorage.setItem('amimationSpeed', newSpeed);
    }
  }

  setIntervalAnimation(shots) {
    clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      Promise.resolve().then(() => this.changeFrame());
    }, 1000 / shots);
  }

  setFramesFromStorage() {
    this.framesId = JSON.parse(localStorage.getItem('framesId')) || [];
    this.framesId.forEach((id) => {
      const matrix = null;
      this.canvasConstructor.addMatrix({ matrix, id });
    });
    this.canvasConstructor.setMatrixesByStorage();
  }


  changeFrame() {
    this.counter = this.counter >= this.framesId.length ? 0 : this.counter;
    const id = this.framesId[this.counter];
    if (!id) return;
    this.canvasConstructor.activeMatrixId = id;
    this.canvasConstructor.showMatrix();
    this.counter += 1;
  }
}
