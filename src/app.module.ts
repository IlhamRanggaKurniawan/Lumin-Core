import { Module } from '@nestjs/common';
import { WebhookModule } from './webhook/webhook.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [WebhookModule, EventsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
