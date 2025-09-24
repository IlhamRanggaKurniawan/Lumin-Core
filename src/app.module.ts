import { Module } from '@nestjs/common';
import { WebhookModule } from './webhook/webhook.module';
import { EventsModule } from './events/events.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { TransactionModule } from './transaction/transaction.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [WebhookModule, EventsModule, PrismaModule, UserModule, TransactionModule, TokenModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule { }
