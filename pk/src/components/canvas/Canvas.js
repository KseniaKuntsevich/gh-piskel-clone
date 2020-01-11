export default class Canvas {
  constructor(canvas, matrixes, matrixId) {
    this.canvas = canvas;
    this.matrixes = matrixes || {};
    this.activeMatrixId = +localStorage.getItem('matrixId') || matrixId;
    this.activeMatrixItem = {
      type: null,
      data: null,
    };
    this.setMatrixesByStorage();
  }

  setMatrixesByStorage() {
    Object.keys(this.matrixes).forEach((id) => {
      const saved = localStorage.getItem(id);
      if (saved) this.matrixes[id] = JSON.parse(saved);
    });
  }

  setActiveMatrix(id) {
    if (this.matrixes[id]) {
      this.activeMatrixId = id;
      localStorage.setItem('matrixId', id);
    }
  }

  saveChanges() {
    const id = this.getActiveMatrixId();
    localStorage.setItem(id, JSON.stringify(this.getActiveMatrix()));
  }

  getActiveMatrixId() {
    return this.activeMatrixId;
  }

  getActiveMatrix() {
    return this.matrixes[this.getActiveMatrixId()];
  }

  addMatrix(props) {
    this.matrixes[props.id] = props.matrix;
  }

  setActiveMatrixItem(content) {
    let color;
    if (typeof content === 'string') {
      const s = new Option().style;
      s.color = content;
      const isString = s.color === content.toLowerCase();
      const isHexText = /^#[0-9A-F]{6}$/i.test(`#${content}`);
      const isHex = /^#[0-9A-F]{6}$/i.test(content);
      if (isHexText) color = `#${content}`;
      if (isString || isHex) color = content;
    } else if (Array.isArray(content) && content.length === 4) {
      const rgba = `rgba(${content[0]},${content[1]},${content[2]},${(Math.round(content[3] / 255), 1)})`;
      const isRgba = /rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*\d+[\d+]*)*\)/g.exec(rgba);
      if (isRgba) color = rgba;
    }

    if (color) {
      this.activeMatrixItem.type = 'color';
      this.activeMatrixItem.data = color;
    }
  }

  showMatrix() {
    const matrix = this.getActiveMatrix();
    const { canvas } = this;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cellWight = Math.floor(canvas.width / matrix[0].length);
    const rowHeight = Math.floor(canvas.height / matrix.length);

    let x = 0;
    let y = 0;

    matrix.forEach((row) => {
      row.forEach((content) => {
        this.setActiveMatrixItem(content);
        this.drawActiveMatrixItem(x, y, cellWight, rowHeight);
        x += cellWight;
      });

      x = 0;
      y += rowHeight;
    });
  }

  drawActiveMatrixItem(x, y, cellWight, rowHeight) {
    if (this.canvas.getContext) {
      const ctx = this.canvas.getContext('2d');
      const item = this.activeMatrixItem;
      switch (item.type) {
        case 'color':
          ctx.fillStyle = item.data;
          ctx.fillRect(x, y, cellWight, rowHeight);
          break;

        default:
          alert('Something goes wrong 0_0');
      }
    }
  }
}
