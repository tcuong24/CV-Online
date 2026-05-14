import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CvAiService } from './cv-ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cv/ai')
export class CvAiController {
  constructor(private readonly cvAiService: CvAiService) {}

  @UseGuards(JwtAuthGuard)
  @Post('chat')
  async chat(
    @Body() body: {
      history: any[];
      currentCv: any;
      message: string;
      activeSection?: string;
      clarificationContext?: { pendingIntent: string; answeredQuestions: { id: string; answer: string }[] };
    },
  ) {
    const { history, currentCv, message, activeSection, clarificationContext } = body;
    const response = await this.cvAiService.chat(history, currentCv, message, activeSection, clarificationContext);
    return { response };
  }
}
