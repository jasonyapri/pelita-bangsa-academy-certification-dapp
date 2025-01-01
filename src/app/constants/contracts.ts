import { base, baseSepolia } from "thirdweb/chains";

export const COUNTER = "0x4E55215575606D4A57e165a9169FD651F520B99b";
export const PBACERT_MAINNET = "0xd25F0F6E2a9c1960d19CF41a5fcd20684E9dC759"; // Base Mainnet
export const PBACERT_TESTNET = "0x486883E79A1b5d3eA50f4d7e5Dd9Eb8c375E0e9b"; // Base Sepolia
export const PBACERT = process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === 'true' ? PBACERT_TESTNET : PBACERT_MAINNET;
export const DEFAULT_CHAIN = process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === 'true' ? "baseSepolia" : "base";

export function getActiveChain() {
    return process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === 'true' ? baseSepolia : base;
}