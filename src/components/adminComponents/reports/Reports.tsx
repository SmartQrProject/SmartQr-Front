'use client'

import { useAuth } from '@/app/(admin)/login/adminLoginContext';
import React from 'react'

const Reports = () => {
    
    const { user } = useAuth();
    const token = user?.token;
    


    return (

        <>
        
            <div>Reports</div>
        
        </>
    )
}

export default Reports