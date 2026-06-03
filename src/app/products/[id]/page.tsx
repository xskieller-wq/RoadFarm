import ProductDetailContent from "./ProductDetailContent";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductDetailContent id={id} />;
}
