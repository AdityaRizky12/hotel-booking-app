import Image from "next/image"
import Link from "next/link"
import Navlink from "@/components/navbar/navlink"

const Navbar = () => {
  return (
    <div className="fixed top-0 w-full bg-white border-b z-20">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3">

        {/* LOGO */}
        <Link href="/">
          <Image
            src="/logo.png"
            width={120}
            height={40}
            alt="logo"
            priority
          />
        </Link>

        {/* NAV */}
        <Navlink />
      </div>
    </div>
  )
}

export default Navbar;