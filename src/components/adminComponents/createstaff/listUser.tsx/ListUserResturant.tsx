'use client';

import { IUserStaff } from '@/types';
import { deleteUser } from '../form/fectchUsers';
import { useState } from 'react';
import ConfirmDialog from '../../menu/menuHelpers/confirm/confirmDialog';

type Props = {
  users: IUserStaff[];
  refreshUsers: () => void;
};

const ListUserResturant = ({ users, refreshUsers }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const openConfirmDialog = (id: string) => {
  setSelectedUserId(id);
  setIsDialogOpen(true);
};

  const handleConfirmDelete = async () => {
  if (!selectedUserId) return;

  const storedData = localStorage.getItem("adminSession");
  if (!storedData) return;

  const parsed = JSON.parse(storedData);
  const token = parsed.token;
  const slug = parsed.payload?.slug;

  if (!token || !slug) return;

  try {
    await deleteUser(slug, selectedUserId, token);
    refreshUsers(); 
  } catch (err: any) {
    setError(err.message || "Failed to delete user");
  } finally {
    setIsDialogOpen(false);
    setSelectedUserId(null);
  }
};

  return (
    <div className="space-y-4 w-full max-w-md p-6 rounded-md bg-neutral-100 shadow mx-auto mb-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-[#4f89f5]">
        User List
      </h2>

      {error && <p className="text-red-500">{error}</p>}

      {users.length > 0 ? (
        <ul className="space-y-3">
          {users.map((user) => (
            <li
              key={user.id}
              className="bg-white rounded-xl shadow flex items-center justify-between px-3 py-2"
            >
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-400">Phone: {user.phone}</p>
                <p className="text-sm text-gray-400 italic">{user.role}</p>
              </div>
              <button onClick={() => openConfirmDialog(user.id)} className="text-red-500 hover:text-red-700 font-bold text-sm">Delete</button>
              
              <ConfirmDialog isOpen={isDialogOpen} title="Confirm Deletion" message="Are you sure you want to delete this user?" onConfirm={handleConfirmDelete} onCancel={() => { setIsDialogOpen(false); setSelectedUserId(null); }}/>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center font-medium">No users found</p>
      )}
    </div>
  );
};

export default ListUserResturant;
