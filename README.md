# Nebula.AI - AI-Powered Content Generation Platform

An MVP web application for Malaysian SMEs to generate AI-powered marketing campaigns using AWS services.

## Features
- 🎯 AI-generated captions and hashtags using Amazon Bedrock
- 🎨 Product image generation with Stable Diffusion
- 📊 Keyword analysis with AWS Comprehend
- 🎵 Optional voiceover with Amazon Polly
- ☁️ Media storage with Amazon S3
- 📱 Instagram/TikTok style preview

## Tech Stack
- **Frontend**: React
- **Backend**: Express.js
- **AI**: Amazon Bedrock (Claude + Stable Diffusion)
- **NLP**: AWS Comprehend
- **Voice**: Amazon Polly
- **Storage**: Amazon S3
- **Database**: MySQL

## Setup Instructions

### Prerequisites
1. AWS Account with Bedrock access
2. MySQL database
3. Node.js 16+

### Installation

1. **Install dependencies**:
```bash
npm install
cd client && npm install
```

2. **Configure environment**:
Update `.env` with your AWS credentials and database config.

3. **Setup MySQL database**:
Create a database named `nebula_ai`. Tables will be created automatically.

4. **Configure AWS**:
- Enable Bedrock models in your AWS region
- Create S3 bucket named `nebula-ai-bucket`
- Set up IAM permissions for Bedrock, Comprehend, Polly, S3

5. **Run the application**:
```bash
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:5000

## API Endpoints

- `POST /api/campaigns/generate` - Generate new campaign
- `POST /api/campaigns/save` - Save campaign to database
- `GET /api/campaigns` - Fetch campaign history

## AWS Services Configuration

### Required AWS Services:
- Amazon Bedrock (Claude 3 Sonnet, Stable Diffusion XL)
- AWS Comprehend
- Amazon Polly
- Amazon S3

### IAM Permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "comprehend:DetectKeyPhrases",
        "polly:SynthesizeSpeech",
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "*"
    }
  ]
}
```

## Usage

1. Navigate to "Create Campaign"
2. Describe your product/campaign goal
3. Optionally upload a reference image
4. Click "Generate Campaign"
5. Review the AI-generated content in Instagram-style preview
6. Save the campaign to your history

## Next Steps for Production

1. **Authentication**: Implement AWS Cognito
2. **API Gateway**: Set up AWS API Gateway + Lambda
3. **Deployment**: Use AWS Amplify for frontend, ECS/Lambda for backend
4. **Database**: Migrate to Amazon DocumentDB or RDS
5. **Monitoring**: Add CloudWatch logging and metrics