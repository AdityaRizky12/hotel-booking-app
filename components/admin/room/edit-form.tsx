"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase.config";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

const amenitiesList = [
  "Free Wifi",
  "Swimming Pool",
  "Bar",
  "Free Breakfast",
  "Restaurant",
  "Free Parking",
  "Fitness Room",
  "Room Service",
  "Non Smoking Room",
];

const EditForm = () => {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    capacity: "",
    price: "",
    image: "",
    amenities: [] as string[],
  });

  useEffect(() => {
    const getRoom = async () => {
      try {
        const docRef = doc(db, "rooms", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setForm({
            name: data.name || "",
            description: data.description || "",
            capacity: String(data.capacity || ""),
            price: String(data.price || ""),
            image: data.image || "",
            amenities: data.amenities || [],
          });
        } else {
          toast.error("Room not found");
          router.push("/admin/room");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load room");
      } finally {
        setLoading(false);
      }
    };

    if (id) getRoom();
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleAmenities = (value: string) => {
    setForm((prev) => {
      const exists = prev.amenities.includes(value);

      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((item) => item !== value)
          : [...prev.amenities, value],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setUpdating(true);

      if (!form.name || !form.description || !form.capacity || !form.price) {
        toast.error("Please fill all fields");
        return;
      }

      await updateDoc(doc(db, "rooms", id as string), {
        name: form.name,
        description: form.description,
        capacity: Number(form.capacity),
        price: Number(form.price),
        amenities: form.amenities,
        updatedAt: new Date(),
      });

      toast.success("Room updated successfully!");
      router.push("/admin/room");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update room");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <p className="mt-5">Loading room...</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-3xl font-bold mb-6">Edit Room</h1>

      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-8 bg-white p-5 rounded-md shadow-sm">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Room Name"
            className="w-full border border-gray-300 rounded-md px-4 py-3 mb-5 outline-none focus:border-orange-400"
          />

          <textarea
            name="description"
            rows={9}
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border border-gray-300 rounded-md px-4 py-3 mb-6 outline-none focus:border-orange-400"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {amenitiesList.map((item) => (
              <label key={item} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.amenities.includes(item)}
                  onChange={() => handleAmenities(item)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700">
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="md:col-span-4 bg-white p-5 rounded-md shadow-sm">
          {form.image && (
            <img
              src={form.image}
              alt={form.name}
              className="w-full h-56 object-cover rounded-md mb-5"
            />
          )}

          <input
            type="number"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            placeholder="Capacity"
            className="w-full border border-gray-300 rounded-md px-4 py-3 mb-5 outline-none focus:border-orange-400"
          />

          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full border border-gray-300 rounded-md px-4 py-3 mb-5 outline-none focus:border-orange-400"
          />

          <button
            type="submit"
            disabled={updating}
            className="bg-orange-500 hover:bg-orange-600 text-white w-full py-3 rounded-md font-semibold disabled:opacity-50"
          >
            {updating ? "Updating..." : "Update"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/room")}
            className="mt-3 border border-gray-300 text-gray-700 w-full py-3 rounded-md font-semibold hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditForm;