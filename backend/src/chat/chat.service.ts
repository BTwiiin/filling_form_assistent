import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';
import { chatResponseSchema, guidingQuestions } from './schemas/chat.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';


@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly ai: GoogleGenAI;
  private readonly systemInstruction = `
    You are a helpful and professional assistant designed to guide users in filling out a helpdesk form.

    Your goal is to collect the following five pieces of information from the user:
    1. First name (string, max 20 characters)
    2. Last name (string, max 20 characters)
    3. Email (string, must be in valid email format)
    4. Reason for contact (string, max 100 characters)
    5. Urgency level (integer, from 1 to 10)

    Instructions:
    - Greet the user in a friendly and professional tone.
    - Do not insist on the user to fill out the form, just guide them.
    - If any information is missing, unclear, or seems invalid (e.g., malformed email),
      ask a guiding follow-up question to clarify.
    - For the "Reason for contact", if the user gives a vague or generic answer 
      (e.g., "issue" or "problem"), politely ask for more specific details. If the user
      resists or avoids elaborating, accept the vague response without insisting.
    - For "Urgency level", explain the scale briefly if the user asks or seems unsure.
    - After each valid response, include the collected information in the formData object,
      even if the form is not complete yet.
    - Only set status to "complete" when all required fields are filled.
    - Always include missingFields array with the names of fields that still need to be collected.
    `;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {
    this.ai = new GoogleGenAI({
      apiKey: this.configService.get<string>('GEMINI_API_KEY'),
    });
  }

  async createChat(tokenId: string) {
    const chat = this.chatRepository.create({
      sessionId: tokenId,
      history: [],
      isComplete: false,
    });
    await this.chatRepository.save(chat);
    return chat;
  }


  async sendMessage(tokenId: string, message: string) {
    let chat = await this.getChat(tokenId);

    if (!chat) {
      chat = await this.createChat(tokenId);
    }

    // Create Gemini chat instance with history
    const geminiChat = this.ai.chats.create({
      model: 'gemini-2.0-flash',
      history: chat.history,
      config: {
        systemInstruction: this.systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: chatResponseSchema,
      },
    });

    // Send message and get response
    const response = await geminiChat.sendMessage({
      message,
    });

    // Parse the response according to our schema
    const parsedResponse = JSON.parse(response.text || '{}');
    
    // Log the response data
    this.logger.debug('AI Response:', {
      message: parsedResponse.message,
      status: parsedResponse.status,
      formData: parsedResponse.formData,
      missingFields: parsedResponse.missingFields
    });
    
    // Update chat history
    chat.history.push(
      { role: 'user', parts: [{ text: message }] },
      { role: 'model', parts: [{ text: JSON.stringify(parsedResponse.message) }] },
    );

    // Update chat state based on response
    if (parsedResponse.formData) {
      chat.formData = {
        ...chat.formData,
        ...parsedResponse.formData
      };
    }

    if (parsedResponse.status === 'complete') {
      chat.isComplete = true;
      this.logger.log('Form completed:', {
        sessionId: tokenId,
        formData: chat.formData
      });
    }

    // Save updated chat
    await this.chatRepository.save(chat);

    // Return the parsed response
    return parsedResponse;
  }

  private async getChat(tokenId: string) {
    return this.chatRepository.findOne({ where: { sessionId: tokenId } });
  }

  async getMessage(tokenId: string) {
    console.log('Getting message for tokenId:', tokenId);
    const chat = await this.getChat(tokenId);
    if (!chat) {
      return [];
    }

    return { 
      history: chat.history,
      formData: chat.formData,
    };
  }
}
