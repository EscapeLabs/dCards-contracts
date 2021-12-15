
import {
    Clarinet,
    Tx,
    Chain,
    Account,
    types,
    // @ts-ignore
} from "https://deno.land/x/clarinet@v0.12.0/index.ts";

// @ts-ignore
import { callOne } from './testUtils.ts'

// @ts-ignore
// import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";


Clarinet.test({
    name: "check token owner",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let wallet_2 = accounts.get("wallet_2")!;
        const seed = '0xec16c1b2e57143708044e5da31cfe26582f4dde1857db5106b8f54c63d9eca32'
        callOne("mint", [types.principal(wallet_2.address), seed], accounts, chain)
        let output = callOne("get-owner", [types.uint(1)], accounts, chain)
        output.
            expectOk().
            expectSome().
            expectPrincipal(wallet_2.address);
    },
});

Clarinet.test({
    name: "check transfer",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let deployer = accounts.get("deployer")!
        let wallet_1 = accounts.get("wallet_1")!
        let wallet_2 = accounts.get("wallet_2")!
        let wallet_3 = accounts.get("wallet_3")!

        const seed = '0xec16c1b2e57143708044e5da31cfe26582f4dde1857db5106b8f54c63d9eca32'
        callOne("mint", [types.principal(wallet_1.address), seed], accounts, chain)

        // check first owner
        callOne("get-owner", [types.uint(1)], accounts, chain, { verbose: false }).
            expectOk().
            expectSome().
            expectPrincipal(wallet_1.address);

        const args = [
            types.uint(1), // token id
            types.principal(wallet_1.address), // sender
            types.principal(wallet_2.address), // recipiect
        ]
        // do transfer
        callOne("transfer", args, accounts, chain).
            expectOk().
            expectBool(true)

        // check new owner
        callOne("get-owner", [types.uint(1)], accounts, chain, { verbose: false }).
            expectOk().
            expectSome().
            expectPrincipal(wallet_2.address);

        // do transfer with nft not owned
        callOne("transfer", args, accounts, chain).
            expectErr().
            expectUint(1)
    }
})


Clarinet.test({
    name: "check transfer with memo",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let wallet_1 = accounts.get("wallet_1")!
        let wallet_2 = accounts.get("wallet_2")!

        const seed = '0xec16c1b2e57143708044e5da31cfe26582f4dde1857db5106b8f54c63d9eca32'
        callOne("mint", [types.principal(wallet_1.address), seed], accounts, chain)

        const args = [
            types.uint(1), // seed
            types.principal(wallet_1.address), // sender
            types.principal(wallet_2.address), // recipiect
            "0x123456"
        ]
        // do transfer
        callOne("transfer-memo", args, accounts, chain).
            expectOk().
            expectBool(true)
    }
})

Clarinet.test({
    name: "check transfer for invalid id and wrong owner",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let wallet_1 = accounts.get("wallet_1")!
        let wallet_2 = accounts.get("wallet_2")!
        let wallet_3 = accounts.get("wallet_3")!

        const seed = '0xec16c1b2e57143708044e5da31cfe26582f4dde1857db5106b8f54c63d9eca32'
        callOne("mint", [types.principal(wallet_1.address), seed], accounts, chain)

        // expect fail transfer for undefined token-id
        callOne("transfer", [types.uint(2), types.principal(wallet_2.address), types.principal(wallet_3.address)], accounts, chain, { verbose: false, from: wallet_3!.address }).
            expectErr().
            expectUint(404)

        // expect it to fail when sent from wallet_3 (not owner, not approved, not postman)
        let block = chain.mineBlock([
            Tx.contractCall(
                'dcards-nft',
                'transfer',
                [
                    types.uint(1),  // token id
                    types.principal(wallet_2.address),  // sender
                    types.principal(wallet_3.address)   // recipiect
                ],
                wallet_3.address
            )])
        let failTx = block.receipts[0]
        failTx.result.expectErr().expectUint(403)
    }
})

