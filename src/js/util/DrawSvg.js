const frame = 30;
const rate = 0.1;
let drawElemCount = 0;

window.requestAnimFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / frame);
    }
  );
})();

window.cancelAnimFrame = (function() {
  return (
    window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.oCancelAnimationFrame ||
    window.msCancelAnimationFrame ||
    function(id) {
      window.clearTimeout(id);
    }
  );
})();

const lineLength = (x1, y1, x2, y2) => {
  const length = Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
  return length;
};

const getTotalLineLength = elem => {
  const x1 = elem.getAttributeNS(null, 'x1');
  const y1 = elem.getAttributeNS(null, 'y1');
  const x2 = elem.getAttributeNS(null, 'x2');
  const y2 = elem.getAttributeNS(null, 'y2');

  return lineLength(x1, y1, x2, y2);
};

export default class DrawSvg {
  constructor(type, el, startType, inOrder) {
    this.el = el;
    this.type = el.tagName;
    this.startType = startType;
    this.currentFrame = 0;

    this.handle = 0;

    if (this.type === 'path') {
      this.elLength = el.getTotalLength();
    } else if (this.type === 'line') {
      this.elLength = getTotalLineLength(this.el);
    }

    // draw speed
    if (inOrder) {
      this.totalFrame = frame;
      this.duration = drawElemCount * rate;
      drawElemCount++;
      if(drawElemCount === 7) {
        drawElemCount = 0;
      }
    } else {
      this.totalFrame = 50;
      this.duration = 0;
    }

    this.el.style.strokeDasharray = `${this.elLength} ${this.elLength}`;
    this.el.style.strokeDashoffset = this.elLength;
  }

  draw() {
    this.el.style.opacity = 1; // stroke-linecapを使うとlinecapの部分が最初から表示されてしまうので、ここで表示させる
    this.playAnimation();
  }

  resetAnimation() {
    this.el.style.strokeDashoffset = this.elLength;
    this.currentFrame = 0;
  }

  playAnimation() {
    const _this = this;
    const progress = this.currentFrame / this.totalFrame;
    if (progress > 1) {
      window.cancelAnimFrame(this.handle);
    } else {
      this.currentFrame++;
      if (this.startType === 'true') { // trueに意味は無いが、逆からアニメーションさせたい場合はfalseを渡す。
        this.el.style.strokeDashoffset = Math.floor(this.elLength * (1 - progress));
      } else {
        this.el.style.strokeDashoffset = Math.floor(-this.elLength * (1 - progress));
      }

      this.handle = window.requestAnimFrame(function() {
        _this.playAnimation();
      });
    }
  }
}
