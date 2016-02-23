import $ from 'jquery';
import resizeStageWidth from './util/resizeStageWidth';
import DrawSvg from './util/DrawSvg';
const logoData = require('./data/gibbon-logo.json');
const logo = 'GIBbON';

const xmlns = 'http://www.w3.org/2000/svg';
let pathArr = [];
let timerArr = [];
let svgLeft = 0;
let count = 0;
let pathCount;

const createPath = (data, parent, color, startType, inOrder) => {
  let pathElem;
  const type = data.type;
  if (type === 'path') {
    pathElem = document.createElementNS(xmlns, 'path');
    pathElem.setAttributeNS(null, 'd', data.d);
    pathElem.setAttributeNS(null, 'class', 'c-path');
    pathElem.setAttributeNS(null, 'stroke', color);
  } else if (type === 'line') {
    pathElem = document.createElementNS(xmlns, 'line');
    pathElem.setAttributeNS(null, 'x1', data.x1);
    pathElem.setAttributeNS(null, 'y1', data.y1);
    pathElem.setAttributeNS(null, 'x2', data.x2);
    pathElem.setAttributeNS(null, 'y2', data.y2);
    pathElem.setAttributeNS(null, 'class', 'c-line');
    pathElem.setAttributeNS(null, 'stroke', color);
  }
  pathElem.style.display = 'block';

  const drawElem = new DrawSvg(type, pathElem, startType, inOrder);
  pathArr.push(drawElem);

  parent.appendChild(pathElem);
  pathCount++;
};

const addStageChara = (stage, chara, charaData, startType, inOrder) => {
  if (Array.isArray(charaData)) {
    const pathNum = charaData.length;
    const svgElem = document.createElementNS(xmlns, 'svg');
    const id = `path-${count}`;

    svgElem.setAttributeNS(null, 'id', id);
    svgElem.setAttributeNS(null, 'x', svgLeft);
    svgElem.setAttributeNS(null, 'pathNum', pathNum);
    svgElem.style.display = 'block';

    stage.append(svgElem);
    const color = '#231815'

    charaData.slice().map(item => {
      createPath(item, svgElem, color, startType, inOrder);
    });
    count++;
  }
};

const playAnimation = () => {
  if (pathArr.length > 0) {
    pathArr.forEach(item => {
      const timer = setTimeout(() => {
        item.draw();
      }, item.duration * 1000);
      timerArr.push(timer);
    });
  }
};

const init = () => {
  const stage = $('.js-logos');
  const logoArr = logo.split('');

  logoArr.slice().forEach(item => {
    const chara = logoData[item]['data'];
    const startType = logoData[item]['startType']
    resizeStageWidth(stage, true);
    addStageChara(stage, item, chara, startType, true);
  });

  playAnimation();
}
init();
