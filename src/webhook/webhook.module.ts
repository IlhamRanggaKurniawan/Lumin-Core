import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { EventsModule } from 'src/events/events.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenModule } from 'src/token/token.module';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports: [EventsModule, HttpModule, ConfigModule, PrismaModule, TokenModule, TransactionModule],
  controllers: [WebhookController],
  providers: [WebhookService]
})
export class WebhookModule { }
