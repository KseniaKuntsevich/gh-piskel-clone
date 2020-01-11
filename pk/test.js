import DragnDrop from './src/components/frames-list/DragnDrop';
import FramesConstructor from './src/components/frames-list/FramesConstructor';
import Frame from './src/components/frames-list/Frame';
import Canvas from './src/components/canvas/Canvas';
import CanvasAnimation from './src/components/canvas-animation/CanvasAnimation';
import FullScreen from './src/components/canvas-animation/FullScreen';
import Palette from './src/components/palette/Palette';
import PaletteSwitcherController from './src/components/palette/PaletteSwitcherController';
import Shortcut from './src/components/shortcut/Shortcut';

jest.unmock('./src/components/canvas-animation/CanvasAnimation');

HTMLCanvasElement.prototype.getContext = () => ({
  	fillRect: () => {},
  	clearRect: () => {},
  	fillStyle: () => {},
});

const matrixes = {
	  	  matrix1: [['white', 'white', 'white'], ['white', 'white', 'white'], ['white', 'white', 'white']],
	  	  matrix2: [['white', 'white', 'white'], ['white', 'white', 'white'], ['white', 'white', 'white']],
	  	  matrix3: [['white', 'white', 'white'], ['white', 'white', 'white'], ['white', 'white', 'white']],
	  	  matrix4: [['white', 'white', 'white'], ['white', 'white', 'white'], ['white', 'white', 'white']],
	  	  matrix5: [['white', 'white', 'white'], ['white', 'white', 'white'], ['white', 'white', 'white']],
	  	};

	  const canvasElm = document.createElement('canvas');
	  canvasElm.width = 100;
	  canvasElm.height = 100;
	  const canvasObj = new Canvas(canvasElm, matrixes, 'matrix1');


