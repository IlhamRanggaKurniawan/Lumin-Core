import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from "crypto"
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WebhookService {
    private readonly logger = new Logger(WebhookService.name);
    private readonly webhookId = "wh_x5o05j79fcy1kjjv"
    private readonly AUTH_TOKEN: string

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        this.AUTH_TOKEN = this.configService.get<string>("AUTH_TOKEN")!
    }

    processAlchemyEvent(event: any): any {
        this.logger.debug('Alchemy Event: ' + JSON.stringify(event, null, 2));

        return event
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
