const express = require('express');
const mqtt = require('mqtt');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// 1. Serve your exact ESP32 frontend files
app.use(express.static(path.join(__dirname, 'public')));

// 2. HiveMQ Connection Setup
// Note the 'mqtts://' prefix for secure port 8883 connections
const MQTT_URL = 'mqtts://2dba5a80f0db4d72b9fe44869b246a84.s1.eu.hivemq.cloud:8883'; 
const MQTT_USERNAME = 'debabrata091'; 
const MQTT_PASSWORD = 'De73ba81br68at02a01'; // <--- INSERT YOUR PASSWORD 

const client = mqtt.connect(MQTT_URL, {
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    clientId: 'NodeJS_Backend_' + Math.random().toString(16).substring(2, 8)
});

// 3. Store the latest relay state from the MQTT broker
let latestStatus = {};

client.on('connect', () => {
    console.log('✅ Connected securely to HiveMQ Cloud');
    client.subscribe('nanobubble/status', (err) => {
        if (!err) console.log('📡 Listening for hardware updates on: nanobubble/status');
    });
});

client.on('message', (topic, message) => {
    if (topic === 'nanobubble/status') {
        try {
            latestStatus = JSON.parse(message.toString());
        } catch (e) {
            console.log("Error parsing MQTT data");
        }
    }
});

// 4. API Routes (These exactly match your ESP32 routes!)
app.get('/status', (req, res) => {
    res.json(latestStatus); 
});

app.get('/start', (req, res) => {
    client.publish('nanobubble/commands', 'START');
    console.log("Sent START command to HiveMQ");
    res.send("Started");
});

app.get('/stop', (req, res) => {
    client.publish('nanobubble/commands', 'STOP');
    console.log("Sent STOP command to HiveMQ");
    res.send("Stopped");
});

// 5. Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Global Dashboard running on http://localhost:${PORT}`);
});