describe('Canvas', () => {
  describe('Canvas constructor', () => {
	    let canvasElms = [];
	    canvasElms.length = 10;
	    canvasElms.fill(1);
	    canvasElms = canvasElms.map(() => document.createElement('canvas'));
	    const canvasObjs = canvasElms.map((canvasEl) => new Canvas(canvasEl, {}, 1));


	  it('Created object shoud be instanceof Canvas constructor', () => {
	    canvasObjs.forEach((canvasObj, index) => {
	      expect(canvasObj instanceof Canvas).toBeTruthy();
	    });
	  });

	  it('Created object has default property "canvas"', () => {
	    canvasObjs.forEach((canvasObj, index) => {
	      expect('canvas' in canvasObj).toBeTruthy();
	    });
	  });

	  it('Created object has default property "matrixes"', () => {
	    canvasObjs.forEach((canvasObj, index) => {
	      expect('matrixes' in canvasObj).toBeTruthy();
	    });
	  });

	   it('Created object has default property "matrixes"', () => {
	    canvasObjs.forEach((canvasObj, index) => {
	      expect(canvasObj.matrixes instanceof Object).toBeTruthy();
	    });
	  });

	  it('Created object has default property "activeMatrixId"', () => {
	    canvasObjs.forEach((canvasObj, index) => {
	      expect('activeMatrixId' in canvasObj).toBeTruthy();
	    });
	  });

	  it('Created object has default property "activeMatrixItem"', () => {
	    canvasObjs.forEach((canvasObj, index) => {
	      expect('activeMatrixItem' in canvasObj).toBeTruthy();
	    });
	  });

	  it('Should have "canvas" property equal to assigned canvas element', () => {
	    canvasObjs.forEach((canvasObj, index) => {
	      expect(canvasObj.canvas).toBe(canvasElms[index]);
	    });
	  });

	  it('Should have "activeMatrixId" property equal to assigned id', () => {
	  	canvasObjs.forEach((canvasObj, index) => {
	      expect(canvasObj.activeMatrixId).toEqual(1);
	    });
	  });

	  it('Property "activeMatrixId" typeof number', () => {
	    canvasObjs.forEach((canvasObj, index) => {
	      expect(typeof canvasObj.activeMatrixId).toEqual('number');
	    });
	  });

	   it('Property "canvas" is canvas element', () => {
	    canvasObjs.forEach((canvasObj, index) => {
	      expect(canvasObj.canvas.tagName).toEqual('CANVAS');
	    });
	  });
  });

  describe('Canvas methods', () => {
	  const idList = ['matrix1', 'matrix2', 'matrix3', 'matrix4', 'matrix5'];
	  const fakeIds = ['lala', 'bubu', 'hoho'];

	  describe('Method "getActiveMatrixId"', () => {
		  it('Returns current activeMatrixId', () => {
		    idList.forEach((id) => {
		      canvasObj.activeMatrixId = id;
		      expect(canvasObj.getActiveMatrixId()).toEqual(id);
		    });
		  });
	  });

	  describe('Method "setActiveMatrix"', () => {
		  it('Changes activeMatrixId', () => {
		    idList.forEach((id) => {
		      canvasObj.setActiveMatrix(id);
		      expect(canvasObj.getActiveMatrixId()).toEqual(id);
		    });
		  });

		  it('Doesnt change activeMatrixId if Id isnt key in "matrixes" property', () => {
		    fakeIds.forEach((id) => {
		      const currentId = canvasObj.getActiveMatrixId();
		      canvasObj.setActiveMatrix(id);
		      expect(canvasObj.getActiveMatrixId()).toEqual(currentId);
		    });
		  });

		  it('Changes activeMatrixId if key added', () => {
		  	const matrix6 = [];
		  	canvasObj.addMatrix({ id: 'matrix6', matrix: matrix6 });
		    canvasObj.setActiveMatrix('matrix6');
		    expect(canvasObj.getActiveMatrixId()).toEqual('matrix6');
		  });
	  });

	  describe('Method "addMatrix"', () => {
		  it('Adds matrix to "matrixes property', () => {
		  	const matrix7 = [];
		  	canvasObj.addMatrix({ id: 'matrix7', matrix: matrix7 });
		    expect(canvasObj.matrixes.matrix7).toBe(matrix7);
		  });
	  });

	  describe('Method "getActiveMatrix"', () => {
		  it('Returns active matrix data', () => {
		  	idList.forEach((id) => {
		      canvasObj.setActiveMatrix(id);
		      canvasObj.saveChanges();
		      expect(canvasObj.getActiveMatrix()).toBe(matrixes[id]);
		    });
		  });
	  });

	  describe('Method "setActiveMatrixItem"', () => {
		  const colorString = ['white', 'blue', 'black'];
		  const expectedStringItems = [
		    { type: 'color', data: 'white' },
		    { type: 'color', data: 'blue' },
		    { type: 'color', data: 'black' },
		  ];
		  const colorRgba = [[255, 0, 0, 6], [209, 48, 33, 116], [208, 49, 34, 119]];
		  const expectedRgbaItems = [
		    { type: 'color', data: 'rgba(255,0,0,1)' },
		    { type: 'color', data: 'rgba(209,48,33,1)' },
		    { type: 'color', data: 'rgba(208,49,34,1)' },
		  ];
		  const colorHex = ['00BCD4', 'FFEB3B', 'FFEB3B', '00BCD4', 'FFEB3B'];
		  const colorHex2 = ['#00BCD4', '#FFEB3B', '#FFEB3B', '#00BCD4', '#FFEB3B'];
		  const expectedHexItems = [
		    { type: 'color', data: '#00BCD4' },
		    { type: 'color', data: '#FFEB3B' },
		    { type: 'color', data: '#FFEB3B' },
		    { type: 'color', data: '#00BCD4' },
		    { type: 'color', data: '#FFEB3B' },
		  ];
		  const expectedImgItems = [{ type: 'img', data: 'someUrl' }, { type: 'img', data: 'someUrl2' }];
		  const uncorrectValues = ['WhiTe', 'BluE', 'Black', ['g', 5, 4, 444], '#fcba3', '#fcbaa3', '7777F7777', {}];

		  it('Sets correct "activeMatrixItem" from color string', () => {
		  	colorString.forEach((data, i) => {
		      canvasObj.setActiveMatrixItem(data);
		      expect(canvasObj.activeMatrixItem.type).toEqual('color');
		      expect(canvasObj.activeMatrixItem.data).toEqual(expectedStringItems[i].data);
		  	});
		  });

		  it('Sets correct "activeMatrixItem" from array rgba', () => {
		  	colorRgba.forEach((data, i) => {
		      canvasObj.setActiveMatrixItem(data);
		      expect(canvasObj.activeMatrixItem.type).toEqual('color');
		      expect(canvasObj.activeMatrixItem.data).toEqual(expectedRgbaItems[i].data);
		  	});
		  });

		  it('Sets correct "activeMatrixItem" from hex', () => {
		  	colorHex.forEach((data, i) => {
		      canvasObj.setActiveMatrixItem(data);
		      expect(canvasObj.activeMatrixItem.type).toEqual('color');
		      expect(canvasObj.activeMatrixItem.data).toEqual(expectedHexItems[i].data);
		  	});

		  	colorHex2.forEach((data, i) => {
		      canvasObj.setActiveMatrixItem(data);
		      expect(canvasObj.activeMatrixItem.type).toEqual('color');
		      expect(canvasObj.activeMatrixItem.data).toEqual(expectedHexItems[i].data);
		  	});
		  });

		  it('Doesnt set uncorrect values', () => {
		  	const currItem = canvasObj.activeMatrixItem;
		  	uncorrectValues.forEach((data, i) => {
		      canvasObj.setActiveMatrixItem(data);
		      expect(canvasObj.activeMatrixItem.type).toEqual(currItem.type);
		      expect(canvasObj.activeMatrixItem.data).toEqual(currItem.data);
		  	});
		  });
	  });
  });
});

