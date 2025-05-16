const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('./login/auth');
const appointmentRoutes = require("./routes/appointments");
const twilio = require('twilio');

// ✅ Load environment variables
dotenv.config();

// ✅ Twilio credentials
const accountSid = 'AC939b5e7ccc4b79b9a3f26831c9677ed9';
const authToken = 'ffeba072a60602d38ac3c6f649ca6bac';
const twilioNumber = '+19163142654';

const client = twilio(accountSid, authToken);

// ✅ Express & Socket.IO setup
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/appointments", appointmentRoutes);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Memory store for active calls
const activeCalls = {};

// ✅ Socket.IO events
io.on('connection', (socket) => {
  console.log('🟢 Socket connected:', socket.id);

  socket.on('startCall', ({ to, callSid }) => {
    activeCalls[to] = callSid;
    io.emit('callStatus', { to, status: 'Initiated by user' });
  });

  socket.on('hangup', ({ to }) => {
    io.emit('callEnded', { to });
  });

  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id);
  });
});

// ✅ Login API
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback-secret');
    res.json({ token, user });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// ✅ Twilio Call API
app.post('/api/call', async (req, res) => {
  const { to } = req.body;

  try {
    const call = await client.calls.create({
      url: 'http://demo.twilio.com/docs/voice.xml',
      to,
      from: twilioNumber,
      statusCallback: 'http://localhost:5000/twilio/status-callback',
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST',
    });

    console.log('📞 [CALL INITIATED]', call.sid);
    res.status(200).json({ message: 'Call initiated', sid: call.sid });
  } catch (err) {
    console.error('❌ Call error:', err.message);
    res.status(500).json({ message: 'Call failed', error: err.message });
  }
});

// ✅ Twilio Call Status Webhook
app.post('/twilio/status-callback', (req, res) => {
  const { CallSid, CallStatus, To, From } = req.body;

  console.log('🔁 [CALL STATUS]', CallSid, CallStatus);
  io.emit('callStatus', { sid: CallSid, status: CallStatus, to: To, from: From });

  if (CallStatus === 'completed') {
    delete activeCalls[To];
    io.emit('callEnded', { to: To });
  }

  res.status(200).send('OK');
});

// ✅ Optional Hangup API (Trial mode limitation)
app.post('/api/hangup', async (req, res) => {
  return res.status(403).json({ error: 'Manual hangup not supported in Twilio trial mode' });

  // Uncomment if using paid Twilio account:
  // const { sid } = req.body;
  // await client.calls(sid).update({ status: 'completed' });
  // res.status(200).json({ message: 'Call ended' });
});

// ✅ Fixed Send SMS API

app.post('/send-sms', async (req, res) => {
  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ error: 'Phone and message are required' });
  }

  try {
    const msg = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: phone,
    });

    console.log('SMS sent:', msg.sid);
    res.json({ success: true });
  } catch (error) {
    console.error('Twilio Error:', error.message);
    res.status(500).json({ error: 'Failed to send SMS', details: error.message });
  }
});
// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
