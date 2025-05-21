import Link from 'next/link';
import React from 'react';

const Sidebar = () => {
  return (

<div className="flex justify-center items-center gap-20 md:w-200 xs:text-xs">

      <Link href={"/dashboard/menu/createcategory"} className="border-b-2 border-transparent hover:border-blue-500 transition duration-300" >Create Category</Link>

      <Link href={"/dashboard/menu/createproduct"} className="border-b-2 border-transparent hover:border-blue-500 transition duration-300" >Create Product</Link>
{/* 
      <Link href={"/dashboard/menu/modifyproduct"} className="border-b-2 border-transparent hover:border-blue-500 transition duration-300" >Modify Product</Link>

      <Link href={"/dashboard/menu/deleteproduct"} className="border-b-2 border-transparent hover:border-blue-500 transition duration-300" >Delete Product</Link> */}

    </div>
  );
}

export default Sidebar