// import { ReactNode } from "react";

// interface SessionSheetProps {
//   children: ReactNode;
//   visible: boolean;
//   onClose: () => void;
// }

// export function SessionSheet({ children, visible, onClose }: SessionSheetProps) {
//   return (
//     <>
//       <div onClick={onClose} className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${visible ? "opacity-100" : "opacity-0"}`} />
//       <div className={`fixed bottom-0 left-0 right-0 z-50 rounded-t-[32px] bg-[#e0f8ff] px-6 pb-10 pt-2 shadow-2xl transition-transform duration-500 ${visible ? "translate-y-0" : "translate-y-full"}`}>
//         <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-slate-300" />
//         {children}
//       </div>
//     </>
//   );
// }

import { ReactNode } from "react";

interface SessionSheetProps {
  children: ReactNode;
  visible: boolean;
  onClose: () => void;
}

export function SessionSheet({
  children,
  visible,
  onClose,
}: SessionSheetProps) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${visible ? "opacity-100" : "opacity-0"}`}
      />
      <div
        className={`fixed bottom-0 left-[25%] right-0 z-50 max-sm:w-full max-sm:left-0 rounded-t-[32px] w-[50%] bg-[#e0f8ff] px-6 pb-10 pt-2 shadow-2xl transition-transform duration-500 ${visible ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-slate-300" />
        {children}
      </div>
    </>
  );
}
