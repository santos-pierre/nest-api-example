import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SeedService } from './seed/seed.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly seeService: SeedService,
  ) {}

  @Get('seed/run')
  async seed() {
    await this.seeService.seedUser();
  }
}
