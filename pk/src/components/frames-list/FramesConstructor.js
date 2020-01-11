import Frame from './Frame';
import DragnDrop from './DragnDrop';

export default class FramesConstructor {
  constructor(canvas) {
    this.canvas = canvas;
    this.framesObj = {};
    this.container = document.getElementById('framesContainer');
    this.framesId = JSON.parse(localStorage.getItem('framesId')) || [];
    this.counter = JSON.parse(localStorage.getItem('framesCounter')) || 0;
    this.size = JSON.parse(localStorage.getItem('framesSize')) || 32;
    this.btnAddFrame = document.getElementById('btnAddFrame');
    this.addFrame = this.addFrame.bind(this);
    this.delete = this.delete.bind(this);
    this.setNewFrame = this.setNewFrame.bind(this);
    this.timerId = null;
    this.activeLayer = null;
    this.sizeSwitcher = document.getElementById('framesSizeSwitcher');
  }

  render() {
    this.setSavedFrames();
    this.changeActiveOnCanvas(JSON.parse(localStorage.getItem('activeLayer')));
    document.getElementById('btnAddFrame').addEventListener('click', this.setNewFrame);
    this.sizeSwitcher.addEventListener('click', (e) => this.switchSize(e));
    this.sizeSwitcher.querySelector(`[data-frames-size='${this.size}']`).classList.add('active');
    this.dragnDrop = new DragnDrop(this.container, () => {
      const framesIdSorted = [];
      this.container.querySelectorAll('[data-frame-id]').forEach((el) => framesIdSorted.push(`${el.dataset.frameId}`));
      localStorage.setItem('framesId', JSON.stringify(framesIdSorted));
    });
  }

  getEmptyFrameData(size) {
    let data = [];
    data.length = size;
    data.fill(1);
    data = data.map(() => {
      const n = [];
      n.length = size;
      n.fill('#ffffff');
      return n;
    });
    return data;
  }

  switchSize(e) {
    const size = e.target.dataset.framesSize;
    this.size = +size;

    const active = this.sizeSwitcher.querySelector('.active');
    if (active) active.classList.remove('active');

    e.target.classList.add('active');
    localStorage.setItem('framesSize', size);
  }

  setSavedFrames() {
    if (!this.framesId.length) {
      this.setNewFrame();
    }
    this.framesId.forEach((id) => {
      this.addFrame(id);
    });
    this.canvas.setMatrixesByStorage();
  }

  getNewId() {
    this.counter += 1;
    localStorage.setItem('framesCounter', this.counter);
    return this.counter - 1;
  }

  saveToLocal(id, data) {
    const framesId = JSON.parse(localStorage.getItem('framesId')) || [];
    framesId.push(`${id}`);
    localStorage.setItem('framesId', JSON.stringify(framesId));
    localStorage.setItem(id, JSON.stringify(data));
  }

  setNewFrame() {
    const id = this.getNewId();
    const data = this.getEmptyFrameData(this.size);
    this.addFrame(id, data);
    this.saveToLocal(id, data);
    this.changeActiveOnCanvas(id);
  }

  changeActiveOnCanvas(id) {
    this.updatePic(id);
    localStorage.setItem('activeLayer', id);
    this.canvas.setActiveMatrix(id);
    this.canvas.showMatrix();
  }

  duplicate(idDuplicateFrom) {
    const data = [...this.canvas.matrixes[idDuplicateFrom]];
    const id = this.getNewId();
    this.addFrame(id, data);
    this.saveToLocal(id, data);
    this.changeActiveOnCanvas(id);
  }

  updatePic(id) {
    clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      if (this.framesObj[id]) Promise.resolve().then(this.framesObj[id].renderPic);
    }, 1000);
  }

  addFrame(id, data) {
    const newFrame = new Frame(this, id);
    this.framesObj[id] = newFrame;
    const matrix = data;
    this.canvas.addMatrix({ matrix, id });
  }

  delete(id) {
    const strId = id || id === 0 ? `${id}` : localStorage.getItem('activeLayer');
    const frameElement = document.querySelector(`[data-frame-id="${strId}"`);
    if (frameElement)frameElement.parentNode.removeChild(frameElement);
    const framesId = JSON.parse(localStorage.getItem('framesId')) || [];
    const indexOfId = framesId.indexOf(strId);
    framesId.splice(indexOfId, 1);
    localStorage.setItem('framesId', JSON.stringify(framesId));
    if (`${localStorage.getItem('activeLayer')}` === strId) {
      this.changeActiveOnCanvas(framesId[indexOfId - 1 >= 0 ? indexOfId - 1 : 0]);
    }
  }
}
