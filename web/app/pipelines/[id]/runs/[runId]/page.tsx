import { PipelineRunPage } from "@/views/pipeline-run";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; runId: string }>;
}) {
  const { id, runId } = await params;
  return <PipelineRunPage pipelineId={id} runId={runId} />;
}
