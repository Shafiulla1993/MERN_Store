import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, profile, fetchProfile, updateProfile, addAddress } =
    useContext(ShopContext);
  const [form, setForm] = useState({ name: "", mobile: "" });
  const [address, setAddress] = useState({ street: "", city: "", pincode: "" });

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  useEffect(() => {
    if (profile) setForm({ name: profile.name, mobile: profile.mobile || "" });
  }, [profile]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateProfile(form);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!address.street) return toast.error("Enter full address");
    await addAddress(address);
    setAddress({ street: "", city: "", pincode: "" });
  };

  if (!user)
    return (
      <div className="p-10 text-center text-gray-500">
        Please log in to view your profile.
      </div>
    );

  return (
    <div className="max-w-3xl p-6 mx-auto mt-10 bg-white rounded-lg shadow">
      <h2 className="mb-6 text-2xl font-semibold">My Profile</h2>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-600">Name</label>
          <input
            className="w-full px-3 py-2 border rounded-md"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-600">Mobile</label>
          <input
            className="w-full px-3 py-2 border rounded-md"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 text-white bg-black rounded-md hover:bg-gray-800"
        >
          Save Changes
        </button>
      </form>

      <hr className="my-8" />

      <h3 className="mb-4 text-xl font-medium">Addresses</h3>
      <ul className="mb-6 space-y-2 text-gray-700">
        {profile?.addresses?.length ? (
          profile.addresses.map((addr, i) => (
            <li
              key={i}
              className="p-3 border rounded-md bg-gray-50"
            >{`${addr.street}, ${addr.city}, ${addr.pincode}`}</li>
          ))
        ) : (
          <p>No saved addresses.</p>
        )}
      </ul>

      <form
        onSubmit={handleAddAddress}
        className="grid grid-cols-1 gap-3 md:grid-cols-3"
      >
        <input
          placeholder="Street"
          className="p-2 border rounded-md"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
        />
        <input
          placeholder="City"
          className="p-2 border rounded-md"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
        />
        <input
          placeholder="Pincode"
          className="p-2 border rounded-md"
          value={address.pincode}
          onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
        />
        <button
          type="submit"
          className="col-span-1 px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800 md:col-span-3"
        >
          Add Address
        </button>
      </form>
    </div>
  );
};

export default Profile;
