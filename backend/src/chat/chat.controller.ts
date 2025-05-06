import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SessionGuard } from '../session/guards/validate-session.guard';
import { Request } from 'express';

@Controller('chat')
@UseGuards(SessionGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  async sendMessage(
    @Req() request: Request,
    @Body() body: { message: string },
  ) {
    const response = await this.chatService.sendMessage(
      request['sessionToken'],
      body.message,
    );
    return { response };
  }

  @Get('message')
  async getMessage(@Req() request: Request) {
    const response = await this.chatService.getMessage(request['sessionToken']);
    return { response };
  }
}
