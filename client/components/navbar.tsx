"use client";

import { PlusIcon, ShareNetworkIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { AddContentDialog } from "./add-content-dialog";
import ShareBrainDialog from "./share-brain-dialog";
import { useState } from "react";

const NavBar = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex justify-between items-center">
      <header>Notes</header>
      <div className="space-x-4">
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon />
            <span>Add Content</span>
          </Button>
          <AddContentDialog
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />
        </Dialog>
      </div>
    </div>
  );
};

export default NavBar;
