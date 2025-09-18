/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Headers, HttpCode, Param, Patch, Post, Req, UnauthorizedException } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { EventsService } from 'src/events/events.service';

@Controller("/api")
export class WebhookController {
    signingKey: string = process.env.SIGNING_KEY || "";

    constructor(
        private readonly webhookService: WebhookService,
        private readonly eventsService: EventsService,
    ) { }

    @Post("/webhook")
    @HttpCode(200)
    webhook(@Body() payload: any, @Headers('x-alchemy-signature') signature: string, @Req() req: any) {

        const verified = this.webhookService.verifySignature(req.rawBody, signature, this.signingKey)

        if (!verified) {
            throw new UnauthorizedException("Invalid Signature")
        }

        const data = this.webhookService.processAlchemyEvent(payload);

        const transactionData = {
            fromAddress: data.event.activity[0].fromAddress,
            toAddress: data.event.activity[0].toAddress,
            asset: data.event.activity[0].asset,
            value: data.event.activity[0].value,
            hash: data.event.activity[0].hash,
            timestamp: data.createdAt,
        }

        this.eventsService.emitEvent(transactionData)
    }

    @Patch("/webhook/:address")
    @HttpCode(200)
    async addAddress(@Param("address") address: string) {
        await this.webhookService.addAddresses([address])

        return { success: true }
    }
}

