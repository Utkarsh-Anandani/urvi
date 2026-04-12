"use server";
import { getSession } from "@/lib/auth";
import { BROWN, LATO, ORANGE } from "@/lib/helper";
import Navbar from "./navbar";

const Header = async () => {
  const session = await getSession();
  return (
    <>
      {/* Announcement bar */}
      <div
        className="w-full py-2 text-center text-xs uppercase tracking-[0.2em]"
        style={{ background: BROWN, color: "#fff", fontFamily: LATO }}
      >
        🌿 Free shipping on orders above ₹999 &nbsp;|&nbsp; Use code{" "}
        <span style={{ color: ORANGE, fontWeight: 700 }}>WELCOME20</span>{" "}
        for 20% off
      </div>
      <Navbar isLoggedIn={session?.loggedIn || false} name={session?.email || null} />
    </>
  );
};

export default Header;
