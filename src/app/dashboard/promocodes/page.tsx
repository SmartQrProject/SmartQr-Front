import MenuAdmin from '@/components/adminComponents/menudesplegabe/MenuAdmin'
import NavbarAdmin from '@/components/adminComponents/navbar/NavbarAdmin'
import PromoCodesContainer from '@/components/adminComponents/promoCodes/PromoCodesContainer'
import PromoCodeForm from '@/components/adminComponents/promoCodes/PromoCodesForm'
import Footer from '@/components/subscribers/footer/Footer'
import React from 'react'

const promoCodes = () => {
  return (
   <div className="flex flex-col min-h-screen">
      <NavbarAdmin />
      <div className="flex flex-1">
          <MenuAdmin />
          <main className="flex flex-1 items-center justify-center p-6 bg-gray-50">
          <PromoCodesContainer />

        </main>
     </div>

      <Footer />
    </div>
  )
}

export default promoCodes


// 'use client'
// import FooterAdmin from '@/components/adminComponents/footer/Footer'
// import MenuAdmin from '@/components/adminComponents/menudesplegabe/MenuAdmin'
// import NavbarAdmin from '@/components/adminComponents/navbar/NavbarAdmin'
// import PromoCodesList from '@/components/adminComponents/promoCodes/ListPromoCode'

// import PromoCodeForm from '@/components/adminComponents/promoCodes/PromoCodesForm'
// import React, { useState } from 'react'

// const promoCodes = () => {
//   const [refresh, setRefresh] = useState(0);

//   const handleRefresh = () => {
//     setRefresh((prev) => prev + 1);
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//             <NavbarAdmin />
//             <div className="flex flex-1">
//                 <MenuAdmin />
//                 <main className="flex-1 p-4 max-w-3xl mx-auto bg-white shadow rounded-md">
  
//       <h1 className="text-2xl font-bold mb-4">Promo Codes Management</h1>
//       <PromoCodeForm onCodeCreated={handleRefresh} />
//       <PromoCodesList refreshTrigger={refresh} />
//        </main>
//             </div>
//             <FooterAdmin />
//         </div>
//   );
// };
  
// export default promoCodes
