"use client";
import { BROWN, LIGHT_BROWN } from "@/lib/helper";
import { Menu } from "lucide-react";

type Props = {
    setSidebarOpen: (val: boolean) => void
};

const AdminTopbar = ({setSidebarOpen}: Props) => {
  return (
    <header
      className="h-14 bg-white border-b border-gray-100 flex items-center px-5 gap-4 shrink-0"
      style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.04)" }}
    >
      <button
        className="lg:hidden text-gray-400 hover:text-gray-600 transition-colors"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="relative hidden sm:block w-56">
        {/* <Search
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
        />
        <Input
          placeholder="Search anything…"
          className="h-8 pl-8 rounded-sm border-gray-200 bg-gray-50 focus-visible:ring-BROWN-700/20 focus-visible:border-BROWN-700 text-xs"
          style={{ fontFamily: "'Lato', sans-serif" }}
        /> */}
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Notification */}
        {/* <button className="relative w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors">
          <Bell size={17} className="text-gray-400" />
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ background: ORANGE }}
          />
        </button> */}

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white cursor-pointer"
          style={{
            background: `linear-gradient(135deg, ${BROWN}, ${LIGHT_BROWN})`,
          }}
        >
          A
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
