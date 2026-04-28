"use server";
import { getSession } from "@/lib/auth";
import { BROWN, LATO, ORANGE } from "@/lib/helper";
// import Navbar from "./navbar";
import NewNavbar from "./new-navbar";

const Header = async () => {
  const session = await getSession();
  return (
    <>
      {/* Announcement bar */}
      <div
        className="w-full overflow-hidden py-2 text-xs md:text-sm"
        style={{ background: BROWN, color: "#fff", fontFamily: LATO }}
      >
        <div className="marquee">
          <div className="marquee-content">
            {/* ORIGINAL */}
            <span>🌿 Free shipping on orders above ₹999</span>
            <span>
              Use code{" "}
              <span style={{ color: ORANGE, fontWeight: 700 }}>WELCOME20</span>{" "}
              for 20% off
            </span>
            <span>✨ Pure Bilona Ghee | No Preservatives</span>

            {/* DUPLICATE (IMPORTANT) */}
            <span>🌿 Free shipping on orders above ₹999</span>
            <span>
              Use code{" "}
              <span style={{ color: ORANGE, fontWeight: 700 }}>WELCOME20</span>{" "}
              for 20% off
            </span>
            <span>✨ Pure Bilona Ghee | No Preservatives</span>

            <span>🌿 Free shipping on orders above ₹999</span>
            <span>
              Use code{" "}
              <span style={{ color: ORANGE, fontWeight: 700 }}>WELCOME20</span>{" "}
              for 20% off
            </span>
            <span>✨ Pure Bilona Ghee | No Preservatives</span>

            <span>🌿 Free shipping on orders above ₹999</span>
            <span>
              Use code{" "}
              <span style={{ color: ORANGE, fontWeight: 700 }}>WELCOME20</span>{" "}
              for 20% off
            </span>
            <span>✨ Pure Bilona Ghee | No Preservatives</span>
          </div>
        </div>
      </div>
      {/* <Navbar isLoggedIn={session?.loggedIn || false} name={session?.email || null} /> */}
      <NewNavbar
        isLoggedIn={session?.loggedIn || false}
        name={session?.email || null}
      />
    </>
  );
};

export default Header;
