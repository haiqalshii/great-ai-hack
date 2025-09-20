const express = require('express');
const multer = require('multer');
const { generateCampaign, saveCampaign, getCampaigns } = require('../services/campaignService');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/generate', upload.single('image'), async (req, res) => {
  try {
    const { description } = req.body;
    const imagePath = req.file?.path;
    
    const campaign = await generateCampaign(description, imagePath);
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/save', async (req, res) => {
  try {
    const campaign = await saveCampaign(req.body);
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const campaigns = await getCampaigns();
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;