// Session store (lives in memory for this page session)
const sessionLog = [];

const logEntry = (sleep, water, steps, hitGoal, confidence, score) => {
  const entry = {
    id:   sessionLog.length + 1,
    time: new Date().toLocaleTimeString(),
    sleep, water, steps, hitGoal, confidence, score
  };
  sessionLog.push(entry);
  return entry;
};

const renderHistory = () => {
  const tableEl = document.querySelector('#historyTable');
  if (!sessionLog.length) {
    tableEl.innerHTML = '<tr><td colspan="6" style="color:#8b949e;text-align:center;padding:1rem;">No entries yet.</td></tr>';
    return;
  }
  tableEl.innerHTML = sessionLog.map(e => {
    const outcomeColor = e.hitGoal ? "#4ecca3" : "#f5a623";
    const outcome = e.hitGoal ? "HIT" : "MISS";
    return `<tr>
      <td style="color:#8b949e;font-size:0.8rem;">${e.time}</td>
      <td>${e.sleep}h</td>
      <td>${e.water} gl</td>
      <td>${e.steps.toLocaleString()}</td>
      <td style="color:${outcomeColor};font-weight:700;">${outcome}</td>
      <td style="color:#a0a0b0;">${(e.confidence * 100).toFixed(0)}%</td>
    </tr>`;
  }).join('');
};

// predictGoal comes from coach.js, which loads first

const form2 = document.querySelector('#coachForm2');
form2.addEventListener('submit', (event) => {
  event.preventDefault();
  const sleep = parseFloat(document.querySelector('#h_sleep').value);
  const water = parseInt(document.querySelector('#h_water').value);
  const steps = parseInt(document.querySelector('#h_steps').value);

  if (isNaN(sleep) || isNaN(water) || isNaN(steps)) return;

  const result = predictGoal(sleep, water, steps);
  const entry  = logEntry(sleep, water, steps, result.hitGoal, result.confidence, result.score);

  renderHistory();

  const hitRate = sessionLog.filter(e => e.hitGoal).length / sessionLog.length;
  console.log(`Entry #${entry.id} logged: ${result.hitGoal ? "HIT" : "MISS"} | score ${result.score}`);
  console.log(`Hit rate so far: ${(hitRate * 100).toFixed(0)}%`);

  form2.reset();
});

renderHistory();
console.log("History form wired. Submit entries using the form below.");