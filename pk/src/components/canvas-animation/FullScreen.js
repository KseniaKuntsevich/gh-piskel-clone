export default class FullScreen {
  constructor(strHtml, callBack) {
    this.strHtml = strHtml;
    this.callBack = callBack;
  }

  render() {
    const fullScreenErrors = [];
    let tryScreen;
    if (document.fullscreenEnabled) {
      tryScreen = Promise.resolve().then(() => document.documentElement.requestFullscreen());
      tryScreen.catch((err) => fullScreenErrors.push(err));
    }

    this.docWrite(this.strHtml);
    this.callBack();
  }

  docWrite(str) {
    document.write(str);
  }
}
