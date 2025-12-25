"use client";

import { PlusIcon, ShareNetworkIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { AddContentDialog } from "./add-content-dialog";
import ShareBrainDialog from "./share-brain-dialog";

const NavBar = () => {
  return (
    <div className="flex justify-between items-center">
      <header>Notes</header>
      <div className="space-x-4">
        {/* Share Brain Dialog  */}
        <Dialog>
          <DialogTrigger
            render={
              <Button variant="link" className="border-2 bg-secondary">
                <ShareNetworkIcon />
                <span>Share Brain</span>
              </Button>
            }
          />
          <ShareBrainDialog />
        </Dialog>
        <Dialog>
          <DialogTrigger
            render={
              <Button>
                <PlusIcon />
                <span>Add Content</span>
              </Button>
            }
          />
          <AddContentDialog />
        </Dialog>
      </div>
    </div>
  );
};

export default NavBar;
