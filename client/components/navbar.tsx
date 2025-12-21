"use client";

import { PlusIcon, ShareNetworkIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "./ui/button";
import { useFormStore } from "@/store/store";

const NavBar = () => {
  const { open, isOpen } = useFormStore();

  const handleFormOpen = () => {
    open();
    console.log('hello')
  };

  return (
    <div className="flex justify-between items-center px-4">
      <header>Notes</header>
      <div className="space-x-4">
        <Button variant={`link`} className={`border-2 bg-secondary`}>
          <ShareNetworkIcon />
          <span>Share Brain</span>
        </Button>
        <Button onClick={handleFormOpen}>
          <PlusIcon />
          <span>Add Content</span>
        </Button>
      </div>
    </div>
  );
};

export default NavBar;
