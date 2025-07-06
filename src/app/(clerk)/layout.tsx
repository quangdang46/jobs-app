import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      {children}
    </div>
  );
}
