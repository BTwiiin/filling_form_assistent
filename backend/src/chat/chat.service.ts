import { Injectable, NotFoundException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';
import { chatResponseSchema, guidingQuestions } from './schemas/chat.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';


@Injectable()
export class ChatService {
  private readonly ai: GoogleGenAI;
  private readonly systemInstruction = `
    You are a helpful assistant for filling out a helpdesk form. 
    Your task is to help users provide the following information:
    - Firstname
    - Lastname
    - Email
    - Reason for contact
    - Urgency level (From 1 to 10)

    Guide the user through providing this information in a friendly and professional manner.
    If any information is missing or unclear, use these guiding questions to ask for clarification

    Once all information is collected, format it as JSON.
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
    
    // Update chat history
    chat.history.push(
      { role: 'user', parts: [{ text: message }] },
      { role: 'model', parts: [{ text: JSON.stringify(parsedResponse.message) }] },
    );

    // Update chat state based on response
    if (parsedResponse.status === 'complete') {
      chat.isComplete = true;
      chat.formData = parsedResponse.formData;
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
    const chat = await this.getChat(tokenId);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    return chat.history;
  }
}
