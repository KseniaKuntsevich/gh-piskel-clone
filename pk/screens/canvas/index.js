import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import Canvas from '../../src/components/canvas/Canvas';
import CanvasAnimation from '../../src/components/canvas-animation/CanvasAnimation';
import SaveAnimationGif from '../../src/components/canvas-animation/SaveAnimationGif';
import SaveAnimationWebm from '../../src/components/canvas-animation/SaveAnimationWebm';
import FullScreen from '../../src/components/canvas-animation/FullScreen';
import Palette from '../../src/components/palette/Palette';
import PaletteSwitcher from '../../src/components/palette/PaletteSwitcher';
import PaletteSwitcherController from '../../src/components/palette/PaletteSwitcherController';
import Shortcut from '../../src/components/shortcut/Shortcut';
import FramesConstructor from '../../src/components/frames-list/FramesConstructor';

export default function CanvasApp() {
  const canvas = document.getElementById('canvas');
  if (!canvas) return;
  const canv = new Canvas(
    canvas,
    {},
  );
  const palette = new Palette(canv);
  const paletteSwitcher = new PaletteSwitcher(palette);

  const paletteSwitcherController = new PaletteSwitcherController(paletteSwitcher);
  paletteSwitcherController.start();

  const frames = new FramesConstructor(canv);
  frames.render();

  const shortcut = new Shortcut({
    pen: {
      key: 'p',
      f: paletteSwitcherController.toogle,
      arg: 'pen',
    },
    bucket: {
      key: 'b',
      f: paletteSwitcherController.toogle,
      arg: 'bucket',
    },
    eraser: {
      key: 'e',
      f: paletteSwitcherController.toogle,
      arg: 'eraser',
    },
    fillSame: {
      key: 'f',
      f: paletteSwitcherController.toogle,
      arg: 'fillSame',
    },
    stroke: {
      key: 's',
      f: paletteSwitcherController.toogle,
      arg: 'stroke',
    },
    picker: {
      key: 'o',
      f: paletteSwitcherController.toogle,
      arg: 'picker',
    },
    color: {
      key: 'c',
      f: () => (document.querySelector('[data-palette-input]').click()),
      arg: 'color',
    },
    deleteFrame: {
      key: 'd',
      f: frames.delete,
      arg: null,
    },
    addFrame: {
      key: 'a',
      f: frames.setNewFrame,
      arg: '',
    },
  });

  shortcut.start();

  const canvElAnim = document.getElementById('canvasAnimation');
  const canvasAnimation = new CanvasAnimation(canvElAnim, document.getElementById('inpAnimationSpeed'));
  canvasAnimation.start();


  const strHtml = '<div id="cont"><button id="back">Back</button><canvas id="canvasFullScreen"></canvas></div>';
  function onWriteCallBack() {
    const c = document.getElementById('canvasFullScreen');
    const b = document.getElementById('back');
    const cont = document.getElementById('cont');
    c.width = 768;
    c.height = 768;
    c.style = 'display:block; margin: 0 auto';
    b.style = 'padding: 7px; margin: 5px; width: 110px; cursor: pointer; font-size: 12px; font-weight: bold;';
    cont.style = 'text-align: right';
    const canvasAnimation2 = new CanvasAnimation(c);
    canvasAnimation2.start();
    b.addEventListener('click', () => { window.location.reload(true); });
  }

  const canvasAnimationFullScreen = new FullScreen(strHtml, onWriteCallBack);

  document.getElementById('fullScreen').addEventListener('click', () => {
    canvasAnimationFullScreen.render();
  });
  document.getElementById('btnSaveAnimationGif').addEventListener('click', () => {
    SaveAnimationGif();
  });

  document.getElementById('btnSaveAnimationWebm').addEventListener('click', () => {
    SaveAnimationWebm();
  });
}
