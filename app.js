// 1. Connect to HiveMQ using Secure WebSockets (port 8884)
const brokerUrl = 'wss://2dba5a80f0db4d72b9fe44869b246a84.s1.eu.hivemq.cloud:8884/mqtt';
const options = {
  username: 'web_dashboard',
  password: 'Ferum7205162469engennering', // <--- INSERT NEW RESTRICTED PASSWORD
  clientId: 'WebUI_' + Math.random().toString(16).substring(2, 8)
};

const client = mqtt.connect(brokerUrl, options);

// 2. Handle Connection and Subscribe
client.on('connect', () => {
  console.log('✅ Connected directly to HiveMQ via WebSockets!');
  client.subscribe('nanobubble/status', (err) => {
    if (!err) console.log('📡 Listening for hardware updates...');
  });
});

// 3. Process Live Data from the ESP32
client.on('message', (topic, message) => {
  if (topic === 'nanobubble/status') {
    try {
      const data = JSON.parse(message.toString());
      console.log("Live ESP32 Data:", data);

      for (let i = 0; i < 8; i++) {
        const box = document.getElementById('r' + i);
        if (data['relay' + i] === true) {
          box.innerText = 'Relay ' + (i + 1) + ': ON';
          box.style.backgroundColor = '#27ae60';
        } else {
          box.innerText = 'Relay ' + (i + 1) + ': OFF';
          box.style.backgroundColor = '#95a5a6';
        }
      }
    } catch (e) {
      console.log("Error parsing MQTT data");
    }
  }
});

// 4. Publish Commands (Replaces old fetch calls)
function startSystem() {
  if (client.connected) {
    client.publish('nanobubble/commands', 'START');
    console.log("☁️ Sent START directly to HiveMQ");
  }
}

function stopSystem() {
  if (client.connected) {
    client.publish('nanobubble/commands', 'STOP');
    console.log("☁️ Sent STOP directly to HiveMQ");
  }
}