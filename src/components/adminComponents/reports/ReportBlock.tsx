import { ReactNode } from "react";

interface ReportBlockProps {
  title: string;
  children: ReactNode;
}

const ReportBlock = ({ title, children }: ReportBlockProps) => {
  return (
    <div className="p-4 rounded-xl border shadow-sm mb-6">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {children}
    </div>
  );
};

export default ReportBlock;
