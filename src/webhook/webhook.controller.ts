/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Headers, HttpCode, Param, Patch, Post, Req, UnauthorizedException } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller("/api")
export class WebhookController {
    signingKey: string = process.env.SIGNING_KEY || "";

    constructor(
        private readonly webhookService: WebhookService,
    ) { }

    @Post("/webhook")
    @HttpCode(200)
    async webhook(@Body() payload: any, @Headers('x-alchemy-signature') signature: string, @Req() req: any) {
        const verified = this.webhookService.verifySignature(req.rawBody, signature, this.signingKey)

        if (!verified) {
            throw new UnauthorizedException("Invalid Signature")
        }

        await this.webhookService.webhook(payload)
    }

    @Patch("/webhook/:address")
    @HttpCode(200)
    async addAddress(@Param("address") address: string) {
        await this.webhookService.addAddresses([address])

        return { success: true }
    }
}

