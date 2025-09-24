import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [PrismaModule, ConfigModule, HttpModule, TokenModule],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule { }
