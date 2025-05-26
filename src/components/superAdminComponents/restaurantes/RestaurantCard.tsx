import React from "react";
import { Switch } from "@headlessui/react";
import { Pencil, Trash2 } from "lucide-react";

export interface RestaurantCardProps {
    id: string;
    slug: string;
    name: string;
    owner_email: string;
    created_at: string;
    is_active: boolean;
    onToggleStatus: (slug: string, currentStatus: boolean) => void;
    onEdit: () => void;
    onDelete: () => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ slug, name, owner_email, created_at, is_active, onToggleStatus, onEdit, onDelete }) => {
    return (
        <tr className="bg-white hover:bg-gray-50 transition">
            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{name}</td>
            <td className="px-6 py-4 flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${is_active ? "bg-green-500" : "bg-gray-400"}`} />
                <span className="text-sm">{is_active ? "Active" : "Inactive"}</span>
                <Switch
                    checked={is_active}
                    onChange={() => onToggleStatus(slug, is_active)}
                    className={`${is_active ? "bg-indigo-600" : "bg-gray-300"} relative inline-flex h-5 w-10 items-center rounded-full ml-2 transition-colors duration-200`}
                >
                    <span className="sr-only">Toggle status</span>
                    <span className={`${is_active ? "translate-x-5" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">{owner_email}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{new Date(created_at).toLocaleDateString()}</td>
            <td className="px-6 py-4 flex gap-3">
                <button onClick={onEdit} className="p-1 rounded-full hover:bg-gray-100">
                    <Pencil className="w-4 h-4 text-gray-500" />
                </button>
                <button onClick={onDelete} className="p-1 rounded-full hover:bg-gray-100">
                    <Trash2 className="w-4 h-4 text-red-500" />
                </button>
            </td>
        </tr>
    );
};

export default RestaurantCard;
