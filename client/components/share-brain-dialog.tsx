import { CopyIcon } from "@phosphor-icons/react";
import { Button } from "./ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { CopyButton } from "./animate-ui/components/buttons/copy";

const ShareBrainDialog = () => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Share Brain</DialogTitle>
        <DialogDescription>Share you brain with anyone</DialogDescription>
      </DialogHeader>
      <div className="flex justify-between items-center gap-2">
        <Input
          id="link"
          defaultValue="https://ui.shadcn.com/docs/installation"
          readOnly
        />
        <CopyButton
          content="https://ui.shadcn.com/docs/installation"
          variant={`default`}
        />
      </div>
      <DialogFooter className="sm:justify-start">
        <DialogClose render={<Button type="button" variant="secondary" />}>
          Close
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

export default ShareBrainDialog;
