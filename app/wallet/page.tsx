"use client";
import { useWalletStore } from "@/store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import {
  fuzhi,
  shezhi,
  yuyan,
  touxiang,
  shang,
  xia,
  duihuan,
  jiaoyilishi,
  gengduo,
  xiala,
} from "@/assets/icon";
import OptimizedModal from "@/components/OptimizedModal";

const FunctionButtons = () => {
  const data = [
    {
      name: "复制",
      icon: fuzhi.src,
    },
    {
      name: "设置",
      icon: shezhi.src,
    },
    {
      name: "网络",
      icon: yuyan.src,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-5">
      {data.map((item) => (
        <div key={item.name} className="flex flex-col items-center">
          <img className="w-6 h-6" src={item.icon} alt="" />
        </div>
      ))}
    </div>
  );
};

const ActionButtons = () => {
  const data = [
    {
      name: "发送",
      icon: shang.src,
    },
    {
      name: "接收",
      icon: xia.src,
    },
    {
      name: "兑换",
      icon: duihuan.src,
    },
    {
      name: "交易历史",
      icon: jiaoyilishi.src,
    },
    {
      name: "更多",
      icon: gengduo.src,
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-5 justify-items-center mt-4">
      {data.map((item) => (
        <div key={item.name} className="max-w-20 min-w-15 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full p-3.5 flex items-center justify-center bg-gray-100">
            <img className="" src={item.icon} alt="" />
          </div>
          <span className="mt-2 text-sm">{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default function Page() {
  // 账户
  const account = useWalletStore((state: any) => state.account);
  // 路由跳转
  const router = useRouter();
  // 余额状态
  const [balance, setBalance] = useState<string>("0");
  // 弹窗状态
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
      <>
        <div className="flex flex-col items-center h-screen">
          {/* 账户 钱包 地址 设置 网络 */}
          <div className="flex items-center justify-between w-full p-4">
            <div className="flex items-center gap-2">
              <div className="w-14 h-14 p-2 bg-gray-100 rounded-md">
                <img
                  className=""
                  src={touxiang.src}
                  alt=""
                />
              </div>
              {/* 账户信息 */}
              <div className="flex flex-col" onClick={() => setIsOpen(true)}>
                <div className="flex items-center gap-1">
                  账户 01
                  <img className="w-2 h-2" src={xiala.src} alt="" />
                </div>
                <div className="text-sm text-gray-500">钱包 01</div>
              </div>
            </div>
            {/* 功能按钮 */}
            <FunctionButtons />
          </div>

          <div className="w-full p-4 border-b border-gray-200">
            {/* 余额 */}
            <div className="text-3xl font-bold">{balance} ETH</div>
            {/* 操作按钮 */}
            <ActionButtons />
          </div>

          <div></div>
        </div>
        {/* 弹窗 */}
        <OptimizedModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </>
    );
  }
}
