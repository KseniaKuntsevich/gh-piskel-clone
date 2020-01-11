import * as GIF from '../../../node_modules/gif.js/dist/gif';
import CanvasAnimation from './CanvasAnimation';

export default function saveAnimationGif() {
  const gif = new GIF({
    workers: 2,
    quality: 10,
    workerScript: './modules/gif.worker.js',
    width: 128,
    height: 128,
  });

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const animation = new CanvasAnimation(canvas);
  animation.setFramesFromStorage();
  const delay = 1000 / animation.speed;

  animation.framesId.forEach(() => {
    animation.changeFrame();
    gif.addFrame(animation.canvasConstructor.canvas, { delay });
    const newCanvEl = document.createElement('canvas');
    newCanvEl.width = 128;
    newCanvEl.height = 128;
    animation.canvasConstructor.canvas = newCanvEl;
  });

  gif.on('finished', (blob) => {
    animation.finish();
    const vid = document.createElement('video');
    vid.src = URL.createObjectURL(blob);
    vid.controls = true;
    const a = document.createElement('a');
    a.download = 'piskel-clone.gif';
    a.href = vid.src;
    a.click();
  });

  gif.render();
}
