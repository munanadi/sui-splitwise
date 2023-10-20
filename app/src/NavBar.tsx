import { ConnectButton } from "@mysten/dapp-kit";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

function NavBar() {
  return (
    <div className="flex sticky px-4 py-2 justify-between border-b-2 border-b-gray-400">
      <div className="flex items-center gap-4">
        <Link to="/">
          <h1>Sui Splitwise</h1>
        </Link>

        <NavigationMenu className="">
          <NavigationMenuList className="flex gap-4">
            <Link to={"/about"}>
              <NavigationMenuItem>About</NavigationMenuItem>
            </Link>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div>
        <ConnectButton />
      </div>
    </div>
  );
}

export default NavBar;
