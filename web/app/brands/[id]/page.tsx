import { BrandFormPage } from "@/views/brand-form";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BrandFormPage id={id} />;
}
