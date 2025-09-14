require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const donorsRoute = require('./routes/donors');
const requestsRoute = require('./routes/requests');
const { router: authRoute } = require('./routes/auth');
const kycRoute = require('./routes/kyc');
const statsRoute = require('./routes/stats');

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));
app.use(express.json());
app.use(express.static('uploads')); // Serve uploaded files

const PORT = process.env.PORT || 5000;

(async function start(){
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('MongoDB connected');
    app.use('/api/auth', authRoute);
    app.use('/api/donors', donorsRoute);
    app.use('/api/requests', requestsRoute);
    app.use('/api/kyc', kycRoute);
    app.use('/api/stats', statsRoute);

    app.get('/', (req,res)=> res.send('Blood Donor API running'));

    app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();
