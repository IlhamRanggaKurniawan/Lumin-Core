import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { AlchemyToken, JsonRpcResponse } from './token.types';
import { TokenMetadata } from '@prisma/client';

@Injectable()
export class TokenService {
    private readonly API_KEY: string

    constructor(
        private readonly prismaService: PrismaService,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.API_KEY = this.configService.get("API_KEY")!
    }

    async fetchTokenMetadataFromAlchemy(address: string[]) {
        const tokens: TokenMetadata[] = []

        for (let i = 0; i < address.length; i++) {
            const { data } = await firstValueFrom(this.httpService.post<JsonRpcResponse<AlchemyToken>>(`https://eth-sepolia.g.alchemy.com/v2/${this.API_KEY}`, {
                jsonrpc: "2.0",
                method: "alchemy_getTokenMetadata",
                params: [address[i]],
            }))

            tokens.push(
                {
                    decimals: data.result.decimals!,
                    name: data.result.name!,
                    symbol: data.result.symbol!,
                    address: address[i],
                    chainId: 11155111,
                    imageUrl: null
                }
            )
        }

        await this.prismaService.tokenMetadata.createMany({
            data: tokens.map((token) => ({
                chainId: 11155111,
                address: token.address,
                decimals: token.decimals,
                name: token.name,
                symbol: token.symbol,
                imageUrl: token.imageUrl,
            }))
        })

        return await this.prismaService.tokenMetadata.findMany({
            where: {
                address: {
                    in: address
                }
            }
        })
    }

    async getToken(address: string, chainId: number) {
        const token = this.prismaService.tokenMetadata.findUnique({
            where: {
                address_chainId: {
                    address,
                    chainId
                }
            }
        })

        return token
    }
}
