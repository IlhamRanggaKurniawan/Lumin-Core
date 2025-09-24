import { Prisma } from "@prisma/client"

export type AlchemyWebhookPayload = {
    webhookId: string,
    id: string,
    createdAt: Date,
    type: "ADDRESS_ACTIVITY",
    event: {
        network: "ETH_SEPOLIA",
        activity: [{
            fromAddress: string,
            toAddress: string,
            blockNum: string,
            hash: string,
            value: Prisma.Decimal,
            asset: string,
            category: "external" | "token",
            rawContract: {
                rawValue: string,
                address?: string,
                decimals: number
            },
            log?: {
                address: string,
                topics: string[],
                data: string,
                blockHash: string,
                blockTimestamp: string,
                transactionHash: string,
                transactionIndex: string,
                logIndex: string,
                removed: boolean
            }
        }],
        source: string
    }
}