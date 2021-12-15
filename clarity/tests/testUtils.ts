import {
    Clarinet,
    Tx,
    Chain,
    Account,
    types,
    // @ts-ignore
} from "https://deno.land/x/clarinet@v0.12.0/index.ts";

export const callOne = (
    method: string,
    params: any,
    accounts: Map<string, Account>,
    chain: Chain,
    opts?: any) => {

    let wallet_1 = accounts.get("wallet_1")!;
    let block = chain.mineBlock([
        Tx.contractCall(
            "dcards-nft",
            method,
            params,
            wallet_1.address
        ),
    ]);

    if (opts?.verbose) {
        console.log('\n\n------\n', method, block.receipts);
    }
    const output = block.receipts[0].result
    return output
}
