"use client"
import { AddContentDialog } from "@/components/add-content-dialog";
import NavBar from "@/components/navbar";

export default function Page() {

  return (
    <div>
      <div>
        <NavBar />
          <AddContentDialog />
      </div>
    </div>
  );
}
