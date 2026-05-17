"use client";

import React, { useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { db } from "@/firebase/firebase.config";
import {
  addDoc,
  collection,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

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

const CreateForm = () => {

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    capacity: "",
    price: "",
    amenities: [] as string[],
  });

  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
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
          ? prev.amenities.filter(
              (item) => item !== value
            )
          : [...prev.amenities, value],
      };

    });

  };


  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

   
    if (selectedFile.size > 4 * 1024 * 1024) {

      toast.error("Max image size is 4MB");

      return;

    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/svg+xml",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {

      toast.error("Invalid image type");

      return;

    }

    setFile(selectedFile);

    toast.success("Image selected!");

  };


  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      setLoading(true);

      // VALIDATION
      if (
        !form.name ||
        !form.description ||
        !form.capacity ||
        !form.price
      ) {

        toast.error("Please fill all fields");

        return;

      }

      if (!file) {

        toast.error("Please select image");

        return;

      }

      const formData = new FormData();

      formData.append("file", file);

      formData.append(
        "upload_preset",
        process.env
          .NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          process.env
            .NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {

        console.log(data);

        toast.error("Upload image failed");

        return;

      }

      // IMAGE URL
      const imageUrl = data.secure_url;

      // SAVE TO FIRESTORE
      await addDoc(collection(db, "rooms"), {
        ...form,
        capacity: Number(form.capacity),
        price: Number(form.price),
        image: imageUrl,
        createdAt: new Date(),
      });

      toast.success(
        "Room created successfully!"
      );
       
      router.push("/admin/room");
      
      setForm({
        name: "",
        description: "",
        capacity: "",
        price: "",
        amenities: [],
      });

      setFile(null);

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to create room"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <form
      onSubmit={handleSubmit}
      className="grid md:grid-cols-12 gap-5"
    >

      {/* LEFT */}
      <div className="col-span-8 bg-white p-4 rounded-md shadow-sm">

        {/* ROOM NAME */}
        <div className="mb-4">

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="py-3 px-4 rounded-sm border border-gray-300 w-full outline-none focus:border-orange-400"
            placeholder="Room Name..."
          />

        </div>

        {/* DESCRIPTION */}
        <div className="mb-4">

          <textarea
            name="description"
            rows={8}
            value={form.description}
            onChange={handleChange}
            className="py-3 px-4 rounded-sm border border-gray-300 w-full outline-none focus:border-orange-400"
            placeholder="Description"
          />

        </div>

        {/* AMENITIES */}
        <div className="mb-4">

          <h1 className="text-lg font-semibold mb-4">
            Amenities
          </h1>

          <div className="grid md:grid-cols-2 gap-4">

            {amenitiesList.map((item) => (

              <label
                key={item}
                className="flex items-center gap-2"
              >

                <input
                  type="checkbox"
                  checked={form.amenities.includes(item)}
                  onChange={() =>
                    handleAmenities(item)
                  }
                  className="w-4 h-4"
                />

                <span className="text-sm text-gray-700">
                  {item}
                </span>

              </label>

            ))}

          </div>

        </div>

      </div>

      {/* RIGHT */}
      <div className="col-span-4 bg-white p-4 rounded-md shadow-sm">

        {/* IMAGE */}
        <label
          htmlFor="input-file"
          className="flex flex-col items-center justify-center aspect-video border-2 border-gray-300 border-dashed rounded-md cursor-pointer bg-gray-50 relative overflow-hidden"
        >

          {/* PREVIEW */}
          {file ? (

            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />

          ) : (

            <div className="flex flex-col items-center justify-center text-gray-500 pt-5 pb-6 z-10">

              <IoCloudUploadOutline className="size-8 mb-2" />

              <p className="mb-1 text-sm font-bold">
                Select Image
              </p>

              <p className="text-xs text-center">
                SVG, PNG, JPG, GIF, WEBP
                <br />
                Max: 4MB
              </p>

            </div>

          )}

          <input
            type="file"
            id="input-file"
            className="hidden"
            onChange={handleFileChange}
          />

        </label>

        {/* CAPACITY */}
        <div className="mb-4 mt-4">

          <input
            type="number"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            className="py-3 px-4 rounded-sm border border-gray-300 w-full outline-none focus:border-orange-400"
            placeholder="Capacity..."
          />

        </div>

        {/* PRICE */}
        <div className="mb-4">

          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="py-3 px-4 rounded-sm border border-gray-300 w-full outline-none focus:border-orange-400"
            placeholder="Price..."
          />

        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 text-white w-full hover:bg-orange-700 py-3 px-6 text-lg font-semibold cursor-pointer disabled:opacity-50"
        >

          {loading ? "Saving..." : "Save"}

        </button>

      </div>

    </form>
  );
};

export default CreateForm;