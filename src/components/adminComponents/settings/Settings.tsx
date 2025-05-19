"use client"
import { useAuth } from '@/app/(admin)/login/adminLoginContext';

import React from 'react'

const Settings = () => {

    const { user } = useAuth();
    const token = user?.token;
    const restaurantSlug = user?.payload.slug

    return (

        <>
            <div>Settings</div>

        
        </>
    )
}

export default Settings