describe('CanvasAnimation', () => {
  const canvEl = document.createElement('canvas');
  const inp = document.createElement('input');
  const canvAnim1 = new CanvasAnimation(canvEl, inp);
  const canvAnim2 = new CanvasAnimation(canvEl, inp);
  const canvAnim3 = new CanvasAnimation(canvEl, inp);

  describe('CanvasAnimation constructor', () => {
	 it('Created object shoud be instanceof CanvasAnimation constructor', () => {
	    expect(canvAnim1 instanceof CanvasAnimation).toBeTruthy();
	  });

	  it('Property "canvasConstructor" is object instanceof Canvas', () => {
	    expect(canvAnim1.canvasConstructor instanceof Canvas).toBeTruthy();
	  });

	  it('Property "canvasConstructor" is object with assigned canvas element', () => {
	    expect(canvAnim1.canvasConstructor.canvas).toBe(canvEl);
	  });

	  it('Should have "inpSpeed" property', () => {
	    expect('inpSpeed' in canvAnim1).toBeTruthy;
	  });

	  it('Property "inpSpeed" should be assigned with input element', () => {
	    expect(canvAnim1.inpSpeed.tagName).toEqual('INPUT');
	  });
  });

  describe('CanvasAnimation methods', () => {
    describe('Method "setInputValue"', () => {
      it('Sets new input value', () => {
        canvAnim1.setInputValue('1212');
        expect(canvAnim1.inpSpeed.value).toEqual('1212');
      });
    });
    describe('Method "setIntervalAnimation"', () => {
      const speeds = [1, 2, 3, 4, 5];
		    jest.useFakeTimers();

		    it('Should call function setInterval', () => {
        speeds.forEach((sp, i) => {
          const { timerId } = canvAnim3;
          canvAnim3.setIntervalAnimation(1);
          expect(setInterval).toHaveBeenCalledTimes(i + 1);
        });
        clearInterval(canvAnim3.timerId);
      });

      it('Should set new timerId and clear previous', () => {
        speeds.forEach((sp) => {
          const { timerId } = canvAnim2;
          canvAnim2.setIntervalAnimation(sp);
          expect(canvAnim2.timerId === timerId).toBeFalsy();
        });
        clearInterval(canvAnim2.timerId);
      });
    });

    describe('Method "changeFrame"', () => {
      const steps = [1, 1, 1, 1, 1];
      it('Resets counter each time', () => {
        steps.forEach(() => {
          const counterPrev = canvAnim1.counter;
		   canvAnim1.changeFrame();
          expect(canvAnim1.counter === counterPrev).toBeFalsy;
        });
      });
    });

    describe('Method "checkInpValue"', () => {
      const overValues = [25, 290, 55, 26];
      const underValues = [-3, 0, -10, -26];
      const uncorrect = ['gg', null, undefined, NaN, '1'];
      const correct = [];
      for (let i = 1; i < 25; i++) {
        correct.push(i);
      }

      it('Returns false if value > 24', () => {
        overValues.forEach((v) => {
          expect(canvAnim1.checkInpValue(v)).toBeFalsy();
        });
      });

      it('Returns false if value < 0', () => {
        underValues.forEach((v) => {
          expect(canvAnim1.checkInpValue(v)).toBeFalsy();
        });
      });

      it('Returns true if value 1 - 24', () => {
        correct.forEach((v) => {
          expect(canvAnim1.checkInpValue(v)).toBeTruthy();
        });
      });

      it('Returns false if value isnt 1 - 24', () => {
        uncorrect.forEach((v) => {
          expect(canvAnim1.checkInpValue(v)).toBeFalsy();
        });
      });
    });

    describe('Method "start"', () => {
    	it('Sets timerId', () => {
        jest.useFakeTimers();
        const timerId1 = canvAnim1.timerId;
        canvAnim1.start();
        const timerId2 = canvAnim1.timerId;
        expect(timerId1 === timerId2).toBeFalsy();
        clearInterval(timerId2);
        clearInterval(canvAnim1.timerId2);
      });
    });
    describe('Method "resetSpeed"', () => {
    	it('Resets speed if value is correct', () => {
    		jest.useFakeTimers();
    		canvAnim1.resetSpeed({ target: { value: '2' } });
    		expect(setInterval).toHaveBeenCalledTimes(1);
    	});
    });

    describe('Method "finish"', () => {
    	it('Calls clearInterval for this.timerId and this.timerId2', () => {
    		jest.useFakeTimers();
    		canvAnim1.finish();
    		expect(clearInterval).toHaveBeenCalledWith(canvAnim1.timerId);
    		expect(clearInterval).toHaveBeenCalledWith(canvAnim1.timerId2);
    	});
    });
  });
});

