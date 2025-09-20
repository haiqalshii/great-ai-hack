const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const campaignRoutes = require('./routes/campaigns');

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ CORS middleware — allow all necessary methods & headers
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ✅ Handle preflight OPTIONS requests
app.options('*', cors());

app.use(express.json());
app.use('/uploads', express.static('uploads'));

const upload = multer({ dest: 'uploads/' });

app.use('/api/campaigns', campaignRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
