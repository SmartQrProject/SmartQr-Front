'use client'

import { useEffect, useState } from 'react'
import StaffRegisterForm from '@/components/adminComponents/createstaff/form/StaffRegisterForm'
import ListUserResturantView from '@/components/adminComponents/createstaff/listUser.tsx/ListUserResturant'
import FooterAdmin from '@/components/adminComponents/footer/Footer'
import MenuAdmin from '@/components/adminComponents/menudesplegabe/MenuAdmin'
import NavbarAdmin from '@/components/adminComponents/navbar/NavbarAdmin'
import { IUserStaff } from '@/types'
import { getUsers } from '@/components/adminComponents/createstaff/form/fectchUsers'

const StaffCreation = () => {
  const [users, setUsers] = useState<IUserStaff[]>([])

  const fetchUsers = async () => {
    const session = localStorage.getItem("adminSession")
    if (!session) return

    const parsed = JSON.parse(session)
    const token = parsed.token
    const slug = parsed.payload?.slug

    if (!slug || !token) return

    const response = await getUsers(slug, token)
    setUsers(response.usuarios || [])
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarAdmin />
      <div className="flex flex-1 flex-col lg:flex-row">
        <MenuAdmin />
        <div className="flex-1 p-4">
          <h1 className="text-2xl mb-4">User Creation</h1>

          <div className="flex flex-col lg:flex-row lg:justify-center lg:items-start gap-6">         
            <StaffRegisterForm setUsers={setUsers} />
            <ListUserResturantView users={users} refreshUsers={fetchUsers} />
          
        </div>

        </div>
      </div>
      <FooterAdmin />
    </div>
  )
}

export default StaffCreation


