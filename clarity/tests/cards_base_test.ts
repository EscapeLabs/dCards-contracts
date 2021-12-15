// test basic minting functions

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
    name: "get token address",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let output = callOne("get-token-uri", [types.uint(2)], accounts, chain)
        output.expectOk().
            expectSome().
            expectAscii("https://cards.layerc.xyz/api/tokens/cards/v1/{id}");
    },
});

Clarinet.test({
    name: "mint with seed",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const seed = '0xec16c1b2e57143708044e5da31cfe26582f4dde1857db5106b8f54c63d9eca32'
        const user = accounts.get("wallet_1")!
        let output = callOne("mint", [types.principal(user.address), seed], accounts, chain)
        output.expectOk().
            expectUint(1);
    },
});

Clarinet.test({
    name: "mint twice and check last token id",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const seed1 = '0xec16c1b2e57143708044e5da31cfe26582f4dde1857db5106b8f54c63d9eca32'
        const seed2 = '0xa016c1b2e57143708044e5da31cfe26582f4dde1857db5106b8f54c63d9eca32'
        const user = accounts.get("wallet_1")!
        const TOKEN_COUNT = 2 // 2 calls
        callOne("mint", [types.principal(user.address), seed1], accounts, chain)
        callOne("mint", [types.principal(user.address), seed2], accounts, chain)
        let output = callOne("get-last-token-id", [], accounts, chain)
        output.expectOk().
            expectUint(TOKEN_COUNT);
    },
});

Clarinet.test({
    name: "read seed",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const seed = '0xec16c1b2e57143708044e5da31cfe26582f4dde1857db5106b8f54c63d9eca32'
        const user = accounts.get("wallet_1")!
        callOne("mint", [types.principal(user.address), seed], accounts, chain)
        let output = callOne("get-seed", [types.uint(1)], accounts, chain)
        assertEquals(output.expectSome(), seed);
    },
});

Clarinet.test({
    name: "set mint price",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!
        const user = accounts.get("wallet_1")!
        let output = chain.mineBlock([Tx.contractCall(
            "dcards-nft",
            "set-mint-price",
            [types.uint(1000000)],
            deployer.address
        )]).receipts[0].result
        output.
            expectOk().
            expectBool(true)

        output = chain.mineBlock([Tx.contractCall(
            "dcards-nft",
            "set-mint-price",
            [types.uint(1)],
            user.address
        )]).receipts[0].result
        output.
            expectErr().
            expectUint(403)
    },
});

Clarinet.test({
    name: "mint many 1",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const seed = '0xec16c1b2e57143708044e5da31cfe26582f4dde1857db5106b8f54c63d9eca32'
        const deployer = accounts.get("deployer")!
        const user = accounts.get("wallet_1")!
        const details = [...new Array(1)].map(() => types.tuple({ address: types.principal(user.address), seed: seed }))
        console.log({ details })
        let output = chain.mineBlock([
            Tx.contractCall(
                "dcards-nft",
                "mint-many",
                [types.list(details)],
                user.address)])
        const ids = output.receipts[0].result.expectOk().expectList()
        assertEquals(ids.length, 1)
        output.receipts[0].events
            .expectSTXTransferEvent(3000000, user.address, deployer.address)
    },
});

Clarinet.test({
    name: "mint many 10",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const seed = '0xec16c1b2e57143708044e5da31cfe26582f4dde1857db5106b8f54c63d9eca32'
        const deployer = accounts.get("deployer")!
        const user = accounts.get("wallet_1")!
        const details = [...new Array(10)].map(() => types.tuple({ address: types.principal(user.address), seed: seed }))
        let output = chain.mineBlock([
            Tx.contractCall(
                "dcards-nft",
                "mint-many",
                [types.list(details)],
                user.address)])
        const ids = output.receipts[0].result.expectOk().expectList()
        assertEquals(ids.length, 10)
        output.receipts[0].events
            .expectSTXTransferEvent(2500000, user.address, deployer.address)
    },
});

Clarinet.test({
    name: "mint many 50",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const seed = '0xec16c1b2e57143708044e5da31cfe26582f4dde1857db5106b8f54c63d9eca32'
        const deployer = accounts.get("deployer")!
        const user = accounts.get("wallet_1")!
        const details = [...new Array(50)].map(() => types.tuple({ address: types.principal(user.address), seed: seed }))
        let output = chain.mineBlock([
            Tx.contractCall(
                "dcards-nft",
                "mint-many",
                [types.list(details)],
                user.address)])
        const ids = output.receipts[0].result.expectOk().expectList()
        assertEquals(ids.length, 50)
        output.receipts[0].events
            .expectSTXTransferEvent(2000000, user.address, deployer.address)
    },
});

Clarinet.test({
    name: "mint many 100",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const seed = '0xec16c1b2e57143708044e5da31cfe26582f4dde1857db5106b8f54c63d9eca32'
        const deployer = accounts.get("deployer")!
        const user = accounts.get("wallet_1")!
        const details = [...new Array(100)].map(() => types.tuple({ address: types.principal(user.address), seed: seed }))
        let output = chain.mineBlock([
            Tx.contractCall(
                "dcards-nft",
                "mint-many",
                [types.list(details)],
                user.address)])
        const ids = output.receipts[0].result.expectOk().expectList()
        assertEquals(ids.length, 100)
        output.receipts[0].events
            .expectSTXTransferEvent(1800000, user.address, deployer.address)
    },
});

Clarinet.test({
    name: "mint many 500",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const seed = '0xec16c1b2e57143708044e5da31cfe26582f4dde1857db5106b8f54c63d9eca32'
        const deployer = accounts.get("deployer")!
        const user = accounts.get("wallet_1")!
        const details = [...new Array(500)].map(() => types.tuple({ address: types.principal(user.address), seed: seed }))
        let output = chain.mineBlock([
            Tx.contractCall(
                "dcards-nft",
                "mint-many",
                [types.list(details)],
                user.address)])
        const ids = output.receipts[0].result.expectOk().expectList()
        assertEquals(ids.length, 500)
        // console.log(output.receipts[0].events)
        output.receipts[0].events
            .expectSTXTransferEvent(1800000, user.address, deployer.address)
    },
});
