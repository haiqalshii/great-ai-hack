// Mock database service for testing
let campaigns = [];

async function initDB() {
  console.log('Mock database initialized');
}

async function saveCampaignToDB(campaign) {
  campaigns.push({
    ...campaign,
    created_at: new Date().toISOString()
  });
  return campaign;
}

async function getCampaignsFromDB() {
  return campaigns;
}

// Initialize database on startup
initDB().catch(console.error);

module.exports = {
  saveCampaignToDB,
  getCampaignsFromDB
};