"use client";

type RoomFilterProps = {
  search: string;
  setSearch: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
  amenity: string;
  setAmenity: (value: string) => void;
};

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

const RoomFilter = ({
  search,
  setSearch,
  sort,
  setSort,
  amenity,
  setAmenity,
}: RoomFilterProps) => {
  return (
    <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search room..."
          className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-orange-400"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-orange-400"
        >
          <option value="">Sort by price</option>
          <option value="low">Lowest Price</option>
          <option value="high">Highest Price</option>
        </select>

        <select
          value={amenity}
          onChange={(e) => setAmenity(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-orange-400"
        >
          <option value="">All Amenities</option>
          {amenitiesList.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default RoomFilter;