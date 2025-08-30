// --- load/save guardian number ---
const guardianInput = document.getElementById('guardian');
const saveBtn = document.getElementById('saveGuardian');
const savedMsg = document.getElementById('savedMsg');
const waBtn = document.getElementById('waBtn');
const smsBtn = document.getElementById('smsBtn');

(function init() {
  const saved = localStorage.getItem('guardian');
  if (saved) {
    guardianInput.value = saved;
    savedMsg.textContent = `Saved: ${saved}`;
  }
})();

saveBtn.addEventListener('click', () => {
  const val = guardianInput.value.trim();
  if (!val) return;
  localStorage.setItem('guardian', val);
  savedMsg.textContent = `Saved: ${val}`;
});

// --- helper: build SOS text with location ---
function getSosText(coords) {
  const now = new Date().toLocaleString();
  let txt = `EMERGENCY! I need help. Time: ${now}.`;
  if (coords) {
    const { latitude, longitude } = coords;
    const map = `https://maps.google.com/?q=${latitude},${longitude}`;
    txt += ` My location: ${map}`;
  }
  return txt;
}

// --- geolocation wrapper ---
function getLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      pos => resolve(pos.coords),
      () => resolve(null), // permission denied or error
      { enableHighAccuracy: true, timeout: 5000 }
    );
  });
}

// --- WhatsApp share ---
waBtn.addEventListener('click', async () => {
  const guardian = (guardianInput.value || '').trim();
  if (!guardian) return alert('Please save guardian number first.');
  const coords = await getLocation();
  const text = getSosText(coords);
  const url = `https://wa.me/${encodeURIComponent(guardian)}?text=${encodeURIComponent(text)}`;
  window.location.href = url;
});

// --- SMS share ---
smsBtn.addEventListener('click', async () => {
  const guardian = (guardianInput.value || '').trim();
  if (!guardian) return alert('Please save guardian number first.');
  const coords = await getLocation();
  const text = getSosText(coords);
  const smsUrl = `sms:${encodeURIComponent(guardian)}?&body=${encodeURIComponent(text)}`;
  window.location.href = smsUrl;
});

// --- fake call overlay ---
const overlay = document.getElementById('overlay');
const fakeCallBtn = document.getElementById('fakeCallBtn');

fakeCallBtn.addEventListener('click', () => {
  overlay.style.display = "flex";   // show overlay
  if (navigator.vibrate) navigator.vibrate([200,100,200,100,200]);

  // auto close after 8 seconds
  setTimeout(() => {
    overlay.style.display = "none";
  }, 8000);
});

// close overlay when Decline clicked
document.getElementById('decline').addEventListener('click', () => {
  overlay.style.display = "none";
});

// close overlay when Accept clicked
document.getElementById('accept').addEventListener('click', () => {
  overlay.style.display = "none";
  alert("Call Connected");
});

// close overlay if user clicks outside box
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) {
    overlay.style.display = "none";
  }
});
