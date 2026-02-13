import { StyleDetailPage } from "@/views/style-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StyleDetailPage id={id} />;
}
