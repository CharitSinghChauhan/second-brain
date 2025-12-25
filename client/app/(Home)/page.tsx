
import ContentCard from "@/components/content-card";
import NavBar from "@/components/navbar";

export default function Page() {
  return (
    <div className="px-8">
      <NavBar />
      <div className="grid grid-cols-4 ">
        {Array(20)
          .fill(0)
          .map((_, index) => (
            <ContentCard key={index} />
          ))}
      </div>
    </div>
  );
}
