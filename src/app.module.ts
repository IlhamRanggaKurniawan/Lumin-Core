import { Module } from '@nestjs/common';
import { WebhookModule } from './webhook/webhook.module';
import { EventsModule } from './events/events.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [WebhookModule, EventsModule, PrismaModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule { }
