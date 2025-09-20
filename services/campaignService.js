const { generateText, generateImage, extractKeywords, uploadToS3 } = require('./awsService');
const { saveCampaignToDB, getCampaignsFromDB } = require('./dbService');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

async function generateCampaign(description, imagePath) {
  // Generate enhanced campaign content
  const prompt = `Create a marketing campaign for: ${description}. 
  Generate:
  1. A compelling caption (max 150 words)
  2. 5 relevant hashtags
  3. A detailed image description for product visualization
  
  Format as JSON: {"caption": "", "hashtags": [], "imagePrompt": ""}`;
  
  const aiResponse = await generateText(prompt);
  const campaign = JSON.parse(aiResponse);
  console.log('Bedrock AI Response:', aiResponse);
  
  // Extract keywords from description
  const keywords = await extractKeywords(description);
  
  // Generate product image (mock)
  // Generate product image
  const imageBuffer = await generateImage(campaign.imagePrompt);
  const key = `campaign-images/${Date.now()}.png`;
  const imageUrl = await uploadToS3(imageBuffer, key);

  
  return {
    id: uuidv4(),
    description,
    caption: campaign.caption,
    hashtags: campaign.hashtags,
    keywords,
    imageUrl,
    createdAt: new Date()
  };
}

async function saveCampaign(campaignData) {
  return await saveCampaignToDB(campaignData);
}

async function getCampaigns() {
  return await getCampaignsFromDB();
}

module.exports = {
  generateCampaign,
  saveCampaign,
  getCampaigns
};