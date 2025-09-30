"use client";
import { useWalletStore } from "@/store";
import Link from "next/link";
export default function Page() {
  const mnemonic = useWalletStore((state: any) => state.mnemonic);
  return (
    <div className="flex flex-col items-center justify-center h-screen px-10">
      <h1 className="text-2xl font-bold mb-4">抄写备份助记词</h1>
      <p className="text-gray-500 mb-4">
        请按顺序抄写以下单词，并要善保管。切勿向任何人透露你的助记词，否则你可能失去全部资产。
      </p>
      {/* 两列 */}
      <div className="w-full grid grid-cols-2 gap-4">
        {mnemonic &&
          mnemonic.split(" ").map((word: string, index: number) => (
            <div
              key={index}
              className="flex text-[20px]/[20px] p-3 border border-gray-300 rounded-md"
            >
              {/* 不可选中 */}
              <div className="w-15 text-center border-r border-gray-300 select-none">
                {index + 1}
              </div>
              <div className="w-full pl-4">{word}</div>
            </div>
          ))}
      </div>
      <Link
        href="/mnemonic/confirm"
        className="w-full text-center text-white p-3 rounded-md block my-2 bg-black mt-10"
      >
        我已记录完毕
      </Link>
    </div>
  );
}
