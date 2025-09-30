import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-10">
        <h1 className="text-3xl/loose font-bold my-4 text-center break-keep">欢迎使用 Wallet
即刻探索 Web3 世界</h1>
        <Link href="/wallet" replace className="w-full text-center text-white p-3 rounded-md block my-2 bg-black">开启web3之旅</Link>
    </div>
  );
}