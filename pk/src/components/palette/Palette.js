export default class Palette {
  constructor(canvas) {
    this.canvas = canvas;
    this.isMouseDown = false;
    this.activeColor = localStorage.getItem('color') || '#ccccff';
    this.isColorUsed = false;
    this.underMouseColor = null;
    this.previousCellPosition = null;
    this.penSize = 1;
  }

  setPreviousCellPosition(e) {
    if (e.target !== this.canvas.canvas) this.previousCellPosition = null;
  }

  getCursorPosition(e) {
    let x;
    let y;

    if (e.pageX || e.pageY) {
      x = e.pageX;
      y = e.pageY;
    } else {
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= this.canvas.canvas.offsetLeft;
    y -= this.canvas.canvas.offsetTop;
    return { x, y };
  }

  getClickedMatrixParam(e) {
    const cursor = this.getCursorPosition(e);
    const { canvas } = this;
    const { x } = cursor;
    const { y } = cursor;
    const size = canvas.getActiveMatrix().length;
    const height = canvas.canvas.height / size;
    const width = canvas.canvas.width / size;
    const row = Math.floor(y / height);
    const cell = Math.floor(x / width);
    return {
      height, width, row, cell,
    };
  }

  fillSame(e) {
    const { canvas } = this;
    if (canvas.activeMatrixItem.color !== this.activeColor) {
      canvas.setActiveMatrixItem(this.activeColor);
    }
    const mtrxPrm = this.getClickedMatrixParam(e);
    const matrix = canvas.getActiveMatrix();
    if (!matrix[mtrxPrm.row]) return;
    const underMouseColor = matrix[mtrxPrm.row][mtrxPrm.cell];
    if (underMouseColor === this.activeColor || underMouseColor.img) return;

    const { width } = mtrxPrm;
    const { height } = mtrxPrm;

    matrix.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === underMouseColor) {
          this.drawCell({
            row: i, cell: j, width, height,
          });
        }
      });
    });
    this.canvas.saveChanges();
    this.isColorUsed = true;
  }

  resize(size) {
    const { canvas } = this;
    const matrix = canvas.getActiveMatrix();
    const result = [];
    const step = matrix.length / size;
    for (let i = 0; i < matrix.length; i += step) {
      const newRow = [];
      for (let j = 0; j < matrix.length; j += step) {
        newRow.push(matrix[Math.floor(i)][Math.floor(j)]);
      }
      result.push(newRow);
    }
    canvas.matrixes[canvas.getActiveMatrixId()] = result;
    canvas.saveChanges();
    canvas.showMatrix();
  }

  bucketFill(e) {
    const { canvas } = this;
    if (canvas.activeMatrixItem.color !== this.activeColor) {
      canvas.setActiveMatrixItem(this.activeColor);
    }
    const mtrxPrm = this.getClickedMatrixParam(e);
    const matrix = canvas.getActiveMatrix();
    if (!matrix[mtrxPrm.row]) return;
    this.underMouseColor = matrix[mtrxPrm.row][mtrxPrm.cell];
    if (this.underMouseColor === this.activeColor || this.underMouseColor.img) return;
    this.fillAll(mtrxPrm.row, mtrxPrm.cell, mtrxPrm.width, mtrxPrm.height)
      .then(() => canvas.saveChanges());
    this.isColorUsed = true;
  }

  fillAll(rowIndx, cellIndx, width, height) {
    const matrix = this.canvas.getActiveMatrix();
    const relativeInexes = [
      [rowIndx, cellIndx],
      [rowIndx - 1, cellIndx],
      [rowIndx + 1, cellIndx],
      [rowIndx, cellIndx - 1],
      [rowIndx, cellIndx + 1],
    ];
    const promises = [];
    relativeInexes.forEach((indx) => {
      const row = indx[0];
      const cell = indx[1];
      if (row < 0 || cell < 0 || row > matrix.length - 1 || cell > matrix[0].length - 1) return;
      const elColor = matrix[row][cell];

      if (elColor === this.underMouseColor && elColor !== this.activeColor) {
        this.drawCell({
          row, cell, width, height,
        });
        const promise = Promise.resolve().then(() => this.fillAll(row, cell, width, height));
        promises.push(promise);
      }
    });
    return Promise.all(promises);
  }

  drawCell(mtrxPrm) {
    const { canvas } = this;
    const matrix = canvas.getActiveMatrix();
    if (matrix[mtrxPrm.row]) matrix[mtrxPrm.row][mtrxPrm.cell] = this.activeColor;
    const x = mtrxPrm.cell * mtrxPrm.width;
    const y = mtrxPrm.row * mtrxPrm.height;
    canvas.drawActiveMatrixItem(x, y, mtrxPrm.width, mtrxPrm.height);
  }

  drawLine(x0, y0, x1, y1, width, height) {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;

    let err = dx - dy;
    let x = x0;
    let y = y0;
    const n = true;
    while (n) {
      this.drawCell({
        cell: x, row: y, width, height,
      });

      if (x === x1 && y === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x += sx; }
      if (e2 < dx) { err += dx; y += sy; }
    }
  }

  drowByPenSize(i, mtrxPrm) {
    const newPrm = { ...mtrxPrm };
    newPrm.row -= i;
    if (this.previousCellPosition) this.previousCellPosition.row -= 1;
    this.drawLineByCurrentPrm(newPrm);
    const copy = { ...this.previousCellPosition };

    for (let j = 0; j < i; j += 1) {
      newPrm.cell -= 1;
      if (this.previousCellPosition) this.previousCellPosition.cell -= 1;
      this.drawLineByCurrentPrm(newPrm);
    }

    for (let v = 0; v < i; v += 1) {
      newPrm.row += 1;
      if (this.previousCellPosition) this.previousCellPosition.row += 1;
      this.drawLineByCurrentPrm(newPrm);
    }

    if (this.previousCellPosition) this.previousCellPosition = copy;
  }

  penDraw(e) {
    const { canvas } = this;
    if (!this.isMouseDown && e.type !== 'click') return;
    if (canvas.activeMatrixItem.color !== this.activeColor) {
      canvas.setActiveMatrixItem(this.activeColor);
    }
    const { penSize } = this;
    const mtrxPrm = this.getClickedMatrixParam(e);
    this.drawLineByCurrentPrm(mtrxPrm);
    for (let i = 1; i < penSize; i += 1) {
      this.drowByPenSize(i, mtrxPrm);
    }
    this.previousCellPosition = mtrxPrm;
    canvas.saveChanges();
    this.isColorUsed = true;
  }

  strokeDraw(e) {
    const { canvas } = this;
    if (canvas.activeMatrixItem.color !== this.activeColor) {
      canvas.setActiveMatrixItem(this.activeColor);
    }
    const mtrxPrm = this.getClickedMatrixParam(e);
    this.drawLineByCurrentPrm(mtrxPrm);
    this.previousCellPosition = mtrxPrm;
    canvas.saveChanges();
    this.isColorUsed = true;
  }

  drawLineByCurrentPrm(mtrxPrm) {
    this.drawCell(mtrxPrm);
    if (this.previousCellPosition) {
      const x1 = this.previousCellPosition;
      const x2 = mtrxPrm;
      this.drawLine(x1.cell, x1.row, x2.cell, x2.row, x1.width, x1.height);
    }
  }

  mouseOn() {
    this.isMouseDown = true;
    this.previousCellPosition = null;
  }

  mouseOff() {
    this.isMouseDown = false;
    this.previousCellPosition = null;
  }
}
