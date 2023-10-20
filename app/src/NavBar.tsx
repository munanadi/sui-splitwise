import { ConnectButton } from "@mysten/dapp-kit";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <div className="relative text-white">
      <div className="mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
          <div className="lg:w-0 lg:flex-1">
            <a href="#" className="flex">
              <Link to="/">
                <span className="ml-4 font-bold text-xl leading-6  sm:ml-3 dark:text-white">
                  SuiSplit
                </span>
              </Link>
            </a>
          </div>
          <nav className="md:ml-auto flex space-x-10 items-baseline">
            <Link
              to={"/about"}
              className="text-base font-medium  dark:text-white"
            >
              About
            </Link>
            <Link
              to={"/transactions"}
              className="text-base font-medium  dark:text-white"
            >
              Transactions
            </Link>
            <ConnectButton />
          </nav>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
