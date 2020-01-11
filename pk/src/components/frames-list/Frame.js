import Canvas from '../canvas/Canvas';

export default class Frame {
  constructor(framesConstructor, id) {
    this.framesConstructor = framesConstructor;
    this.container = document.getElementById('framesContainer');
    this.id = id;
    this.img = null;
    this.renderPic = this.renderPic.bind(this);
    this.canvEl = document.createElement('canvas');
    this.canvConstr = new Canvas(this.canvEl, {});
    this.canvEl.width = 512;
    this.canvEl.height = 512;
    this.render();
  }

  render() {
    const container = document.createElement('div');
    const btnDelete = document.createElement('button');
    const btnDuplicate = document.createElement('button');
    const name = document.createElement('span');
    const num = document.createElement('span');
    const split = document.createElement('br');

    this.img = new Image();
    this.img.style.width = '80px';
    this.img.style.height = '80px';
    this.renderPic();

    this.img.classList.add('m-2');
    btnDuplicate.textContent = 'Duplicate';
    btnDelete.textContent = 'Delete';
    name.textContent = ' Layer ';
    num.textContent = this.id;
    container.classList.add('m-2', 'bg-dark', 'rounded', 'draggable', 'text-light');
    btnDuplicate.classList.add('btn', 'btn-sm', 'btn-outline-secondary', 'm-1');
    btnDelete.classList.add('btn', 'btn-sm', 'btn-outline-danger', 'm-1');
    container.dataset.frameId = this.id;
    btnDelete.dataset.tip = 'deleteFrame';
    container.draggable = true;

    btnDuplicate.addEventListener('click', () => this.framesConstructor.duplicate(this.id));
    btnDelete.addEventListener('click', () => this.framesConstructor.delete(this.id));
    container.addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON') this.framesConstructor.changeActiveOnCanvas(this.id);
    });


    container.appendChild(this.img);
    container.appendChild(name);
    container.appendChild(num);
    container.appendChild(split);
    container.appendChild(btnDuplicate);
    container.appendChild(btnDelete);
    if (this.container) this.container.appendChild(container);
  }

  renderPic() {
    const { img } = this;
    const data = JSON.parse(localStorage.getItem(this.id));
    if (data) {
      const { canvEl } = this;
      const { canvConstr } = this;
      const myObj = { id: 'myCanv', matrix: data };
      canvConstr.addMatrix(myObj);
      canvConstr.activeMatrixId = 'myCanv';
      canvConstr.showMatrix();
      const url = canvEl.toDataURL();
      img.src = url;
    }
  }
}
