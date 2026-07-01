import { Search, Bell } from "lucide-react";

interface NavbarProps {
  title: string;
  action?: React.ReactNode;
}

export const Navbar = ({ title, action }: NavbarProps) => {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-hm-surface border-b-[0.5px] border-hm-border sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <h1 className="font-sans text-lg font-semibold text-hm-text-primary leading-snug">
          {title}
        </h1>
      </div>
      
      <div className="flex items-center gap-3">
        {action !== undefined ? (
          action
        ) : (
          <button className="bg-hm-text-primary text-hm-surface font-sans text-sm font-medium px-4 py-2 rounded-lg border-[0.5px] border-hm-border hover:bg-hm-text-primary/90 transition-colors flex items-center gap-2 shadow-sm">
            <Search size={16} />
            Scan all
          </button>
        )}
        
        <div className="h-6 w-[1px] bg-hm-border mx-2"></div>
        
        <button className="p-2 text-hm-text-secondary hover:text-hm-text-primary hover:bg-hm-bg rounded-full transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-hm-danger rounded-full"></span>
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover border-[0.5px] border-hm-border ml-1 cursor-pointer hover:ring-2 hover:ring-hm-border transition-all"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7ECnkq-KLdwyn2KgzfqMBOUSCIO-o4IvZss-JoTZVyw8XSpHFCTGDZuT7yOyzg1kmyJORmdGWC3hs80Ezl2wLrEvEVQVgIxDIvWtyJlRkMSIShGyBVSF9aYmkFP0L9RcMkqBajEx6fnu1ub2SfxWlBcF_5qj6HZUvvewY1sOYXfVSlVfadNHiR8m-oTntk05Vuch2I5CvgDh5YJNwbkssctOSqp_RWXISjVOlGy0Jgwyxw5Z9OXiDOaBHxuC42mU13IP0Fe36yQ"
        />
      </div>
    </header>
  );
};
