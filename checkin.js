const API_BASE = "http://localhost:8000";

const loadCheckIns = async () => {
  const response = await fetch(`${API_BASE}/api/checkins`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json();
};

const submitCheckIn = async (payload) => {
  const response = await fetch(`${API_BASE}/api/checkins`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json();
};

const form = document.querySelector('#form');
const list = document.querySelector('#list');
const msg  = document.querySelector('#msg');

const render = async () => {
  try {
    const items = await loadCheckIns();
    list.innerHTML = "";
    items.forEach(c => {
      const li = document.createElement('li');
      li.textContent = `${c.name} | Sleep ${c.sleep}h | Water ${c.water} | Steps ${c.steps.toLocaleString()} | ${c.hit_goal ? "HIT" : "MISS"}`;
      list.appendChild(li);
    });
  } catch (err) {
    msg.textContent = "Could not reach the API: " + err.message;
  }
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    name:  document.querySelector('#name').value.trim(),
    sleep: parseFloat(document.querySelector('#sleep').value),
    water: parseInt(document.querySelector('#water').value),
    steps: parseInt(document.querySelector('#steps').value)
  };

  if (!payload.name || isNaN(payload.sleep) || isNaN(payload.water) || isNaN(payload.steps)) {
    msg.textContent = "All fields are required.";
    return;
  }

  try {
    await submitCheckIn(payload);
    msg.textContent = "Saved.";
    form.reset();
    render();
  } catch (err) {
    msg.textContent = "Error: " + err.message;
  }
});

render();