describe('DragnDrop', () => {
  describe('DragnDrop methods', () => {
    const list = document.createElement('ul');
    let liList = [1, 1, 1, 1];
    liList = liList.map(() => {
        	const li = document.createElement('li');
        	list.appendChild(li);
        	return li;
    });
    const dnd = new DragnDrop(list, () => {});
    const event = { preventDefault: () => {}, dataTransfer: { dropEffect: null }, target: liList[1] };
    jest.spyOn(event, 'preventDefault');
    jest.spyOn(dnd, 'onUpdate');

    describe('"sortable"', () => {
      it('Sets attribute draggable to true on each list item', () => {
        liList.forEach((li) => {
          expect(li.draggable).toBeTruthy();
        });
      });
    });

    describe('Method onDragStart', () => {
    	const event = { target: liList[0], dataTransfer: { effectAllowed: null, setData: () => {} } };
      dnd.onDragStart(event);
    	it('It sets dragEl value', () => {
    		expect(dnd.dragEl).toBe(liList[0]);
      });

      it('It sets nextEl value as next sibling of target', () => {
    		expect(dnd.nextEl).toBe(liList[1]);
      });
    });


    describe('Method onDragOver', () => {
    	it('It stops event by preventDefault', () => {
    		dnd.dragEl = document.createElement('div');
    		dnd.onDragOver(event);
    		expect(event.preventDefault).toHaveBeenCalledTimes(1);
      });
    });

    describe('Method onDragEnd', () => {
    	it('It stops event by preventDefault', () => {
    		dnd.onDragEnd(event);
    		expect(event.preventDefault).toHaveBeenCalledTimes(2);
      });

      it('It should call callBack on end', () => {
    		dnd.onDragEnd(event);
    		expect(dnd.onUpdate).toHaveBeenCalledTimes(2);
      });
    });
  });
});

const fc = new FramesConstructor(canvasObj);
fc.framesId = [1, 2, 3, 4, 5];
const f = new Frame(fc, 33);

