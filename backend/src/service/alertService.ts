import { PrismaClient, HeliusResponse, User } from "prisma-shared";
import { LlmService } from "./llmService";
import { TelegramService } from "./telegramService";

const prisma = new PrismaClient();
const llmService = new LlmService();
const telegramService = new TelegramService();

interface SentimentAnalysisResult {
  sentiment: "positive" | "negative" | "neutral";
  confidence: number;
  recommendation: "buy" | "sell" | "hold";
  summary: string;
  keyPoints: string[];
}

export class AlertService {
  /**
   * Analyzes HeliusResponse records for a specific subscription and sends sentiment analysis via Telegram
   * @param subscriptionId The ID of the subscription to analyze
   */
  async analyzeSubscriptionSentiment(subscriptionId: number){
    try {
      // Get the subscription with user data
      const subscription = await prisma.subscription.findUnique({
        where: { id: subscriptionId },
        include: { user: true }
      });

      if (!subscription) {
        throw new Error(`Subscription with ID ${subscriptionId} not found`);
      }

      // Check if user has a Telegram ID
      if (!subscription.user.telegramId) {
        console.log(`User ${subscription.userId} does not have a Telegram ID configured`);
        return;
      }

      // Get HeliusResponse records for this subscription
      const responses = await prisma.heliusResponse.findMany({
        where: { subscriptionId },
        orderBy: { createdAt: 'desc' },
        take: 10 // Limit to most recent 10 responses
      });

      if (responses.length === 0) {
        console.log(`No HeliusResponse records found for subscription ${subscriptionId}`);
        return;
      }

      // Extract and combine response data for analysis
      const combinedData = this.prepareDataForAnalysis(responses);
      console.log('combinedData', combinedData);
      // Analyze the data using Gemini
      const sentiment = await this.analyzeSentiment(combinedData, subscription.name || "", subscription.address || "");
      console.log('sentiment', sentiment);
      // Send the analysis results via Telegram
      const response = await this.sendTelegramAlert(subscription.user, sentiment, subscription.name || "Your subscription");
      console.log(`Sentiment analysis completed for subscription ${subscriptionId}`);
      return { "success": true }; 

    } catch (error) {
      console.error(`Error analyzing sentiment for subscription ${subscriptionId}:`, error);
      throw error;
    }
  }

  /**
   * Prepares HeliusResponse data for sentiment analysis
   */
  private prepareDataForAnalysis(responses: HeliusResponse[]): string {
    // Combine all response data into a single string for analysis
    return responses.map(response => {
      try {
        // Try to parse the response as JSON to extract meaningful data
        const parsedResponse = JSON.parse(response.response);
        return JSON.stringify(parsedResponse[0].description, null, 2);
      } catch (e) {
        // If parsing fails, use the raw response
        return response.response;
      }
    }).join("\n\n");
  }

  /**
   * Analyzes the sentiment of transaction data using Gemini
   */
  private async analyzeSentiment(data: string,tokenName: string, tokenAddress: string): Promise<SentimentAnalysisResult> {
    const prompt = this.createSentimentAnalysisPrompt(data, tokenName ,tokenAddress);
    
    try {
      const response = await llmService.callLlm(prompt)

      const text = response;
      if (!response) {
        throw new Error("Empty response from Gemini");
      }

      // Extract JSON from the response
      const jsonStr = text.replace(/```json|```/g, '').trim();
      const result = JSON.parse(jsonStr) as SentimentAnalysisResult;
      
      return result;
    } catch (error) {
      console.error("Error analyzing sentiment with Gemini:", error);
      // Return a default neutral sentiment if analysis fails
      return {
        sentiment: "neutral",
        confidence: 0,
        recommendation: "hold",
        summary: "Unable to analyze sentiment due to an error.",
        keyPoints: ["Analysis failed", "Insufficient data"]
      };
    }
  }

  /**
   * Creates a prompt for sentiment analysis
   */
  private createSentimentAnalysisPrompt(data: string, tokenName: string , tokenAddress: string): string {
    return `
You are a cryptocurrency expert analyzing Solana blockchain transaction data for token ${tokenName} with ${tokenAddress}.
Please analyze the following transaction data and provide a sentiment analysis:

${data}

Based on this data, determine if the sentiment for this token is positive, negative, or neutral.
Consider factors like:
- Transaction volume and frequency
- Large buys or sells
- Wallet interactions
- Token transfers
- Smart contract interactions

Respond with a JSON object in this exact format:
\`\`\`json
{
  "sentiment": "positive|negative|neutral",
  "confidence": 0.85, // number between 0 and 1
  "recommendation": "buy|sell|hold",
  "summary": "A brief 1-2 sentence summary of your analysis",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"]
}
\`\`\`
`;
  }

  /**
   * Sends a Telegram alert with sentiment analysis results
   */
  private async sendTelegramAlert(user: User, sentiment: SentimentAnalysisResult, tokenName: string) {
    if (!user.telegramId) {
      return;
    }

    // Create a BLINK message with the sentiment analysis
    const emoji = sentiment.sentiment === "positive" ? "🟢" : sentiment.sentiment === "negative" ? "🔴" : "⚪";
    const actionEmoji = sentiment.recommendation === "buy" ? "💰" : sentiment.recommendation === "sell" ? "💸" : "⏳";
    
    const message = `
*BLINK: ${tokenName} Analysis* ${emoji}

*Sentiment:* ${sentiment.sentiment.toUpperCase()} (${Math.round(sentiment.confidence * 100)}% confidence)
*Recommendation:* ${sentiment.recommendation.toUpperCase()} ${actionEmoji}

*Summary:*
${sentiment.summary}

*Key Points:*
${sentiment.keyPoints.map(point => `• ${point}`).join('\n')}

_This is an automated analysis based on blockchain data._
`;

    // Send the message via Telegram
    const response = await telegramService.sendMessage(user.id.toString(), message, true);
    return response;
  }
}

