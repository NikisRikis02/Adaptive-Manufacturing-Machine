const MATERIALS = {
  BALSO: {
    name: "Espuma / Balso",
    thickness: 15,
    hardness: "Baja (2/10)",
    rpm: 4500,
    feed: 12.0,
    current: 1.2,
    vibration: 1.5,
    colorTop: "#4ade80",
    colorBody: "#16a34a",
    chipColor: "#86efac"
  },

  MDF: {
    name: "Madera MDF",
    thickness: 18,
    hardness: "Media (5.5/10)",
    rpm: 3200,
    feed: 7.5,
    current: 2.8,
    vibration: 3.4,
    colorTop: "#fbbf24",
    colorBody: "#b45309",
    chipColor: "#fde68a"
  },

  ACRILICO: {
    name: "Acrílico / Nylon",
    thickness: 10,
    hardness: "Alta (8.5/10)",
    rpm: 2100,
    feed: 3.5,
    current: 4.5,
    vibration: 5.2,
    colorTop: "#c084fc",
    colorBody: "#7e22ce",
    chipColor: "#e9d5ff"
  }
};

let currentKey = "MDF";
let mat = MATERIALS[currentKey];
let knotActive = false;

let liveRpm = mat.rpm;
let liveFeed = mat.feed;
let liveCurrent = mat.current;
let liveVib = mat.vibration;

let carriageX = 350;
let carriageDir = 1;
let spindlePhase = 0;
let laserScanAngle = 0;
let chips = [];

const histFeed = new Array(80).fill(mat.feed);
const histLoad = new Array(80).fill(mat.current * 2);

const mCanvas = document.getElementById("machineCanvas");
const mCtx = mCanvas.getContext("2d");

const sCanvas = document.getElementById("scopeCanvas");
const sCtx = sCanvas.getContext("2d");

/* SELECCIONAR MATERIAL */
function selectMaterial(key) {
  currentKey = key;
  mat = MATERIALS[key];

  knotActive = false;
  updateKnotUI();

  ["BALSO", "MDF", "ACRILICO"].forEach(k => {
    document.getElementById("btn-" + k).classList.remove("active-mat");
  });

  document.getElementById("btn-" + key).classList.add("active-mat");
}

/* ACTIVAR O DESACTIVAR DESVIACIÓN */
function toggleKnot() {
  knotActive = !knotActive;
  updateKnotUI();
}

/* ACTUALIZAR ESTADO VISUAL */
function updateKnotUI() {
  const btn = document.getElementById("btnKnot");
  const step5 = document.getElementById("step5");
  const step5Text = document.getElementById("step5Text");
  const badge = document.getElementById("machineStateBadge");

  if (knotActive) {
    btn.classList.add("active");

    btn.innerText = "🔄 Quitar Desviación (Restaurar Corte Normal)";

    step5.className = "step-item alert-step";

    step5Text.innerText =
      "5. ¡CORRECCIÓN ACTIVA! Exceso de fuerza detectado → Reduciendo avance -52% y ajustando RPM.";

    badge.innerText = "⚡ CORRIGIENDO DESVIACIÓN EN VIVO";
    badge.style.color = "#f59e0b";
    badge.style.borderColor = "#f59e0b";

  } else {
    btn.classList.remove("active");

    btn.innerText = "⚠️ Simular Desviación / Nudo Duro";

    step5.className = "step-item";

    step5Text.innerText =
      "5. Lazo Cerrado en espera: Parámetros estables sin desviaciones.";

    badge.innerText = "● ESCANEANDO Y MECANIZANDO";
    badge.style.color = "#22c55e";
    badge.style.borderColor = "#22c55e";
  }
}