describe('Frame', () => {
  const replaceContainer = document.createElement('div');
  f.container = replaceContainer;
  describe('Method "render"', () => {
    const childrenLenBefore = replaceContainer.children.length;
    f.render();
    it('Creates and appends elements for new frame', () => {
    		expect(childrenLenBefore === replaceContainer.children.length).toBeFalsy();
    });

    it('Creates and appends elements for new frame -> has button', () => {
    		expect(replaceContainer.querySelectorAll('button').length > 1).toBeTruthy();
    });

    it('Creates and appends elements for new frame -> has img', () => {
    		expect(replaceContainer.querySelectorAll('img').length >= 1).toBeTruthy();
    });
	 });
});


describe('FramesConstructor', () => {
 	describe('Method "getEmptyFrameData', () => {
 		const size1 = [['#ffffff']];

    const size2 = [
        	['#ffffff', '#ffffff'],
        	['#ffffff', '#ffffff'],
    ];

    const size3 = [
        	['#ffffff', '#ffffff', '#ffffff'],
        	['#ffffff', '#ffffff', '#ffffff'],
        	['#ffffff', '#ffffff', '#ffffff'],
    ];

    const size4 = [
        	['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
        	['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
        	['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
        	['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
    ];

    const size5 = [
        	['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
        	['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
        	['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
        	['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
        	['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
    ];

    const varies = [size1, size2, size3, size4, size5];


 		it('Returns array nxn with requested zise fill "#ffffff"', () => {
 			varies.forEach((v, i) => {
 				const size = i + 1;
 				const arr = fc.getEmptyFrameData(size);
 				expect(arr.toString()).toEqual(v.toString());
 			});
    });
 	});

 	describe('Method "switchSize"', () => {
 		const event = { target: { classList: { add: () => {} }, dataset: { framesSize: 100 } } };
 		jest.spyOn(event.target.classList, 'add');
 		fc.sizeSwitcher = document.createElement('div');
 		it('Changes size state on setted data-size', () => {
 			fc.switchSize(event);
 			expect(fc.size).toEqual(100);
 		});

 		it('Sets active class on target', () => {
 			fc.switchSize(event);
 			expect(event.target.classList.add).toHaveBeenCalledWith('active');
 		});
  });

  describe('Method "getNewId"', () => {
    	it('Always return different number', () => {
    		const ids = [];
 			for (let i = 100; i > 0; i -= 1) {
 				const id = fc.getNewId();
 				expect(ids.indexOf(id)).toEqual(-1);
 				ids.push(id);
 			}
 		});
  });

  describe('Method "delete"', () => {
    	it('Deletes id from FramesConstructor framesId', () => {
    		fc.framesId = ['5', '6', '7', '8', '9'];
    		fc.delete('5');
    	    expect(fc.framesId.indexOf(5)).toEqual(-1);
    	    fc.delete('6');
    	    expect(fc.framesId.indexOf(6)).toEqual(-1);
    	    fc.delete('7');
    	    expect(fc.framesId.indexOf(7)).toEqual(-1);
    	    fc.delete('8');
    	    expect(fc.framesId.indexOf(8)).toEqual(-1);
    	    fc.delete('9');
    	    expect(fc.framesId.indexOf(9)).toEqual(-1);
 		});
  });
});


describe('Palette', () => {
  const p = new Palette(canvasObj);
  describe('Method "setPreviousCellPosition"', () => {
    it('Sets null if e.target itsnt canvas elevent', () => {
      const event = { target: null };
      p.setPreviousCellPosition(event);
      expect(p.previousCellPosition).toEqual(null);
    });
  });

  describe('Method "getCursorPosition"', () => {
    it('Returns cursor posinion as {x : ?, y: ?}', () => {
      const event = {
        pageX: 0, pageY: 0, clientX: 4, clientY: 25,
      };
      const event2 = {
        pageX: 0, pageY: 0, clientX: 15, clientY: 3,
      };
      const event3 = {
        pageX: 0, pageY: 0, clientX: 85, clientY: 77,
      };
      let obj = p.getCursorPosition(event);
      expect(obj.x).toEqual(4);
      expect(obj.y).toEqual(25);
			 obj = p.getCursorPosition(event2);
      expect(obj.x).toEqual(15);
      expect(obj.y).toEqual(3);
			 obj = p.getCursorPosition(event3);
      expect(obj.x).toEqual(85);
      expect(obj.y).toEqual(77);
    });
  });
  describe('Method "getClickedMatrixParam"', () => {
    it('Returns clicked matrix as { height : ?, width: ?, row : ?, cell : ?}', () => {
      const event = {
        pageX: 0, pageY: 0, clientX: 4, clientY: 25,
      };
      const obj = p.getClickedMatrixParam(event);
      const canvasWidghtHeight = 100;
      const activeMtrx = p.canvas.getActiveMatrix();
      expect(obj.height).toEqual(canvasWidghtHeight / activeMtrx.length);
      expect(obj.width).toEqual(canvasWidghtHeight / activeMtrx[0].length);
      expect(obj.row).toEqual(Math.floor(4 / canvasWidghtHeight));
      expect(obj.cell).toEqual(Math.floor(20 / canvasWidghtHeight));
    });
  });


  describe('Method "fillSame"', () => {
    it('Changes all same mtrixes on active color', () => {
      p.activeColor = 'yellow';
      canvasObj.addMatrix({
        id: 'fillSameMtrx',
        matrix: [
          ['black', 'black', 'black'],
          ['red', 'red', 'red'],
          ['black', 'black', 'black'],
        ],
      });

      canvasObj.setActiveMatrix('fillSameMtrx');
      const eventOnBlack = {
        pageX: 0, pageY: 0, clientX: 1, clientY: 89,
      };
      p.fillSame(eventOnBlack);
      const filled = canvasObj.getActiveMatrix();
      expect(filled[0].every((n) => n === 'yellow')).toBeTruthy();
      expect(filled[1].every((n) => n === 'red')).toBeTruthy();
      expect(filled[2].every((n) => n === 'yellow')).toBeTruthy();
    });
  });


  describe('Method "bucketFill"', () => {
    test('Changes all mtrixes around on active color', () => {
      p.activeColor = 'yellow';
      canvasObj.addMatrix({
        id: 'bucketFillMtrx',
        matrix: [
          ['black', 'black', 'black'],
          ['red', 'black', 'red'],
          ['red', 'red', 'red'],
        ],
      });
      const exp = [
			    ['yellow', 'yellow', 'yellow'],
        ['red', 'yellow', 'red'],
        ['red', 'red', 'red'],
      ];
      canvasObj.setActiveMatrix('bucketFillMtrx');
      const eventOnBlack = {
        pageX: 0, pageY: 0, clientX: 2, clientY: 2,
      };
      const prom = Promise.resolve();
      prom.then(() => p.bucketFill(eventOnBlack))
        .then(() => expect(canvasObj.getActiveMatrix().toString()).toEqual(exp.toString()));
    });
  });

  describe('Method "resize"', () => {
    describe('Changes activeMtrx array size', () => {
      canvasObj.addMatrix({
        id: 'resizeMtrx',
        matrix: [
        	['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
        	['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
        	['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
        	['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
        	['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
   			 ],
      });
   			canvasObj.setActiveMatrix('resizeMtrx');
   			p.resize(4);
   			const setted = canvasObj.getActiveMatrix();

   			expect(setted.length).toEqual(4);
    });
  });

  describe('Method "drawCell"', () => {
	  describe('Changes 1 cell color', () => {
	  	    p.activeColor = 'blue';
	  	    canvasObj.addMatrix({
        id: 'resizeMtrx',
        matrix: [
        	['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
        	['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
        	['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
        	['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
        	['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
   			 ],
      });
   			canvasObj.setActiveMatrix('resizeMtrx');
	  	 	const eventrow2cell1 = {
        pageX: 0, pageY: 0, clientX: 4, clientY: 25,
      };
      const obj = p.getClickedMatrixParam(eventrow2cell1);
      p.drawCell(obj);

      expect(canvasObj.getActiveMatrix()[1][0]).toEqual('blue');
	  });
  });

  describe('Method "drawLine"', () => {
	  describe('Changes line color', () => {
	  	    p.activeColor = 'blue';
	  	    canvasObj.addMatrix({
        id: 'resizeMtrx',
        matrix: [
        	['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
        	['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
        	['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
        	['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
        	['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
   			 ],
      });

	  	    const exp = [
        	['blue', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
        	['#ffffff', 'blue', '#ffffff', '#ffffff', '#ffffff'],
        	['#ffffff', '#ffffff', 'blue', '#ffffff', '#ffffff'],
        	['#ffffff', '#ffffff', '#ffffff', 'blue', '#ffffff'],
        	['#ffffff', '#ffffff', '#ffffff', '#ffffff', 'blue'],
   			 ];
   			canvasObj.setActiveMatrix('resizeMtrx');
	  	 	p.drawLine(0, 0, 4, 4, 100 / 5, 100 / 5);

      expect(canvasObj.getActiveMatrix().toString()).toEqual(exp.toString());
	  });
  });
});


describe('FullScreen', () => {
  const body = document.getElementsByTagName('body')[0];
  const fs1 = new FullScreen('<h1></h1>', () => {});

  fs1.render();
  it('Changes all document content', () => {
    expect(body === document.getElementsByTagName('body')[0]).toBeFalsy();
  });
  const fs2 = new FullScreen('', () => {});
  fs2.docWrite('<p>Hello</p>');
  it('fullScreen docWrite method writes any string to document', () => {
    expect(document.getElementsByTagName('body')[0].firstChild.tagName).toEqual('P');
  });

  const myObj = { f: () => 123 };
  jest.spyOn(myObj, 'f');
  const fs3 = new FullScreen('', myObj.f);
  const res2 = myObj.f();

  it('Calls callback', () => {
    expect(myObj.f).toHaveBeenCalledTimes(1);
    expect(fs3.callBack()).toEqual(res2);
  });
});

describe('Shortcut', () => {
  const sc = new Shortcut({
   	pen: {
      key: 'p',
      f: () => 'pen',
      arg: 'pen',
    },
    bucket: {
      key: 'b',
      f: () => 'bucket',
      arg: 'bucket',
    },
    eraser: {
      key: 'e',
      f: () => 'eraser',
      arg: 'eraser',
    },
    fillSame: {
      key: 'f',
      f: () => 'fillSame',
      arg: 'fillSame',
    },
    stroke: {
      key: 's',
      f: () => 'stroke',
      arg: 'stroke',
    },
  });

  sc.inpList = [
    document.createElement('input'),
    document.createElement('input'),
    document.createElement('input'),
    document.createElement('input'),
    document.createElement('input'),
  ];
  const keys = Object.keys(sc.data);
  sc.inpList.forEach((inp, i) => {
   	inp.dataset.item = keys[i];
  });

  sc.btnCloseModal = document.createElement('button');
  sc.btnOpenModal = document.createElement('button');
  sc.btnSaveModal = document.createElement('button');

  sc.start();

  describe('"setItemKeys"', () => {
   	 it('sets keys from arguments object to "itemsKeys"', () => {
   	 	sc.setItemKeys();
   	 	expect(sc.itemsKeys.pen).toEqual('p');
   	 	expect(sc.itemsKeys.bucket).toEqual('b');
   	 	expect(sc.itemsKeys.eraser).toEqual('e');
   	 	expect(sc.itemsKeys.fillSame).toEqual('f');
   	 });
  });


  describe('"hideTip"', () => {
   	 it('removes tip if event target is tipTarget', () => {
   	 	sc.tipTarget = document.createElement('div');
   	 	sc.tipEl = document.createElement('div');
   	 	const event = { target: sc.tipTarget };
   	 	sc.hideTip(event);
   	 	expect(sc.tipEl).toEqual(null);
   	 });
  });

  describe('"showTip"', () => {
   	  it('creates tip element if target has key with correct tip', () => {
   	 	const newEl = document.createElement('div');
   	 	const event = { target: { dataset: { tip: 'pen' }, getBoundingClientRect: () => ({ left: 0 }), offsetWidth: 0 } };
   	 	sc.showTip = sc.showTip.bind(sc);
   	 	sc.showTip(event);
   	 	const correctTip = '(p)';
   	 	expect(sc.tipEl.textContent).toEqual(correctTip);
   	  });

   	  it('remove tip first if tipTarget is deleted fom document', () => {
   	 	const newEl = document.createElement('div');
   	 	sc.tipTarget = newEl;
   	 	const event = { target: { dataset: { tip: 'bucket' }, getBoundingClientRect: () => ({ left: 0 }), offsetWidth: 0 } };
   	 	sc.showTip = sc.showTip.bind(sc);
   	 	sc.showTip(event);
   	 	const correctTip = '(b)';
   	 	expect(sc.tipEl.textContent).toEqual(correctTip);
   	  });
  });

  describe('"saveItemsToLocal"', () => {
   	  it('sets itemsKeys to LocalStorage', () => {
   	 	sc.saveItemsToLocal();
   	  });
  });

  describe('"disableModal"', () => {
   	  it('turns modal display to none', () => {
   	  	sc.modal = document.createElement('div');
   	  	sc.disableModal();
   	 	expect(sc.modal.style.display).toEqual('none');
   	  });
  });

  describe('"showModal"', () => {
   	  it('turns modal display to block', () => {
   	  	sc.showModal();
   	 	expect(sc.modal.style.display).toEqual('block');
   	  });
  });

  const newValues = ['a', 'b', 'c', 'd', 'e'];

  sc.inpList.forEach((inp, i) => {
    	inp.value = newValues[i];
  });


  describe('"saveModal"', () => {
   	  it('save inputed values to itemsKeys', () => {
   	  	 sc.saveModal();
   	  	expect(sc.itemsKeys.pen).toEqual('a');
   	  	expect(sc.itemsKeys.bucket).toEqual('b');
   	  	expect(sc.itemsKeys.eraser).toEqual('c');
   	  	expect(sc.itemsKeys.fillSame).toEqual('d');
   	  	expect(sc.itemsKeys.stroke).toEqual('e');
   	  });
  });


  describe('"callByKey"', () => {
   	  it('call assigned function if key pressed', () => {
   	  	 const event = { key: 'd' };

   	  	jest.spyOn(sc.data.fillSame, 'f');
   	  	sc.callByKey(event);
   	  	expect(sc.data.fillSame.f).toHaveBeenCalledTimes(1);
   	  });
  });
});

describe('"PaletteSwitcherController"', () => {
  const paletteSwitcher = {
    activatePen: () => 'activatePen',
    activateEraser: () => 'activateEraser',
    activateBucket: () => 'activateBucket',
    activateFillSame: () => 'activateFillSame',
    activateStroke: () => 'activateStroke',
    activatePicker: () => 'activatePicker',
    unactivatePen: () => 'unactivatePen',
    unactivateEraser: () => 'unactivateEraser',
    unactivateBucket: () => 'unactivateBucket',
    unactivateFillSame: () => 'unactivateFillSame',
    unactivateStroke: () => 'unactivateStroke',
    unactivatePicker: () => 'unactivatePicker',
  };
  const psc = new PaletteSwitcherController(paletteSwitcher);
  psc.menu = document.createElement('div');
  const nextTool = document.createElement('li');
  nextTool.dataset.toolsId = 'pen';
  psc.menu.appendChild(nextTool);
  psc.start();

  jest.spyOn(paletteSwitcher, 'activatePen');
  jest.spyOn(paletteSwitcher, 'activateFillSame');

  it('Method "start" sets active tool by default', () => {
    expect(psc.menu.querySelector('li.active')).toBeTruthy();
  });

  psc.start();
  const nextTool2 = document.createElement('li');
  nextTool2.dataset.toolsId = 'fillSame';
  psc.menu.appendChild(nextTool2);
  psc.toogle('fillSame');

  it('Method "toogle" changes active item and call function unactivate for this tool', () => {
    expect(nextTool.classList.contains('active')).toBeFalsy();
    expect(nextTool2.classList.contains('active')).toBeTruthy();
  });

  it('sets obj callById', () => {
    expect(psc.callById.pen.activate()).toEqual('activatePen');
    expect(psc.callById.pen.unactivate()).toEqual('unactivatePen');
  });
});
