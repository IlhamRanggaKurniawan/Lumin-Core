export interface JsonRpcResponse<T> {
    jsonrpc: string
    id?: number
    result: T
}

export type AlchemyToken = {
    decimals?: number,
    logo?: string,
    name?: string,
    symbol?: string
}