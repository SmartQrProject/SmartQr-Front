import React, { useState } from "react";
import { Switch } from "@headlessui/react";
import { Pencil, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/confirmModal/confirmDialog";

export interface RestaurantCardProps {
    id: string;
    slug: string;
    name: string;
    owner_email: string;
    owner_name: string;
    created_at: string;
    is_active: boolean;
    onToggleStatus: (slug: string, currentStatus: boolean) => void;
    onEdit: () => void;
    onDelete: () => void;
    isUpdating?: boolean;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ id, slug, name, owner_email, owner_name, created_at, is_active, onToggleStatus, onEdit, onDelete, isUpdating  }) => {
    const [confirmActiveOpen, setConfirmActiveOpen] = useState(false);
    const [pendingToggleSlug, setPendingToggleSlug] = useState<string | null>(null);

      
    const handleConfirm = () => {
        if (pendingToggleSlug) {
            onToggleStatus(pendingToggleSlug, true);
            setPendingToggleSlug(null);
            setConfirmActiveOpen(false);
        }
    };

    const handleCancel = () => {
        setPendingToggleSlug(null);
        setConfirmActiveOpen(false);
        };

    const handleToggle = () => {
        if (is_active) {
            setPendingToggleSlug(slug);
            setConfirmActiveOpen(true);
        } else {
            onToggleStatus(slug, is_active);
            }
        };


    return (
        <>
        <tr className="bg-white hover:bg-gray-50 transition">
            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{name}</td>
            <td className="px-6 py-4 flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${is_active ? "bg-green-500" : "bg-gray-400"}`} />
                <span className="text-sm">{is_active ? "Active" : "Inactive"}</span>
                {isUpdating ? (
                    <div className="ml-2 w-5 h-5 border-2 border-gray-300 border-t-branding-600 rounded-full animate-spin" />
                    ) : (
                    <Switch
                        checked={is_active}
                        onChange={handleToggle}
                        className={`${is_active ? "bg-indigo-600" : "bg-gray-300"} relative inline-flex h-5 w-10 items-center rounded-full ml-2 transition-colors duration-200`}
                    >
                        <span className="sr-only">Toggle status</span>
                        <span className={`${is_active ? "translate-x-5" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                    </Switch>
                )}
            </td>
            <td className="px-6 py-4 text-sm text-gray-700">{owner_name}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{owner_email}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{created_at ? new Date(created_at).toLocaleDateString() : "N/A"}</td>
            <td className="px-6 py-4 flex gap-3">
                <button onClick={onEdit} className="p-1 rounded-full hover:bg-gray-100">
                    <Pencil className="w-4 h-4 text-gray-500" />
                </button>
                <button onClick={onDelete} className="p-1 rounded-full hover:bg-gray-100">
                    <Trash2 className="w-4 h-4 text-red-500" />
                </button>
            </td>
        </tr>
           <ConfirmDialog
                isOpen={confirmActiveOpen}
                title="Deactivate Restaurant"
                message={`Are you sure you want to deactivate the restaurant "${name}"?`}
                onConfirm={handleConfirm}
                onCancel={handleCancel}       
            />

        </>
    );
};

export default RestaurantCard;