Clarinet.test({
    name: "check transfer for postman",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let deployer = accounts.get("deployer")!
        let wallet_1 = accounts.get("wallet_1")!
        let wallet_2 = accounts.get("wallet_2")!
        let wallet_3 = accounts.get("wallet_3")!

        const seed = '0xec16c1b2e57143708044e5da31cfe26582f4dde1857db5106b8f54c63d9eca32'

        callOne("mint", [types.principal(wallet_1.address), seed], accounts, chain)

        // transfer by postman
        let block = chain.mineBlock([
            Tx.contractCall(
                'dcards-nft',
                'transfer',
                [
                    types.uint(1),  // token id
                    types.principal(wallet_1.address),  // from
                    types.principal(wallet_3.address)   // to
                ],
                deployer.address
            )])
        let adminTx = block.receipts[0]
        adminTx.result.expectOk().expectBool(true)

        let checkTx = chain.callReadOnlyFn(
            'dcards-nft',
            'get-owner',
            [
                types.uint(1),  // token id
            ],
            wallet_1.address // sender
        )
        checkTx.result.
            expectOk().
            expectSome().
            expectPrincipal(wallet_3.address);

        // transfer by postman second time fails
        block = chain.mineBlock([
            Tx.contractCall(
                'dcards-nft',
                'transfer',
                [
                    types.uint(1),  // token id
                    types.principal(wallet_3.address),  // from
                    types.principal(wallet_1.address)   // to
                ],
                deployer.address
            )])
        adminTx = block.receipts[0]
        adminTx.result.expectErr().expectUint(403)
    },
});

Clarinet.test({
    name: "check transfer for approved operator",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let deployer = accounts.get("deployer")!
        let wallet_1 = accounts.get("wallet_1")!
        let wallet_2 = accounts.get("wallet_2")!
        let wallet_3 = accounts.get("wallet_3")!

        const seed = '0xec16c1b2e57143708044e5da31cfe26582f4dde1857db5106b8f54c63d9eca32'

        callOne("mint", [types.principal(wallet_1.address), seed], accounts, chain)

        let block = chain.mineBlock([
            Tx.contractCall(
                'dcards-nft',
                'transfer',
                [
                    types.uint(1),  // token id
                    types.principal(wallet_1.address),  // from
                    types.principal(wallet_3.address)   // to
                ],
                wallet_2.address
            )])
        let adminTx = block.receipts[0]
        adminTx.result.expectErr().expectUint(403)

        // approve wallet_2
        callOne("set-approved", [types.uint(1), types.principal(wallet_2.address), types.bool(true)], accounts, chain)

        block = chain.mineBlock([
            Tx.contractCall(
                'dcards-nft',
                'transfer',
                [
                    types.uint(1),  // token id
                    types.principal(wallet_1.address),  // from
                    types.principal(wallet_3.address)   // to
                ],
                wallet_2.address
            )])
        adminTx = block.receipts[0]
        adminTx.result.expectOk().expectBool(true)

        // return to wallet_1
        block = chain.mineBlock([
            Tx.contractCall(
                'dcards-nft',
                'transfer',
                [
                    types.uint(1),  // token id
                    types.principal(wallet_3.address),  // from
                    types.principal(wallet_1.address)   // to
                ],
                wallet_3.address
            )])
        adminTx = block.receipts[0]
        adminTx.result.expectOk().expectBool(true)

        // disapprove wallet_2
        callOne("set-approved", [types.uint(1), types.principal(wallet_2.address), types.bool(false)], accounts, chain)
            .expectOk().expectBool(true)

        // try again
        block = chain.mineBlock([
            Tx.contractCall(
                'dcards-nft',
                'transfer',
                [
                    types.uint(1),  // token id
                    types.principal(wallet_1.address),  // from
                    types.principal(wallet_3.address)   // to
                ],
                wallet_3.address
            )])
        adminTx = block.receipts[0]
        adminTx.result.expectErr().expectUint(403)

        let canTransfer = chain.callReadOnlyFn(
            'dcards-nft',
            'can-transfer',
            [
                types.uint(1),  // token id
                types.principal(wallet_1.address),  // from
                types.principal(wallet_3.address)   // to
            ],
            wallet_3.address
        ).result
        canTransfer.expectBool(false)

        callOne("set-approved-all", [types.principal(wallet_3.address), types.bool(true)], accounts, chain)

        canTransfer = chain.callReadOnlyFn(
            'dcards-nft',
            'can-transfer',
            [
                types.uint(1),  // token id
                types.principal(wallet_1.address),  // from
                types.principal(wallet_3.address)   // to
            ],
            wallet_3.address
        ).result
        canTransfer.expectBool(true)

        // try again
        block = chain.mineBlock([
            Tx.contractCall(
                'dcards-nft',
                'transfer',
                [
                    types.uint(1),  // token id
                    types.principal(wallet_1.address),  // from
                    types.principal(wallet_3.address)   // to
                ],
                wallet_3.address
            )])
        adminTx = block.receipts[0]
        adminTx.result.expectOk().expectBool(true)
    }
})

