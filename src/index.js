const css = require('./app.css'); 

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const btnNext = document.getElementById('btnNext');
const btnAuto = document.getElementById('btnAuto');
const korTicker = document.getElementById('kor');
const bntRandom = document.getElementById('bntRandom');

canvas.addEventListener('click', toggleCellOnClick, false);
btnNext.addEventListener('click', kovKor);
btnAuto.addEventListener('click', automate);
bntRandom.addEventListener('click', random);

const szelesseg = 1000;
const hosszusag = 1000;
let tabla = [];
const cellaMeret = 10;

let generation = 0;
let isAutomate = false;
let fps = 10;
let now;
let then = Date.now();
let speed = 1000 / fps;
let delta;

function Sejt(x, y){
    this.x = x;
    this.y = y;
    this.meret = cellaMeret;
    this.isAlive = false;
    this.szomszed = 0;
    this.getSzomszed = function() {
      if (this.x > 0 && tabla[this.x - 1][this.y].isAlive) {
        this.szomszed++;
      }
      if (this.x < szelesseg - 1 && tabla[this.x + 1][this.y].isAlive) {
        this.szomszed++;
      }
      if (this.y < hosszusag - 1 && tabla[this.x][this.y + 1].isAlive) {
        this.szomszed++;
      }
      if (this.y > 0 && tabla[this.x][this.y - 1].isAlive) {
        this.szomszed++;
      }
      if (this.x > 0 && this.y > 0 && tabla[this.x - 1][this.y - 1].isAlive) {
        this.szomszed++;
      }
      if (this.x < szelesseg - 1 && this.y > 0 && tabla[this.x + 1][this.y - 1].isAlive) {
        this.szomszed++;
      }
      if (this.y < hosszusag - 1 && this.x > 0 && tabla[this.x - 1][this.y + 1].isAlive) {
        this.szomszed++;
      }
      if (this.x < szelesseg - 1 && this.y < hosszusag - 1 && tabla[this.x + 1][this.y + 1].isAlive) {
        this.szomszed++;
      }
    }
    this.draw = () => {
        ctx.beginPath();
        ctx.rect(this.x * this.meret, this.y * this.meret, this.meret, this.meret);
        ctx.strokeStyle = '#c0c3c5';
        ctx.stroke();
        ctx.closePath();
    
        if (this.isAlive) {
          ctx.fillStyle = '#DA1D1D';
        } else {
          ctx.fillStyle = '#f3f3f3';
        }
        ctx.fillRect(this.x * this.meret, this.y * this.meret, this.meret, this.meret);
        ctx.stroke();
      };
}

function init(){
    console.log('init');
    for (let i = 0; i < szelesseg; i++) {
        const temp = [];
        for (let j = 0; j < hosszusag; j++) {
          temp[j] = new Sejt(i, j);
        }
        tabla[i] = temp;
      }
      console.log(tabla);
      drawTerkep();
    
}

function drawTerkep() {
    for (let i = 0; i < szelesseg; i++) {
      for (let j = 0; j < hosszusag; j++) {
        tabla[i][j].draw();
      }
    }
  }


  function toggleCellOnClick(e) {
    const xPosition = e.offsetX - canvas.offsetLeft;
    const yPosition = e.offsetY - canvas.offsetTop;
    console.log(xPosition,yPosition);
    console.log(e.offsetX,e.offsetY);
    console.log(canvas.offsetLeft,canvas.offsetTop);
    toggleCell(xPosition, yPosition);
  }
  
  function toggleCell(xPosition, yPosition) {
    for (let i = 0; i < szelesseg; i++) {
      for (let j = 0; j < hosszusag; j++) {
        let sejt = tabla[i][j];
  //console.log(sejt);
        if ((xPosition >= sejt.x * sejt.meret && xPosition < sejt.x * sejt.meret + sejt.meret)
        && (yPosition >= sejt.y * sejt.meret && yPosition < sejt.y * sejt.meret + sejt.meret)) {
          sejt.isAlive = !sejt.isAlive;
          sejt.getSzomszed();
          console.log('getszomszed');
        }
      }
    }
    drawTerkep();
  }

  function kovKor() {
    const tempTerkep = [];
  
    for (let i = 0; i < szelesseg; i++) {
      let temp = [];
      for (let j = 0; j < hosszusag; j++) {
        temp[j] = new Sejt(i, j);
      }
      tempTerkep[i] = temp;
    }
  
    for (let i = 0; i < szelesseg; i++) {
      for (let j = 0; j < hosszusag; j++) {
        sejt = tabla[i][j]
        sejt.getSzomszed()
        const { szomszed } = sejt;
        if (szomszed < 2) {
            tempTerkep[i][j].isAlive = false;
        }
        if (sejt.isAlive && (szomszed === 3 || szomszed === 2)) {
            tempTerkep[i][j].isAlive = true;
        }
        if (szomszed > 3) {
            tempTerkep[i][j].isAlive = false;
        }
        if (szomszed === 3) {
            tempTerkep[i][j].isAlive = true;
        }
      }
    }
  
    tabla = tempTerkep;
    generation++;
  }

  function run() {
    requestAnimationFrame(run);
    now = Date.now();
    delta = now - then;
    if (delta > speed) {
      then = now - (delta % speed);
      if (isAutomate) {
        kovKor();
      }
  
      drawTerkep();
      korTicker.textContent = generation;
    }
  }

  function automate() {
    isAutomate = !isAutomate;
    isAutomate ? btnAuto.textContent = 'Stop' : btnAuto.textContent = 'Automate';
  }
  
  function random() {
    for (let i = 0; i < szelesseg; i++) {
      const temp = [];
      for (let j = 0; j < hosszusag; j++) {
        temp[j] = new Sejt(i, j);
        let randomNum = Math.round(Math.random());
        if (randomNum === 0) {
          temp[j].isAlive = true;
        }
      }
      tabla[i] = temp;
    }
    drawTerkep();
    generation = 0;
  }


init();
run();