import { bottombarLinks } from "@/constants";
import {Link,useLocation} from "react-router-dom"

const Bottombar = () => {

  const {pathname}=useLocation()

  const listBottomlinks=bottombarLinks.map((link) => {
    const isActive = pathname === link.route;

    return (
        <Link
        key={link.label}
        to={link.route}
        className={`flex-center flex-col gap-1 p-3 ${
          isActive && "bg-primary-500  rounded-[10px]  "
        }`}   
        >
          <img
            src={link.imgURL}
            alt={link.label}
            width={16}
            height={16}
            className={`${isActive && "invert-white transition"}`}
          />
          <p className="tiny-medium text-light-2">{link.label}</p>
        </Link>
    );
  })

  return (
    <section
    className="bottom-bar"
    >
       {listBottomlinks}
    </section>
  )
}

export default Bottombar