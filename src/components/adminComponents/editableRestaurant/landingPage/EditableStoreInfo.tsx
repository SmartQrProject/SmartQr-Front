import React, { useState } from "react";
import { XIcon } from "lucide-react";
import toast from "react-hot-toast";
import { IRestaurant } from "@/types";
import AddressInput from "../../maps/AddressInput";
import { CompleteRestaurantsSchema } from "../../menu/menuHelpers/schemas/storeInfoSchema";

type StoreInfoModalProps = {
    restaurant: IRestaurant;
    open: boolean;
    onClose: () => void;
};

const EditableStoreInfoModal = ({ restaurant, open, onClose }: StoreInfoModalProps) => {
    const [name, setName] = useState(restaurant.name || "");
    const [tags, setTags] = useState(restaurant.tags?.map((tag) => tag.trim()).join(", ") || "");
    const [description, setDescription] = useState(restaurant.description || "");
    const [phone, setPhone] = useState(restaurant.phone || "");

    const [showTradingHours, setShowTradingHours] = useState(!!restaurant.trading_hours);
    const [showOrderingTimes, setShowOrderingTimes] = useState(!!restaurant.ordering_times);

    const [monOpen, setMonOpen] = useState(restaurant.trading_hours?.mondayToFriday?.open || "");
    const [monClose, setMonClose] = useState(restaurant.trading_hours?.mondayToFriday?.close || "");

    const [address, setAddress] = useState(restaurant.address || "");
    const [latitude, setLatitude] = useState(restaurant.latitude || null);
    const [longitude, setLongitude] = useState(restaurant.longitude || null);

    const [satOpen, setSatOpen] = useState(restaurant.trading_hours?.saturday?.open || "");
    const [satClose, setSatClose] = useState(restaurant.trading_hours?.saturday?.close || "");
    const [sunOpen, setSunOpen] = useState(restaurant.trading_hours?.sunday?.open || "");
    const [sunClose, setSunClose] = useState(restaurant.trading_hours?.sunday?.close || "");

    const [pickup, setPickup] = useState(restaurant.ordering_times?.pickup || "");
    const [dinein, setDinein] = useState(restaurant.ordering_times?.dinein || "");

    const handleUpdateEditable = async () => {
        try {
            const sessionRaw = localStorage.getItem("adminSession");
            if (!sessionRaw) throw new Error("No session found");

            const session = JSON.parse(sessionRaw);
            const token = session.token;
            const slug = restaurant.slug;

            const tagArray = tags
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag !== "");

            const payload: any = {
                name: name.trim(),
                slug,
                address: address || undefined,
                phone: phone.trim() || undefined,
                description: description.trim() || undefined,
                tags: tagArray.length > 0 ? tagArray : undefined,
                latitude: latitude ?? undefined,
                longitude: longitude ?? undefined,
                trading_hours: showTradingHours
                    ? {
                        mondayToFriday: { open: monOpen, close: monClose },
                        saturday: { open: satOpen, close: satClose },
                        sunday: { open: sunOpen, close: sunClose },
                    }
                    : undefined,
                ordering_times: showOrderingTimes
                    ? {
                        pickup,
                        dinein,
                    }
                    : undefined,
            };

            // Validación Zod parcial (omite campos que no se modifican aquí)
            const validatedPayload = CompleteRestaurantsSchema.partial({
                owner_pass: true,
                owner_name: true,
                owner_email: true,
                isTrial: true,
                is_active: true,
                banner: true,
            }).parse(payload);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurants/${slug}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(validatedPayload),
            });

            if (!res.ok) throw new Error("Failed to update restaurant");

            toast.success("Store info updated");
            onClose();
        } catch (error: any) {
            console.error("Error updating store info:", error);
            toast.error(error?.message || "Failed to update store");
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24  overflow-y-auto">
            <div className="relative w-full max-w-xl rounded-xl p-6 mx-4 bg-white border shadow-lg overflow-y-auto">
                <div className="absolute top-3 right-3 flex gap-2">
                    <button onClick={onClose} className="text-gray-900 hover:text-red-500 cursor-pointer" aria-label="Close">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                <span className="text-xl font-bold mb-4">Edit Store Info</span>

                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1 flex flex-col">
                        <label className="text-md font-semibold mt-8 m-2">Address</label>
                        <AddressInput
                            onSelect={(selectedAddress, coords) => {
                                setAddress(selectedAddress);
                                setLongitude(coords[0]);
                                setLatitude(coords[1]);
                            }}
                        />
                        {address && (
                            <p className="text-sm text-gray-700 mt-1">
                                Seleccionado: <span className="font-light">{address}</span>
                            </p>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col space-y-4">
                        <div>
                            <label className="text-md font-semibold mr-4">Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input bg-gray-300 p-2 rounded-md" />
                        </div>

                        <div className="flex flex-col w-full max-w-xl">
                            <label className="text-md font-semibold mr-4">Tags</label>
                            <textarea
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="Separate tags with commas, e.g. Italian, Pizza, Vegan"
                                className="w-full p-2 rounded-md min-h-[100px] resize-none bg-gray-300 text-sm"
                            />
                        </div>

                        <div className="flex flex-col w-full max-w-xl">
                            <label className="text-md font-semibold mb-2">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="text-sm w-full p-2 rounded-md min-h-[100px] resize-none bg-gray-300 "
                            />
                        </div>

                        <div>
                            <label className="text-md font-semibold mr-4">Phone</label>
                            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="input bg-gray-300 p-2 rounded-md text-sm" />
                        </div>

                        <div className="flex items-center gap-2 mt-4">
                            <input type="checkbox" id="toggleTradingHours" checked={showTradingHours} onChange={() => setShowTradingHours(!showTradingHours)} />
                            <label htmlFor="toggleTradingHours" className="text-md font-semibold">
                                Show Trading Hours
                            </label>
                        </div>

                        {showTradingHours && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-md font-semibold mb-2">Mon-Fri</label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-600 mb-1">Open</span>
                                            <input type="time" value={monOpen} onChange={(e) => setMonOpen(e.target.value)} className="bg-gray-200 p-2 rounded-md text-sm" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-600 mb-1">Close</span>
                                            <input type="time" value={monClose} onChange={(e) => setMonClose(e.target.value)} className="bg-gray-200 p-2 rounded-md text-sm" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-md font-semibold mb-2">Saturday</label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-600 mb-1">Open</span>
                                            <input type="time" value={satOpen} onChange={(e) => setSatOpen(e.target.value)} className="bg-gray-200 p-2 rounded-md text-sm" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-600 mb-1">Close</span>
                                            <input type="time" value={satClose} onChange={(e) => setSatClose(e.target.value)} className="bg-gray-200 p-2 rounded-md text-sm" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-md font-semibold mb-2">Sunday</label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-600 mb-1">Open</span>
                                            <input type="time" value={sunOpen} onChange={(e) => setSunOpen(e.target.value)} className="bg-gray-200 p-2 rounded-md text-sm" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-600 mb-1">Close</span>
                                            <input type="time" value={sunClose} onChange={(e) => setSunClose(e.target.value)} className="bg-gray-200 p-2 rounded-md text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="toggleOrderingTimes" checked={showOrderingTimes} onChange={() => setShowOrderingTimes(!showOrderingTimes)} />
                            <label htmlFor="toggleOrderingTimes" className="text-md font-semibold">
                                Show Ordering Times
                            </label>
                        </div>

                        {showOrderingTimes && (
                            <>
                                <div className="mb-4 mt-4">
                                    <label className="block text-md font-semibold mb-2">Pickup Time (min)</label>
                                    <input type="number" value={pickup} onChange={(e) => setPickup(e.target.value)} className="bg-gray-200 p-2 rounded-md text-sm w-32" />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-md font-semibold mb-2">Dine-in Time (min)</label>
                                    <input type="number" value={dinein} onChange={(e) => setDinein(e.target.value)} className="bg-gray-200 p-2 rounded-md text-sm w-32" />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                    <button onClick={handleUpdateEditable} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save</button>
                </div>
            </div>
        </div>
    );
};

export default EditableStoreInfoModal;
