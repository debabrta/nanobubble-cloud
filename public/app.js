function startSystem() {
  fetch('/start?t=' + Date.now());
}

function stopSystem() {
  fetch('/stop?t=' + Date.now());
}

setInterval(() => {
  fetch('/status?t=' + Date.now())
    .then(response => response.json())
    .then(data => {
      
      // ---> NEW: This will print the exact relay data in your screenshot's console!
      console.log("Live ESP32 Data:", data); 

      for(let i = 0; i < 8; i++) {
        const box = document.getElementById('r' + i);
        if(data['relay' + i] === true) {
          box.innerText = 'Relay ' + (i + 1) + ': ON';
          box.style.backgroundColor = '#27ae60';
        } else {
          box.innerText = 'Relay ' + (i + 1) + ': OFF';
          box.style.backgroundColor = '#95a5a6';
        }
      }
    })
    .catch(error => console.log("Network error waiting for status"));
}, 200);