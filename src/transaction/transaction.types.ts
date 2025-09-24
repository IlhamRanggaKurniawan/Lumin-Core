import { Prisma } from "@prisma/client"

export interface JsonRpcResponse<T> {
    jsonrpc: string
    id?: number
    result: {
        transfers: T[]
    }
}

export type AlchemyTransaction = {
    blockNum: string,
    uniqueId: string,
    hash: string,
    from: string,
    to: string,
    value: Prisma.Decimal,
    erc721TokenId?: string,
    erc1155Metadata?: {
        tokenId: string,
        value: string
    },
    tokenId?: string,
    asset: string,
    category: "external" | "internal" | "token" | "erc20" | "erc721" | "erc1155" | "specialnft",
    rawContract: {
        value: string,
        address?: string,
        decimal: string
    },
    metadata: {
        blockTimestamp: string
    }
}