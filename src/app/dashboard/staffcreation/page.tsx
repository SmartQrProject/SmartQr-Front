import FooterAdmin from "@/components/adminComponents/footer/Footer";
import MenuAdmin from "@/components/adminComponents/menuLateral/MenuAdmin";
import NavbarAdmin from "@/components/adminComponents/navbar/NavbarAdmin";
import CreateStaff from "@/components/adminComponents/createstaff/CreateStaff";



const StaffCreation = () => {


    return (
        <div className="min-h-screen flex flex-col mx-auto">
            <NavbarAdmin />
            <div className="flex flex-1 flex-col gap-6 md:flex-row lg:gap-4 ">
                <MenuAdmin />

                <CreateStaff/>

            </div>
            <FooterAdmin />
        </div>
     );
 };

export default StaffCreation;

