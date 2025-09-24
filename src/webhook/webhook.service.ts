import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from "crypto"
import { firstValueFrom } from 'rxjs';
import { EventsService } from 'src/events/events.service';
import { TokenService } from 'src/token/token.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { AlchemyWebhookPayload } from './webhook.types';

@Injectable()
export class WebhookService {
    private readonly webhookId = "wh_x5o05j79fcy1kjjv"
    private readonly AUTH_TOKEN: string
    private readonly logger = new Logger(WebhookService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly eventsService: EventsService,
        private readonly tokenService: TokenService,
        private readonly transactionService: TransactionService
    ) {
        this.AUTH_TOKEN = this.configService.get<string>("AUTH_TOKEN")!
    }

    async webhook(payload: AlchemyWebhookPayload) {
        this.logger.debug('Alchemy Event: ' + JSON.stringify(payload, null, 2));

        const token = await this.tokenService.getToken(payload.event.activity[0].rawContract.address || "0x0000000000000000000000000000000000000000", 11155111)

        if (!token) {
            const [newToken] = await this.tokenService.fetchTokenMetadataFromAlchemy([payload.event.activity[0].rawContract.address!])


            const transaction = await this.transactionService.createTransactions([{
                chainId: 11155111,
                from: payload.event.activity[0].fromAddress,
                to: payload.event.activity[0].toAddress,
                hash: payload.event.activity[0].hash,
                value: payload.event.activity[0].value,
                timestamp: payload.createdAt,
                tokenAddress: newToken.address,
            }])

            this.eventsService.emitEvent({
                ...transaction,
                tokenName: newToken.name,
                tokenImage: newToken.imageUrl,
                tokenSymbol: newToken.symbol,
            })
        } else {
            const transaction = await this.transactionService.createTransactions([{
                chainId: 11155111,
                from: payload.event.activity[0].fromAddress,
                to: payload.event.activity[0].toAddress,
                hash: payload.event.activity[0].hash,
                value: payload.event.activity[0].value,
                timestamp: payload.createdAt,
                tokenAddress: payload.event.activity[0].rawContract.address || "0x0000000000000000000000000000000000000000",
            }])

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
