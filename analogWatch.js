const p = Math.PI / 2;
const PRad = Math.PI / 180;
const hourDegrees = 15;
let intervalRefSec = null;
let currentDate = new Date();


function seconds(angle, r) {
  const a = angle * PRad;
  const x = 120 + Math.sin(a) * r;
  const y = 120 - Math.cos(a) * r;
  if (angle % hourDegrees === 0) {
    g.fillEllipse(x - 2, y - 2, x + 2, y + 2);
  } else {
    g.fillEllipse(x - 1, y - 1, x + 1, y + 1);
  }
}

function hand(angle, r1, r2) {
  const a = angle * PRad;
  const r3 = 3;
  g.fillPoly([
    120 + Math.sin(a) * r1,
    120 - Math.cos(a) * r1,
    120 + Math.sin(a + p) * r3,
    120 - Math.cos(a + p) * r3,
    120 + Math.sin(a) * r2,
    120 - Math.cos(a) * r2,
    120 + Math.sin(a - p) * r3,
    120 - Math.cos(a - p) * r3
  ]);
}

function drawAll() {
  g.clear();
  currentDate = new Date();
  // draw hands first
  onMinute();
  // draw seconds
  g.setColor(0, 0, 0.6);
  for (let i = 0; i < 60; i++) {
    seconds((360 * i) / 60, 95);
  }
  onSecond();
}

function resetSeconds() {
  g.setColor(0, 0, 0.6);
  for (let i = 0; i < 60; i++) {
    seconds((360 * i) / 60, 95);
  }
}

function onSecond() {
  g.setColor(0.3, 0.3, 1);
  seconds((360 * currentDate.getSeconds()) / 60, 95);
  if (currentDate.getSeconds() === 59) {
    resetSeconds();
    onMinute();
  }
  g.setColor(1, 0.7, 0.2);
  currentDate = new Date();
  seconds((360 * currentDate.getSeconds()) / 60, 95);
  g.setColor(1, 1, 1);
}

function onMinute() {
  g.setColor(0, 0, 0);
  // Hour hand
  hand(
    (360 * (currentDate.getHours() + currentDate.getMinutes() / 60)) / 12,
    -8,
    55
  );
  //Minute Hand
  hand((360 * currentDate.getMinutes()) / 60, -8, 88);
  currentDate = new Date();
  g.setColor(1, 0.7, 0.7);
  // Hour Hand
  hand(
    (360 * (currentDate.getHours() + currentDate.getMinutes() / 60)) / 12,
    -8,
    55
  );
  g.setColor(1, 1, 0.8);
  // Minute Hand
  hand((360 * currentDate.getMinutes()) / 60, -8, 88);
  if (currentDate.getHours() >= 0 && currentDate.getMinutes() === 0) {
    Bangle.buzz();
  }
}

function clearTimers() {
  if (intervalRefSec) {
    clearInterval(intervalRefSec);
  }
}

function startTimers() {
  currentDate = new Date();
  currentDate = new Date();
  intervalRefSec = setInterval(onSecond, 1000);
  drawAll();
}

Bangle.on("lcdPower", function (on) {
  if (on) {
    g.clear();
    Bangle.drawWidgets();
    startTimers();
  } else {
    clearTimers();
  }
});

g.clear();
Bangle.loadWidgets();
Bangle.drawWidgets();
drawAll();
startTimers();
// Show launcher when middle button pressed
setWatch(Bangle.showLauncher, BTN2, { repeat: false, edge: "falling" });
