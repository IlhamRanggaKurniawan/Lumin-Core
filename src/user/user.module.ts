import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TransactionModule } from 'src/transaction/transaction.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TransactionModule, PrismaModule, HttpModule],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule { }
