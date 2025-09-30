"use client";
import { useWalletStore } from "@/store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";

export default function Page() {
  // 账户
  const account = useWalletStore((state: any) => state.account);
  // 路由跳转
  const router = useRouter();
  // 余额状态
  const [balance, setBalance] = useState<string>("0");

  useEffect(() => {
    if (!account) {
      router.replace("/");
      return;
    }

    // 创建provider实例，使用公共RPC节点
    const provider = new ethers.JsonRpcProvider(
      "https://mainnet.infura.io/v3/84842078b09946638c03157f83405213"
    );
    // 获取余额
    // 获取余额的函数
    const fetchBalance = async () => {
      try {
        if (account.address) {
          // 获取余额（以wei为单位）
          const balanceWei = await provider.getBalance(account.address);
          // 将余额转换为eth
          const balanceEth = ethers.formatEther(balanceWei);
          // 设置余额，保留4位小数
          setBalance(parseFloat(balanceEth).toFixed(4));
        }
      } catch (error) {
        console.error("获取余额失败:", error);
        setBalance("0");
      }
    };

    fetchBalance();

    // 可选：设置定时器定期更新余额
    const interval = setInterval(fetchBalance, 30000); // 每30秒更新一次

    return () => clearInterval(interval);
  }, [account, router]);

  if (account) {
    return (
      <div className="flex flex-col items-center h-screen">
        {/* 账户 钱包 地址 设置 网络 */}
        <div className="flex items-center justify-between w-full p-4 border-b border-gray-200">
          <img className="w-14 h-14 rounded-full" src="/avatar.png" alt="" />
          <div>
            <div>Account 1</div>
            <div>
              {account?.address.slice(0, 6) +
                "..." +
                account?.address.slice(-4)}
            </div>
          </div>
          <div>网络</div>
          <div>更多</div>
        </div>
        {/* 余额 发送 接收 兑换 交易历史 更多 */}
        <div className="w-full p-4">
          <div className="text-3xl font-bold">{balance} ETH</div>
          <div className="flex items-center justify-between mt-4">
            <button className="w-15 h-15 rounded-md bg-gray-100">出入金</button>
            <button className="w-15 h-15 rounded-md bg-gray-100">兑换</button>
            <button className="w-15 h-15 rounded-md bg-gray-100">发送</button>
            <button className="w-15 h-15 rounded-md bg-gray-100">收款</button>
          </div>
        </div>

        <div></div>
      </div>
    );
  }
}
