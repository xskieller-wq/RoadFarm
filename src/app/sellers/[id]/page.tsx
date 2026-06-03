import SellerProfileContent from "./SellerProfileContent";

export default async function SellerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SellerProfileContent id={id} />;
}
