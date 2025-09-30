"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWalletStore } from "@/store";
import { useRouter } from "next/navigation";

function CreateWallet() {
  const router = useRouter(); // 导入useRouter函数

  const [password, setPassword] = React.useState(process.env.NEXT_PUBLIC_PASSWORD || "");
  const [confirmPassword, setConfirmPassword] = React.useState(process.env.NEXT_PUBLIC_PASSWORD || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 至少8位，包含数字、字母和特殊字符
    const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (!regex.test(password)) {
      alert("密码必须包含数字、字母和特殊字符");
      return;
    }

    if (password !== confirmPassword) {
      alert("密码不一致"); 
      return;
    }
    // 1. 实际创建钱包 (使用用户提供的密码)
    const createWallet = async (password: string) => {
      try {
        const path = "m/44'/60'/0'/0/0";
        // 创建随机HD钱包
        const wallet = ethers.HDNodeWallet.createRandom(password, path);
        // 助记词 导入钱包
        // const wallet = ethers.HDNodeWallet.fromPhrase(
        //   process.env.NEXT_PUBLIC_MNEMONIC || "",
        //   password
        // );

        // 使用用户密码加密钱包
        // encrypt方法会使用密码派生函数(PBKDF2)处理密码并加密钱包数据
        const encryptedWallet = await wallet.encrypt(password);
        // 将加密后的钱包存储到本地
        localStorage.setItem("encryptedWallet", encryptedWallet);

        // 提取非敏感信息，用于UI显示
        const account = {
          address: wallet.address,
          provider: wallet.provider || null,
        };
        // 将非敏感信息存储到状态管理，用于后续操作
        useWalletStore.setState({ account });

        // 保存助记词到状态管理，用于下一步验证
        useWalletStore.setState({ mnemonic: wallet.mnemonic?.phrase || "" });
        // 跳转到助记词确认页面
        router.push("/mnemonic");
      } catch (error) {
        console.error("创建钱包失败:", error);
        alert("创建钱包失败，请重试");
      }
    };

    // 使用用户输入的密码创建钱包
    await createWallet(password);
  };

  return (
    <div className="w-full px-10">
      <form onSubmit={handleSubmit}>
        <label htmlFor="create-wallet-form">密码</label>
        <input
          id="create-wallet-form"
          type="password"
          className="w-[100%] p-2 rounded-md block my-2 border border-gray-300"
          placeholder="至少输入8位字符"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="create-wallet-form-confirm">确认密码</label>
        <input
          id="create-wallet-form-confirm"
          type="password"
          className="w-[100%] p-2 rounded-md block my-2 border border-gray-300"
          placeholder="请确认密码"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full text-white p-3 rounded-md block my-2 bg-black text-center mt-10"
        >
          创建钱包
        </button>
      </form>
    </div>
  );
}

function ImportWallet() {
  const [exportType, setExportType] = useState("mnemonic");
  const [mnemonic, setMnemonic] = useState([] as string[]);
  const [privateKey, setPrivateKey] = useState("");

  useEffect(() => {
    setMnemonic(new Array<string>(12).fill(""));
  }, []);

  return (
    <div className="w-full">
      <ul className="flex flex-row gap-2 bg-gray-200 p-1 rounded-md">
        <li
          className={`w-[50%] text-center text-lg/loose ${
            exportType === "mnemonic" ? "bg-white rounded-md" : ""
          }`}
          onClick={() => setExportType("mnemonic")}
        >
          助记词
        </li>
        <li
          className={`w-[50%] text-center text-lg/loose ${
            exportType === "privateKey" ? "bg-white rounded-md" : ""
          }`}
          onClick={() => setExportType("privateKey")}
        >
          私钥
        </li>
      </ul>
      {exportType === "mnemonic" ? (
        <div>
          <div className="grid grid-cols-2 gap-2 my-2">
            {mnemonic.map((item, index) => {
              return (
                <div
                  className="flex flex-row items-center rounded-md my-2 border border-gray-300"
                  key={index}
                >
                  <label
                    className="w-[20%] text-center"
                    htmlFor={`mnemonic-${index}`}
                  >{`${index + 1}`}</label>
                  <input
                    id={`mnemonic-${index}`}
                    type="text"
                    className="w-[80%] p-2"
                    value={item}
                    onChange={(e) => {
                      if (e.target.value.split(" ").length === 12) {
                        setMnemonic(e.target.value.split(" "));
                        setPrivateKey("");
                      } else {
                        const newMnemonic = [...mnemonic];
                        newMnemonic[index] = e.target.value;
                        setMnemonic(newMnemonic);
                      }
                      setPrivateKey("");
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <textarea
            className="w-full h-40 p-2 my-2 border border-gray-300 rounded-md resize-none"
            value={privateKey}
            onChange={(e) => {
              setPrivateKey(e.target.value);
              setMnemonic(new Array(12).fill(""));
            }}
          />
        </div>
      )}
      <button
        className="w-full text-white p-3 rounded-md block my-2 bg-black text-center mt-10"
        onClick={async () => {
          if (exportType === "mnemonic") {
            if (mnemonic.some((item) => item === "")) {
              alert("请输入完整的助记词");
              return;
            }
          } else {
            if (privateKey === "") {
              alert("请输入私钥");
              return;
            }
          }
        }}
      >
        确认
      </button>
    </div>
  );
}

export default function Page({
  params,
}: {
  params: Promise<{ wallet_status: string }>;
}) {
  const { wallet_status } = React.use(params);

  return (
    <div className="flex flex-col items-center justify-center h-screen px-10">
      <h1 className="text-2xl font-bold mb-4">
        {wallet_status === "create" ? "创建钱包" : "导入钱包"}
      </h1>
      {wallet_status === "create" ? <CreateWallet /> : <ImportWallet />}
    </div>
  );
}
