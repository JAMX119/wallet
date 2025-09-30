"use client";
import { useWalletStore } from "@/store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  // 路由跳转
  const router = useRouter();
  // 验证助记词
  const mnemonic = useWalletStore((state: any) => state.mnemonic);
  // 助记词数组
  const words = mnemonic.split(" ");
  // 助记词索引
  const [confirmWords, setConfirmWords] = useState<
    {
      index: number;
      word: string;
      otherWords: string[];
    }[]
  >([]);
  // 用于存储用户选择的助记词
  const [selectedWords, setSelectedWords] = useState<(string | null)[]>([]);
  // 用于显示验证结果
  const [validationResult, setValidationResult] = useState<string | null>(null);

  useEffect(() => {
    let wordsArr = [];
    let c_words = [...words];

    // 随机抽取3个助记词的索引
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * c_words.length);
      const word = c_words.splice(randomIndex, 1);
      let otherWords: string[] = [];

      for (let j = 0; j < 2; j++) {
        const randomIndex = Math.floor(Math.random() * c_words.length);
        const word = c_words.splice(randomIndex, 1);
        otherWords.push(word[0]);
      }

      wordsArr.push({
        index: words.indexOf(word[0]),
        word: word[0],
        otherWords: otherWords as string[],
      });
    }

    setConfirmWords(wordsArr.sort((a, b) => a.index - b.index));
    // 初始化selectedWords数组，长度与confirmWords相同
    setSelectedWords(new Array(wordsArr.length).fill(null));
  }, [mnemonic]);

  // 验证用户选择的助记词是否正确
  const validateSelection = () => {
    const allSelected = selectedWords.every((word) => word !== null);
    if (!allSelected) {
      setValidationResult("请选择所有助记词");
      return;
    }

    const isCorrect = confirmWords.every(
      (item, index) => selectedWords[index] === item.word
    );

    if (isCorrect) {
      setValidationResult("验证成功！助记词已确认");
      // 验证成功后可以跳转到钱包主页或下一步
      setTimeout(() => {
        router.push("/welcome");
      }, 1500);
    } else {
      setValidationResult("选择的助记词不正确，请重新选择");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-10">
      <h1 className="text-2xl font-bold mb-4">确认助记词</h1>
      <p className="text-gray-500 mb-6 max-w-md text-center">
        请按顺序点击助记词，以确认您已正确备份。这是保证您资产安全的重要步骤。
      </p>

      <div className="mb-6 w-full">
        {confirmWords.map((item, confirmWordsIndex) => {
          return (
            <div className="mt-6" key={confirmWordsIndex}>
              <div className="text-sm font-medium mb-2">
                助记词 #{item.index + 1}:
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[...item.otherWords, item.word]
                  .sort()
                  .map((word, wordIndex) => {
                    return (
                      <div
                        key={wordIndex}
                        className={`text-center text-[14px] px-4 py-2 rounded-md cursor-pointer transition-all duration-200 ${
                          selectedWords[confirmWordsIndex] === word
                            ? "bg-blue-500 text-white shadow-md transform scale-105"
                            : "bg-gray-200 text-black-500 hover:bg-gray-300"
                        }
                      inline-block leading-[30px]`}
                        onClick={() => {
                          const newSelectedWords = [...selectedWords];
                          newSelectedWords[confirmWordsIndex] = word;
                          setSelectedWords(newSelectedWords);
                          // 清除之前的验证结果
                          setValidationResult(null);
                        }}
                      >
                        {word}
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}

        {/* 验证结果和确认按钮 */}
        {validationResult && (
          <div
            className={`mt-6 p-3 rounded-md ${
              validationResult.includes("成功")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {validationResult}
          </div>
        )}

        <button
          className="mt-10 w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-lg font-medium"
          onClick={validateSelection}
        >
          确认助记词选择
        </button>
      </div>
    </div>
  );
}
