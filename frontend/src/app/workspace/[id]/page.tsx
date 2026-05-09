import { LeftSidebar } from "@/components/LeftSidebar";
import { DiagramWorkspace } from "@/components/DiagramWorkspace";

export default async function DiagramEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <>
      <LeftSidebar />
      <DiagramWorkspace />
    </>
  );
}
