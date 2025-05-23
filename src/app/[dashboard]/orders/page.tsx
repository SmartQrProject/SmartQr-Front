import FooterAdmin from "@/components/adminComponents/footer/Footer";
import MenuAdmin from "@/components/adminComponents/menudesplegabe/MenuAdmin";
import NavbarAdmin from "@/components/adminComponents/navbar/NavbarAdmin";
import OrderCardList from "@/components/staffComponents/orders/OrderCardList";

const OrdersPage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <NavbarAdmin />
            <div className="flex flex-1">
                <MenuAdmin />
                <main className="flex-1 p-4">
                    <OrderCardList />
                </main>
            </div>
            <FooterAdmin />
        </div>
    );
};

export default OrdersPage;
