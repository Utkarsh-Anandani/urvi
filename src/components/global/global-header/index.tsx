import { getSession } from "@/lib/auth";
import { Search, Sparkles } from "lucide-react";
// import GlobalSearchBar from "../global-searchbar";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";

const GlobalHeader = async () => {
  const { role } = await getSession();
  return (
    <nav className="border-b">
      <div className="container mx-auto flex items-center space-x-4 justify-between px-4 py-2 sm:px-6 lg:px-8 lg:py-5">
        <div className="flex items-center space-x-20">
          <Link href="/" className="text-3xl font-semibold flex">
            {/* Logo here */}
            <span className="text-main">Urvi</span>
            <span className="text-sub">Tribe</span>
            <Sparkles color="#B8960C" size={18} />
          </Link>
          <NavigationMenu>
            <NavigationMenuList className="gap-4">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-main text-lg font-semibold">Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="#"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Featured Product
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Check out our latest and greatest offering
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="#" title="Product 1">
                      Description for Product 1
                    </ListItem>
                    <ListItem href="#" title="Product 2">
                      Description for Product 2
                    </ListItem>
                    <ListItem href="#" title="Product 3">
                      Description for Product 3
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} bg-transparent text-main text-lg font-semibold`}
                  href="/about"
                >
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} bg-transparent text-main text-lg font-semibold`}
                  href="/contact"
                >
                  Contact
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center space-x-4">
          <form className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="pl-8" />
          </form>
          <Button>Sign In</Button>
        </div>
      </div>
    </nav>
  );
};

export default GlobalHeader;

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
