
import {
    Clarinet,
    Tx,
    Chain,
    Account,
    types,
    // @ts-ignore
} from "https://deno.land/x/clarinet@v0.12.0/index.ts";

// @ts-ignore
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

// @ts-ignore
import { callOne } from './testUtils.ts'


Clarinet.test({
    name: "get info",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const seed = '0xec16c1b2e57143708044e5da31cfe26582f4dde1857db5106b8f54c63d9eca32'
        const user = accounts.get("wallet_1")!
        callOne("mint", [types.principal(user.address), seed], accounts, chain)
        let output = callOne("get-info", [types.uint(1)], accounts, chain)
        console.log(output)
        let info: any = output.
            expectOk().
            expectTuple()
        info.claimed.expectNone()
        info.approved.expectOk().expectBool(true),
            info.owner.expectSome().expectPrincipal(user.address)
        assertEquals(info.seed.expectSome(), seed)
        info["last-id"].expectUint(1)
    },
});



Clarinet.test({
    name: "get token info",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let wallet_1 = accounts.get("wallet_1")!
        let wallet_2 = accounts.get("wallet_2")!
        let wallet_3 = accounts.get("wallet_3")!

        const seed1 = '0xec16c1b2e57143708044e5da31cfe26582f4dde1857db5106b8f54c63d9ecaaa'
        const seed2 = '0xec16c1b2e57143708044e5da31cfe26582f4dde1857db5106b8f54c63d9ecbbb'
        const seed3 = '0xec16c1b2e57143708044e5da31cfe26582f4dde1857db5106b8f54c63d9ecccc'
        callOne("mint", [types.principal(wallet_1.address), seed1], accounts, chain) // mint 1 token
        callOne("mint", [types.principal(wallet_2.address), seed2], accounts, chain) // mint 2 token
        callOne("mint", [types.principal(wallet_3.address), seed3], accounts, chain) // mint 3 token

        let output = callOne("get-info", [types.uint(1)], accounts, chain, { verbose: true })

        console.log('output', output)
        const result = output.expectOk().expectTuple()
        console.log('result', result)

        // to be continued...

    },
});

