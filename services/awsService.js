const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const bedrockClient = new BedrockRuntimeClient({
  region: "us-east-1", // Change to your region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

async function generateText(prompt) {
  const input = {
    modelId: "meta.llama3-8b-instruct-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      prompt: prompt,
      max_gen_len: 300,   // same as maxTokenCount in Nova
      temperature: 0.7,
      top_p: 0.9
    })
  };

  const command = new InvokeModelCommand(input);
  const response = await bedrockClient.send(command);

  const decoded = new TextDecoder().decode(response.body);
  let responseBody;
  try {
    responseBody = JSON.parse(decoded);
  } catch (e) {
    console.error("Llama 3 returned non-JSON:", decoded);
    throw new Error("Malformed response from Llama 3");
  }

  console.log("Llama 3 raw response:", JSON.stringify(responseBody, null, 2));

  // ✅ Correct parsing for Llama 3
  if (responseBody.generation) {
    return responseBody.generation;
  }

  throw new Error("No generation returned from Llama 3");
}

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Upload buffer to S3 and return public URL
async function uploadToS3(buffer, key, contentType = "image/png") {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: "public-read"
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  return `https://${params.Bucket}.s3.amazonaws.com/${key}`;
}

// Generate image using Titan Image Generator G1
async function generateImage(prompt) {
  const input = {
    modelId: "amazon.titan-image-generator-g1:latest",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      prompt: prompt,
      width: 512,
      height: 512,
      quality: "high"
    })
  };

  const command = new InvokeModelCommand(input);
  const response = await bedrockClient.send(command);

  const decoded = new TextDecoder().decode(response.body);
  let responseBody;
  try {
    responseBody = JSON.parse(decoded);
  } catch (e) {
    console.error("Titan returned non-JSON:", decoded);
    throw new Error("Malformed response from Titan Image Generator");
  }

  if (responseBody.artifacts && responseBody.artifacts[0] && responseBody.artifacts[0].base64) {
    return Buffer.from(responseBody.artifacts[0].base64, "base64");
  }

  throw new Error("No image returned from Titan");
}


function extractKeywords(text) {
  // Remove punctuation, split by spaces, filter out short/common words
  const stopWords = ['the', 'and', 'for', 'with', 'a', 'an', 'of', 'to', 'in', 'on', 'at', 'by', 'is', 'it', 'this', 'that'];
  return text
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .split(/\s+/)
    .map(word => word.toLowerCase())
    .filter(word => word.length > 3 && !stopWords.includes(word));
}

module.exports = {
  generateText,
  generateImage,
  extractKeywords,
  uploadToS3
}

async function main() {
  const prompt = process.argv.slice(2).join(" ");
  if (!prompt) {
    console.log("Usage: node generateImageCLI.js <your prompt>");
    return;
  }

  try {
    console.log("Generating image for prompt:", prompt);
    const imageBuffer = await generateImage(prompt);

    // Quick check if image was actually generated
    if (!imageBuffer || imageBuffer.length === 0) {
      console.error("❌ Image generation failed: no data returned from Titan.");
      return;
    }

    console.log("✅ Image generated successfully! Buffer size:", imageBuffer.length);

    const key = `cli-images/${Date.now()}.png`;
    const url = await uploadToS3(imageBuffer, key);

    console.log("✅ Image uploaded successfully!");
    console.log("S3 URL:", url);
  } catch (err) {
    console.error("❌ Failed to generate/upload image:", err.message);
  }
}

main();
