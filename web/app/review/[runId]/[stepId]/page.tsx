import { ReviewDetailPage } from "@/views/review-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ runId: string; stepId: string }>;
}) {
  const { runId, stepId } = await params;
  return <ReviewDetailPage runId={runId} stepId={stepId} />;
}