/* ACTUALIZACIÓN DE SENSORES EN TIEMPO REAL */
setInterval(() => {

  const noise = (Math.random() - 0.5) * 0.16;

  let targetRpm = mat.rpm;
  let targetFeed = mat.feed;
  let targetCurrent = mat.current + noise;
  let targetVib = mat.vibration + noise * 2;

  if (knotActive) {
    targetCurrent = mat.current * 1.65 + noise;
    targetVib = mat.vibration * 1.75 + noise * 3;
    targetFeed = Math.max(1.4, mat.feed * 0.48);
    targetRpm = mat.rpm * 0.82;
  }

  liveRpm += (targetRpm - liveRpm) * 0.25;
  liveFeed += (targetFeed - liveFeed) * 0.25;
  liveCurrent += (targetCurrent - liveCurrent) * 0.3;
  liveVib += (targetVib - liveVib) * 0.3;

  document.getElementById("valRpm").innerText =
    `${Math.round(liveRpm)} RPM`;

  document.getElementById("valFeed").innerText =
    `${liveFeed.toFixed(1)} mm/s`;

  document.getElementById("valForce").innerText =
    `${liveCurrent.toFixed(2)} A`;

  document.getElementById("valVib").innerText =
    `${liveVib.toFixed(2)} mm/s²`;

  document.getElementById("subVision").innerText =
    `Cámara: ${mat.name} (${mat.thickness} mm)`;

  document.getElementById("subFeed").innerText = knotActive
    ? "⚡ Frenado adaptativo activo"
    : `Dureza ${mat.hardness}`;

  histFeed.push(liveFeed);
  histFeed.shift();

  histLoad.push(liveCurrent * 2.1);
  histLoad.shift();

  drawScope();

}, 80);

/* ANIMACIÓN DE LA MÁQUINA CNC */
function animateMachine() {

  mCtx.clearRect(0, 0, mCanvas.width, mCanvas.height);

  /* CUADRÍCULA TÉCNICA */
  mCtx.strokeStyle = "rgba(51, 65, 85, 0.28)";
  mCtx.lineWidth = 1;

  for (let x = 0; x < mCanvas.width; x += 35) {
    mCtx.beginPath();
    mCtx.moveTo(x, 0);
    mCtx.lineTo(x, mCanvas.height);
    mCtx.stroke();
  }

  for (let y = 0; y < mCanvas.height; y += 35) {
    mCtx.beginPath();
    mCtx.moveTo(0, y);
    mCtx.lineTo(mCanvas.width, y);
    mCtx.stroke();
  }

  /* ESTRUCTURA PÓRTICO CNC */
  mCtx.fillStyle = "#1e293b";
  mCtx.strokeStyle = "#475569";
  mCtx.lineWidth = 2;

  mCtx.fillRect(75, 45, 28, 285);
  mCtx.strokeRect(75, 45, 28, 285);

  mCtx.fillRect(597, 45, 28, 285);
  mCtx.strokeRect(597, 45, 28, 285);

  mCtx.fillStyle = "#0f172a";
  mCtx.fillRect(65, 55, 570, 42);
  mCtx.strokeRect(65, 55, 570, 42);

  mCtx.fillStyle = "#64748b";
  mCtx.fillRect(103, 66, 494, 5);
  mCtx.fillRect(103, 84, 494, 5);

  /* MESA DE TRABAJO */
  const bedY = 325;

  mCtx.fillStyle = "#1e293b";
  mCtx.fillRect(55, bedY, 590, 32);
  mCtx.strokeRect(55, bedY, 590, 32);

  /* PIEZA DE MATERIAL */
  const pieceHeight = mat.thickness * 2.5;
  const pieceY = bedY - pieceHeight;
  const pieceX = 230;
  const pieceW = 240;

  mCtx.fillStyle = mat.colorBody;
  mCtx.fillRect(pieceX, pieceY, pieceW, pieceHeight);

  mCtx.fillStyle = mat.colorTop;
  mCtx.fillRect(pieceX, pieceY, pieceW, 6);

  mCtx.strokeStyle = "#ffffff44";
  mCtx.strokeRect(pieceX, pieceY, pieceW, pieceHeight);

  /* MORDAZAS */
  mCtx.fillStyle = "#475569";

  mCtx.fillRect(pieceX - 22, bedY - 22, 22, 22);
  mCtx.fillRect(pieceX + pieceW, bedY - 22, 22, 22);

  /* DESVIACIÓN O NUDO DURO */
  if (knotActive) {

    mCtx.fillStyle = "rgba(239, 68, 68, 0.85)";

    mCtx.beginPath();

    mCtx.ellipse(
      carriageX,
      pieceY + pieceHeight / 2,
      28,
      pieceHeight / 2.2,
      0,
      0,
      Math.PI * 2
    );

    mCtx.fill();

    mCtx.strokeStyle = "#fecaca";
    mCtx.stroke();
  }

  /* CÁMARA Y LÁSER */
  const camX = 155;
  const camY = 97;

  mCtx.fillStyle = "#0284c7";
  mCtx.fillRect(camX - 24, camY, 48, 30);

  mCtx.strokeStyle = "#38bdf8";
  mCtx.strokeRect(camX - 24, camY, 48, 30);

  mCtx.fillStyle = "#0f172a";

  mCtx.beginPath();
  mCtx.arc(camX, camY + 30, 9, 0, Math.PI * 2);
  mCtx.fill();
  mCtx.stroke();

  laserScanAngle += 0.05;

  const scanOffset = Math.sin(laserScanAngle) * 35;

  const gradVision = mCtx.createLinearGradient(
    camX,
    camY + 35,
    pieceX + 80,
    pieceY
  );

  gradVision.addColorStop(0, "rgba(56, 189, 248, 0.45)");
  gradVision.addColorStop(1, "rgba(56, 189, 248, 0.03)");

  mCtx.fillStyle = gradVision;

  mCtx.beginPath();
  mCtx.moveTo(camX, camY + 34);
  mCtx.lineTo(pieceX + 10, pieceY);
  mCtx.lineTo(pieceX + 125 + scanOffset, pieceY);
  mCtx.closePath();
  mCtx.fill();

  mCtx.strokeStyle = "#38bdf8";
  mCtx.setLineDash([4, 4]);

  mCtx.beginPath();
  mCtx.moveTo(camX, camY + 34);
  mCtx.lineTo(pieceX + 70 + scanOffset, pieceY);
  mCtx.stroke();

  mCtx.setLineDash([]);

  mCtx.fillStyle = "#38bdf8";
  mCtx.font = "bold 11px Consolas, monospace";

  mCtx.fillText(
    `📷 VISIÓN: ${mat.name.toUpperCase()} (${mat.thickness}mm)`,
    112,
    42
  );

  /* MOVIMIENTO DEL HUSILLO */
  const speedPx = (liveFeed / 12) * 1.45;

  carriageX += carriageDir * speedPx;

  if (carriageX > pieceX + pieceW - 35) {
    carriageDir = -1;
  }

  if (carriageX < pieceX + 45) {
    carriageDir = 1;
  }

  const shakeX = knotActive
    ? (Math.random() - 0.5) * 4.2
    : (Math.random() - 0.5) * 0.8;

  const shakeY = knotActive
    ? (Math.random() - 0.5) * 3.5
    : 0;

  const headX = carriageX + shakeX;

  const toolTipTargetY = pieceY + 6;
  const headTopY = toolTipTargetY - 148 + shakeY;

  mCtx.fillStyle = "#334155";
  mCtx.fillRect(
    headX - 30,
    52,
    60,
    headTopY - 35
  );

  mCtx.strokeStyle = "#64748b";

  mCtx.strokeRect(
    headX - 30,
    52,
    60,
    headTopY - 35
  );

  mCtx.fillStyle = knotActive ? "#7f1d1d" : "#1e293b";
  mCtx.strokeStyle = knotActive ? "#ef4444" : "#38bdf8";
  mCtx.lineWidth = 2;

  mCtx.fillRect(headX - 26, headTopY, 52, 82);
  mCtx.strokeRect(headX - 26, headTopY, 52, 82);

  mCtx.fillStyle = knotActive ? "#ef4444" : "#22c55e";

  mCtx.beginPath();
  mCtx.arc(headX, headTopY + 18, 5, 0, Math.PI * 2);
  mCtx.fill();

  mCtx.fillStyle = "#f8fafc";
  mCtx.font = "bold 11px Segoe UI, sans-serif";

  mCtx.fillText(
    `${Math.round(liveRpm)} RPM`,
    headX + 34,
    headTopY + 25
  );

  mCtx.fillStyle = knotActive ? "#fbbf24" : "#4ade80";

  mCtx.fillText(
    `Avance: ${liveFeed.toFixed(1)} mm/s`,
    headX + 34,
    headTopY + 42
  );

  mCtx.fillStyle = "#f59e0b";

  mCtx.fillText(
    `Fuerza: ${liveCurrent.toFixed(2)} A`,
    headX + 34,
    headTopY + 59
  );

  mCtx.fillStyle = "#94a3b8";
  mCtx.fillRect(headX - 10, headTopY + 82, 20, 18);

  /* BROCA GIRANDO */
  spindlePhase += (liveRpm / 1000) * 0.35;

  const bitTop = headTopY + 100;
  const bitHeight = 48;

  mCtx.fillStyle = "#cbd5e1";

  mCtx.beginPath();
  mCtx.moveTo(headX - 6, bitTop);
  mCtx.lineTo(headX + 6, bitTop);
  mCtx.lineTo(headX + 3, bitTop + bitHeight);
  mCtx.lineTo(headX - 3, bitTop + bitHeight);
  mCtx.closePath();
  mCtx.fill();

  mCtx.strokeStyle = "#0f172a";
  mCtx.lineWidth = 2;

  for (let i = 0; i < 4; i++) {

    const yStripe =
      bitTop + ((i * 12 + (spindlePhase * 8) % 12) % bitHeight);

    mCtx.beginPath();
    mCtx.moveTo(headX - 5, yStripe);
    mCtx.lineTo(headX + 5, yStripe + 5);
    mCtx.stroke();
  }

  mCtx.fillStyle = knotActive ? "#ef4444" : "#38bdf8";

  mCtx.beginPath();

  mCtx.arc(
    headX,
    toolTipTargetY,
    knotActive ? 6 : 4,
    0,
    Math.PI * 2
  );

  mCtx.fill();

  /* VIRUTAS */
  if (Math.random() < 0.75) {

    chips.push({
      x: headX,
      y: toolTipTargetY - 2,
      vx: (Math.random() - 0.5) * 5,
      vy: -Math.random() * 4 - 1,
      color: knotActive ? "#f87171" : mat.chipColor,
      life: 26
    });
  }

  for (let i = chips.length - 1; i >= 0; i--) {

    const p = chips[i];

    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.25;
    p.life--;

    mCtx.fillStyle = p.color;
    mCtx.fillRect(p.x, p.y, 3.5, 3.5);

    if (p.life <= 0 || p.y > bedY) {
      chips.splice(i, 1);
    }
  }

  /* INFORMACIÓN DE LA PIEZA */
  mCtx.fillStyle = "#94a3b8";
  mCtx.font = "11px Segoe UI, sans-serif";

  mCtx.fillText(
    `Pieza activa: ${mat.name} | Grosor medido: ${mat.thickness} mm | Dureza: ${mat.hardness}`,
    18,
    378
  );

  requestAnimationFrame(animateMachine);
}

