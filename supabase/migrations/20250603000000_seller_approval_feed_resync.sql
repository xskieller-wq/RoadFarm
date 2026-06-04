-- Re-sync products into home_feed_items when a seller is approved
CREATE OR REPLACE FUNCTION public.resync_seller_products_feed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.approval_status = 'approved'
     AND (TG_OP = 'INSERT' OR OLD.approval_status IS DISTINCT FROM 'approved') THEN
    UPDATE public.products
    SET updated_at = NOW()
    WHERE seller_id = NEW.id AND NOT sold;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sellers_approval_feed_resync ON public.sellers;
CREATE TRIGGER sellers_approval_feed_resync
  AFTER INSERT OR UPDATE OF approval_status ON public.sellers
  FOR EACH ROW
  EXECUTE FUNCTION public.resync_seller_products_feed();
