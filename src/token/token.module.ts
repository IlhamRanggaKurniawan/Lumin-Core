import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [ConfigModule, HttpModule, PrismaModule],
  providers: [TokenService],
  exports: [TokenService]
})
export class TokenModule { }