/* DIBUJAR OSCILOSCOPIO */
function drawScope() {

  const w = sCanvas.width;
  const h = sCanvas.height;

  sCtx.clearRect(0, 0, w, h);

  /* CUADRÍCULA */
  sCtx.strokeStyle = "#1e293b";
  sCtx.lineWidth = 1;

  for (let y = 20; y < h; y += 25) {

    sCtx.beginPath();
    sCtx.moveTo(0, y);
    sCtx.lineTo(w, y);
    sCtx.stroke();
  }

  const stepX = w / (histFeed.length - 1);

  /* LÍNEA VERDE: AVANCE */
  sCtx.strokeStyle = "#22c55e";
  sCtx.lineWidth = 2.5;

  sCtx.beginPath();

  histFeed.forEach((val, i) => {

    const x = i * stepX;
    const y = h - (val / 15) * (h - 16) - 8;

    if (i === 0) {
      sCtx.moveTo(x, y);
    } else {
      sCtx.lineTo(x, y);
    }
  });

  sCtx.stroke();

  /* LÍNEA AMARILLA: ESFUERZO */
  sCtx.strokeStyle = "#f59e0b";
  sCtx.lineWidth = 2.5;

  sCtx.beginPath();

  histLoad.forEach((val, i) => {

    const x = i * stepX;
    const y = h - (val / 18) * (h - 16) - 8;

    if (i === 0) {
      sCtx.moveTo(x, y);
    } else {
      sCtx.lineTo(x, y);
    }
  });

  sCtx.stroke();
}

/* INICIAR ANIMACIÓN */
animateMachine();