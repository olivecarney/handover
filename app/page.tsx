import { getContent } from "@/lib/content";
import AgencyLayout from "@/components/AgencyLayout";

export default async function Home() {
  const content = await getContent();

  return <AgencyLayout content={content} />;
}
