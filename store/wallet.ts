import { create } from 'zustand'

export const useWalletStore = create((set) => ({
    // 账户
    account: null,
    // 助记词
    mnemonic: null,
}))
