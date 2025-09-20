/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from "crypto"
import { firstValueFrom } from 'rxjs';
import { EventsService } from 'src/events/events.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WebhookService {
    private readonly webhookId = "wh_x5o05j79fcy1kjjv"
    private readonly AUTH_TOKEN: string
    private readonly logger = new Logger(WebhookService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly eventsService: EventsService,
        private readonly prismaService: PrismaService,
    ) {
        this.AUTH_TOKEN = this.configService.get<string>("AUTH_TOKEN")!
    }

    async webhook(payload: any) {
        this.logger.debug('Alchemy Event: ' + JSON.stringify(payload, null, 2));

        const token = await this.prismaService.token.findUnique({
            where: {
                address_chainId: {
                    address: payload.event.activity[0].rawContract.address ? payload.event.activity[0].rawContract.address : "0x0000000000000000000000000000000000000000",
                    chainId: 11155111
                }
            }
        })

        if (!token) {
            const { data } = await firstValueFrom(this.httpService.post("https://eth-sepolia.g.alchemy.com/v2/-ec5oAkgC16e5k9ERMfFx", {
                jsonrpc: "2.0",
                method: "alchemy_getTokenMetadata",
                params: [
                    payload.event.activity[0].rawContract.address
                ],
            }))

            const newToken = await this.prismaService.token.create({
                data: {
                    chainId: 11155111,
                    address: payload.event.activity[0].rawContract.address,
                    decimals: data.result.decimals,
                    name: data.result.name,
                    symbol: data.result.symbol,
                    imageUrl: data.result.logo,
                }
            })

            const transaction = await this.prismaService.transaction.create({
                data: {
                    chainId: 11155111,
                    from: payload.event.activity[0].fromAddress,
                    to: payload.event.activity[0].toAddress,
                    hash: payload.event.activity[0].hash,
                    value: payload.event.activity[0].value,
                    timestamp: payload.createdAt,
                    tokenAddress: newToken.address,
                }
            })

            this.eventsService.emitEvent({
                ...transaction,
                tokenName: newToken.name,
                tokenImage: newToken.imageUrl,
                tokenSymbol: newToken.symbol,
            })
        } else {
            const transaction = await this.prismaService.transaction.create({
                data: {
                    chainId: 11155111,
                    from: payload.event.activity[0].fromAddress,
                    to: payload.event.activity[0].toAddress,
                    hash: payload.event.activity[0].hash,
                    value: payload.event.activity[0].value,
                    timestamp: payload.createdAt,
                    tokenAddress: payload.event.activity[0].rawContract.address ? payload.event.activity[0].rawContract.address : "0x0000000000000000000000000000000000000000",
                }
            })

            this.eventsService.emitEvent({
                ...transaction,
                tokenName: token.name,
                tokenImage: token.imageUrl,
                tokenSymbol: token.symbol,
            })
        }
    }

    verifySignature(rawBody: string, signature: string, signingKey: string): boolean {
        const hmac = crypto.createHmac('sha256', signingKey);
        hmac.update(rawBody, 'utf8');
        const digest = hmac.digest('hex');

        return digest === signature;
    }

    async addAddresses(addresses: string[]) {
        const res = await firstValueFrom(this.httpService.patch("https://dashboard.alchemy.com/api/update-webhook-addresses", {
            webhook_id: this.webhookId,
            addresses_to_add: addresses,
            addresses_to_remove: [],
        }, {
            headers: {
                'X-Alchemy-Token': this.AUTH_TOKEN,
                "Content-Type": "application/json"
            }
        }))

        return res
    }
}
