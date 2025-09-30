"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWalletStore } from "@/store";

export default function Home() {
  const router = useRouter();

  const [hasStoredWallet, setHasStoredWallet] = useState(false);
  // 从环境变量中获取默认密码
  const [password, setPassword] = useState(process.env.NEXT_PUBLIC_PASSWORD || "");
  const [encryptedWallet, setEncryptedWallet] = useState("");
  
  useEffect(() => {
    // 检查是否存在加密的钱包数据
    const storedWallet = localStorage.getItem("encryptedWallet");
    setEncryptedWallet(storedWallet || "");
    setHasStoredWallet(!!storedWallet);
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // 处理密码验证
      const account = await ethers.Wallet.fromEncryptedJson(
        encryptedWallet,
        password
      );
      // 存储账户到 zustand 状态管理
      useWalletStore.setState({ account });
      router.replace("/wallet");
    } catch (error) {
      console.error("密码错误:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-10">
      {/* logo */}
      <Image src="/globe.svg" alt="" width={100} height={100} />
      {/* 标题 */}
      <h1 className="text-3xl font-bold my-4">钱包管理系统</h1>
      {/* 描述 placeholder */}
      <p className="text-center text-gray-500 text-xs">管理您的数字货币钱包</p>
      {hasStoredWallet ? (
        <form className="flex flex-col items-center justify-center w-full mt-20" onSubmit={onSubmit}>
          <input
            type="password"
            className="w-full p-3 rounded-md block my-2 border border-gray-300"
            placeholder="请输入密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full text-white p-3 rounded-md block my-2 bg-black text-center"
          >
            解锁钱包
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center w-full mt-20">
          <Link
            href="/create"
            className="w-full text-white p-3 rounded-md block my-2 bg-black text-center"
            passHref
          >
            创建钱包
          </Link>
          <Link
            href="/import"
            className="w-full text-white p-3 rounded-md block my-2 bg-black text-center"
            passHref
          >
            导入钱包
          </Link>
        </div>
      )}
    </div>
  );
}
