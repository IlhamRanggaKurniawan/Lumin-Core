import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { EventsModule } from 'src/events/events.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [EventsModule, HttpModule, ConfigModule],
  controllers: [WebhookController],
  providers: [WebhookService]
})
export class WebhookModule {}
