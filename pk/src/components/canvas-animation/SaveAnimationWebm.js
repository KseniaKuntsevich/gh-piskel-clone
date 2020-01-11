import CanvasAnimation from './CanvasAnimation';

export default function saveAnimationWebm() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const animation = new CanvasAnimation(canvas);
  animation.start();

  function exportVid(blob) {
    animation.finish();
    const vid = document.createElement('video');
    vid.src = URL.createObjectURL(blob);
    vid.controls = true;
    const a = document.createElement('a');
    a.download = 'piskel-clone.webm';
    a.href = vid.src;
    a.click();
  }

  function startRecording() {
    const chunks = [];
    const stream = canvas.captureStream();
    const { MediaRecorder } = window;
    const rec = new MediaRecorder(stream, { mimeType: 'video/webm' });
    rec.ondataavailable = (e) => { chunks.push(e.data); };
    rec.onstop = () => {
      exportVid(new Blob(chunks, { type: 'video/webm' }));
    };
    rec.start();
    setTimeout(() => rec.stop(), animation.framesId.length * (1000 / animation.speed));
  }

  startRecording();
}
