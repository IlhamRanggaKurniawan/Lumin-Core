import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenService } from 'src/token/token.service';
import { AlchemyTransaction, JsonRpcResponse } from './transaction.types';
import { Transaction } from '@prisma/client';

@Injectable()
export class TransactionService {
    private readonly API_KEY: string
    private readonly logger = new Logger()

    constructor(
        private readonly prismaService: PrismaService,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly tokenService: TokenService
    ) {
        this.API_KEY = this.configService.get("API_KEY")!
    }

    normalizedTxFromAlchemy(txs: AlchemyTransaction[]): Transaction[] {
        return txs.map((tx) => ({
            chainId: 11155111,
            from: tx.from,
            to: tx.to,
            value: tx.value,
            hash: tx.hash,
            timestamp: new Date(tx.metadata.blockTimestamp),
            tokenAddress: tx.rawContract.address || "0x0000000000000000000000000000000000000000",
        }))
    }

    async fetchTransactionsFromAlchemy(address: string): Promise<Transaction[]> {
        const [{ data: fromTx }, { data: toTx }] = await Promise.all([
            firstValueFrom(this.httpService.post<JsonRpcResponse<AlchemyTransaction>>(`https://eth-sepolia.g.alchemy.com/v2/${this.API_KEY}`, {
                jsonrpc: "2.0",
                method: "alchemy_getAssetTransfers",
                params: {
                    fromAddress: address,
                    category: [
                        "erc20",
                        "external"
                    ],
                    withMetadata: true,
                    order: "desc"
                }
            })),
            firstValueFrom(this.httpService.post<JsonRpcResponse<AlchemyTransaction>>(`https://eth-sepolia.g.alchemy.com/v2/${this.API_KEY}`, {
                jsonrpc: "2.0",
                method: "alchemy_getAssetTransfers",
                params: {
                    toAddress: address,
                    category: [
                        "erc20",
                        "external"
                    ],
                    withMetadata: true,
                    order: "desc"
                }
            }))
        ])

        const tx = [...fromTx.result.transfers, ...toTx.result.transfers].sort((b, a) => Date.parse(a.metadata.blockTimestamp) - Date.parse(b.metadata.blockTimestamp))

        return this.normalizedTxFromAlchemy(tx)
    }

    async getUserTransactions(address: string) {
        const transactions = await this.prismaService.transaction.findMany({
            where: {
                OR: [{ from: address }, { to: address }]
            }
        })

        if (transactions.length !== 0) return transactions

        const tx = await this.fetchTransactionsFromAlchemy(address)

        const uniqueTokenAddresses = [...new Set(tx.map(t => t.tokenAddress))]

        const existing = await this.prismaService.tokenMetadata.findMany({
            where: {
                chainId: 11155111,
                address: {
                    in: uniqueTokenAddresses
                }
            }
        })

        const existingSet = new Set(existing.map(t => t.address))

        const unkownToken = uniqueTokenAddresses.filter(addr => !existingSet.has(addr))

        if (unkownToken.length !== 0) {
            await this.tokenService.fetchTokenMetadataFromAlchemy(unkownToken)
        }

        await this.prismaService.transaction.createMany({
            data: tx,
            skipDuplicates: true
        })

        return tx
    }


    async createTransactions(txs: Transaction[]) {
        return await this.prismaService.transaction.createMany({
            data: txs,
            skipDuplicates: true
        })
    }
}
