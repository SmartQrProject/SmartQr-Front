
import CategorySlug from '@/components/adminComponents/editableRestaurant/landingPage/CategorySlug';
import EditableBannerWidget from '@/components/adminComponents/editableRestaurant/landingPage/EditableBanner'; 
import EditableCategories from '@/components/adminComponents/editableRestaurant/landingPage/EditableCategories';

export default function AdminPreviewPage() {
  
  return (
    <div className="mx-auto">
      <EditableBannerWidget />
      <CategorySlug />
    </div>
  );
}