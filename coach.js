// === Prediction engine ===
const predictGoal = (sleep, water, steps) => {
  const sleepScore = Math.min(sleep / 8.0, 1.0) * 35;
  const waterScore = Math.min(water / 10.0, 1.0) * 25;
  const stepsScore = Math.min(steps / 12000, 1.0) * 40;
  const totalScore = sleepScore + waterScore + stepsScore;
  const hitGoal    = totalScore >= 60;
  const distance   = Math.abs(totalScore - 60);
  const confidence = Math.min(0.50 + distance * 0.012, 0.95);
  return { hitGoal, confidence, score: Math.round(totalScore) };
};

// === Coaching templates ===
const COACHING = {
  "111": ["Strong inputs, strong output. Baseline is locked in.", "Keep this pattern consistent."],
  "110": ["Hit the goal despite low water. Sleep is the primary driver.", "Close the hydration gap tomorrow."],
  "101": ["Water carried today despite low sleep.", "Fix sleep tonight. Low sleep has hidden costs."],
  "100": ["Goal hit through willpower, not system. Willpower runs out.", "Fix the foundation: sleep first, water second."],
  "011": ["Inputs were solid but the goal was missed.", "Audit your schedule. Do not cut sleep or water."],
  "010": ["Sleep is solid but hydration is low, and the goal was missed.", "Add two glasses of water tomorrow."],
  "001": ["Low sleep is the lead variable. Water is fine.", "Get to bed 45 minutes earlier tonight."],
  "000": ["Both inputs are below threshold and the goal was missed.", "Reset tonight: 8 hours sleep minimum, 10 glasses water."],
};

const getCoaching = (sleep, water, hitGoal) => {
  const key = `${hitGoal ? 1 : 0}${sleep >= 7 ? 1 : 0}${water >= 8 ? 1 : 0}`;
  return COACHING[key].join(" ");
};

// === Wire the live form ===
const form    = document.querySelector('#coachForm');
const display = document.querySelector('#coachDisplay');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const sleep = parseFloat(document.querySelector('#inSleep').value);
  const water = parseInt(document.querySelector('#inWater').value);
  const steps = parseInt(document.querySelector('#inSteps').value);

  if (isNaN(sleep) || isNaN(water) || isNaN(steps)) {
    display.className = 'ai-response idle';
    display.innerHTML = '<div class="label-sm">Error</div><div class="coaching">All three fields are required.</div>';
    return;
  }

  const result   = predictGoal(sleep, water, steps);
  const coaching = getCoaching(sleep, water, result.hitGoal);
  const outcome  = result.hitGoal ? "HIT GOAL" : "MISS GOAL";
  const confPct  = (result.confidence * 100).toFixed(0);

  display.className = `ai-response ${result.hitGoal ? "hit" : "miss"}`;
  display.innerHTML = `
    <div class="label-sm">Prediction</div>
    <div class="prediction">${outcome}   (${confPct}% confidence • score: ${result.score}/100)</div>
    <div class="label-sm" style="margin-top:0.8rem;">Coaching</div>
    <div class="coaching">${coaching}</div>
  `;

  console.log(`Submitted: sleep=${sleep}h water=${water}gl steps=${steps.toLocaleString()}`);
  console.log(`Result: ${outcome} | ${confPct}% confidence | score ${result.score}`);
});

console.log("Form wired. Use the SMP Coach tool below.");
