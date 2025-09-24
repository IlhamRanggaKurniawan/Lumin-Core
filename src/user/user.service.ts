import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
// import { firstValueFrom } from 'rxjs';
// import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(
        // private readonly prismaService: PrismaService,
        private readonly httpService: HttpService
    ) { }

    // async createUser(address: string) {
    //     const transactions = await firstValueFrom(this.httpService.post(`https://eth-sepolia.g.alchemy.com/v2/:apiKey`))
    // }

}
