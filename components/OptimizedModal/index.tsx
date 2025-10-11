import { createPortal } from "react-dom";
import { close, xiala, touxiang, check } from "@/assets/icon";
import { useWalletStore } from "@/store";

export default function OptimizedModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) {
    return null;
  }
  return createPortal(
    <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-50">
      <header className="flex items-center p-4 justify-start">
        <img
          className="w-6 h-6 cursor-pointer"
          src={close.src}
          alt=""
          onClick={() => onClose()}
        />
      </header>
      <div>
        <div>
          {/* 钱包 */}
          <div className="flex justify-between items-center p-4">
            <div className="flex flex-col">
              钱包 01
              <span className="text-sm text-gray-500">$0.00</span>
            </div>
            <img className="w-3 h-3" src={xiala.src} alt="" />
          </div>
          {/* 账户 */}
          <div>
            <div className="flex items-center justify-between p-4 hover:bg-gray-100">
              <div className="flex items-center gap-2">
                <div className="mr-2 w-10 h-10">
                  <img src={touxiang.src} alt="" />
                </div>
                <div className="flex flex-col">
                  账户 01
                  <span className="text-sm text-gray-500">$0.00</span>
                </div>
              </div>
              <img className="w-5 h-5" src={check.src} alt="" />
            </div>
            <div className="flex items-center justify-between p-4 hover:bg-gray-100">
              <div className="flex items-center gap-2">
                <div className="mr-2 w-10 h-10 bg-gray-200 flex items-center justify-center text-2xl">
                  +
                </div>
                <div className="flex flex-col">添加账户</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
