"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShareNetworkIcon, TrashIcon } from "@phosphor-icons/react";
import { Button } from "./ui/button";

interface IContentCard {
  title?: string;
  description?: string;
  link: string;
  tags?: string[];
}

export default function ContentCard({
  title = "Untitled",
  description = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga, quos accusantium! Perferendis temporibus enim error cupiditate rerum est earum vero iste sapiente. Iusto laudantium veniam perferendis fugit autem molestiae porro!",
  link,
  tags,
}: IContentCard) {
  return (
    <Card className="col-span-1 ">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>{title}</CardTitle>
        <Button>
          <TrashIcon />
          <ShareNetworkIcon />
        </Button>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex-col gap-2"></CardFooter>
    </Card>
  );
}
