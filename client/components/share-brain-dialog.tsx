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
import { api } from "@/axios/axios";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const ShareBrainDialog = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleShareablebrain = async () => {
      setLoading(true);
      try {
        const response = (await api.get("/brain")).data;

        if(!response.success) {
          throw new Error("Failed to generate shareable link");
        }

        if (response.payload.shareableLink) {
          const shareUrl = `${window.location.origin}/brain/${response.payload.shareableLink}/share`;
          setUrl(shareUrl);
        }
      } catch (error) {
        console.error(error);
        toast.error("Error occurred while generating shareable link");
      } finally {
        setLoading(false);
      }
    };

    handleShareablebrain();
  }, []);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Share Brain</DialogTitle>
        <DialogDescription>Share your brain with anyone</DialogDescription>
      </DialogHeader>
      <div className="flex justify-between items-center gap-2">
        <Input
          id="link"
          value={url}
          readOnly
          placeholder={loading ? "Generating link..." : "Shareable link"}
        />
        <CopyButton content={url} variant={`default`} />
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
