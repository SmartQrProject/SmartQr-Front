import CategorySlug from '@/components/adminComponents/editableRestaurant/landingPage/CategorySlug';
import EditableBanner from '@/components/adminComponents/editableRestaurant/landingPage/EditableBanner';

export default function AdminPreviewPage() {
  return (
    <div className="mx-auto">
      <EditableBanner />
      <CategorySlug/>
      
    </div>
  );
}