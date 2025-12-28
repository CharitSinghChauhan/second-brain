"use client";

import { api } from "@/axios/axios";
import ContentCard from "@/components/content-card";
import NavBar from "@/components/navbar";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<[] | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);

      try {
        const response = (await api.get("/content")).data;

        if (!response.success) {
          throw new Error(response.error || "Failed to fetch content");
        }

        if (response.payload) {
          console.log(response.payload);
          setContent(response.payload);
        }
      } catch (error) {
        setContent(null);
        toast.error(
          error instanceof Error ? error.message : "Failed to fetch content"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="px-8">
      <NavBar />
      <div className="grid grid-cols-4 ">
        {content?.map(({title, description, contentLink, tags, type}, index) => (
          <ContentCard key={index} title={title} description={description} contentLink={contentLink}  tags={tags} type={type}/>
        ))}
      </div>
    </div>
  );
}
