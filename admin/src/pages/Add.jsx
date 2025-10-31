import React, { useState, useEffect } from "react";
import { addProduct } from "../api/productApi";
import { listCategories, getSubcategorySizes } from "../api/categoryApi";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(""); // category.name
  const [subCategory, setSubCategory] = useState(""); // subcategory.name
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState([]); // selected sizes for this product
  const [availableSizes, setAvailableSizes] = useState([]); // fetched from backend
  const [bestSeller, setBestSeller] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🟢 Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await listCategories();
        if (data.success) {
          setCategories(data.categories);
        } else {
          toast.error(data.message || "Failed to load categories");
        }
      } catch (error) {
        console.error("fetchCategories error:", error);
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  // 🟢 When category changes → set subcategories
  useEffect(() => {
    const selected = categories.find((cat) => cat.name === category);
    setSubCategories(selected?.subCategories || []);
    setSubCategory("");
    setSizes([]);
    setAvailableSizes([]);
  }, [category, categories]);

  // 🟢 When subcategory changes → fetch sizes from backend
  useEffect(() => {
    const fetchSizes = async () => {
      if (!category || !subCategory) {
        setAvailableSizes([]);
        setSizes([]);
        return;
      }

      try {
        const selectedCategory = categories.find((c) => c.name === category);
        if (!selectedCategory) return;

        const { data } = await getSubcategorySizes(
          selectedCategory._id,
          subCategory
        );
        if (data.success) {
          setAvailableSizes(data.sizes || []);
        } else {
          toast.error(data.message || "Failed to fetch sizes");
          setAvailableSizes([]);
        }
      } catch (error) {
        console.error("Error fetching sizes:", error);
        toast.error("Failed to fetch sizes");
        setAvailableSizes([]);
      }
    };

    fetchSizes();
  }, [subCategory, category, categories]);

  // 🟢 Image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    if (imagePreviews[index]) URL.revokeObjectURL(imagePreviews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => imagePreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [imagePreviews]);

  // 🟢 Form Submit
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !description.trim() ||
      !category ||
      !subCategory ||
      !price
    )
      return toast.error("Please fill all required fields");
    if (images.length === 0)
      return toast.error("Please upload at least one image");
    if (availableSizes.length > 0 && sizes.length === 0)
      return toast.error("Please select at least one size");

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      images.forEach((img) => formData.append("images", img));
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("price", Number(price));
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestSeller", bestSeller);

      const { data } = await addProduct(formData, token);

      if (data.success) {
        toast.success(data.message || "Product added successfully");
        resetForm();
      } else {
        toast.error(data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("addProduct error:", error);
      toast.error("Something went wrong while adding product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImages([]);
    setImagePreviews([]);
    setName("");
    setDescription("");
    setCategory("");
    setSubCategory("");
    setPrice("");
    setSizes([]);
    setBestSeller(false);
    setAvailableSizes([]);
  };

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col gap-5 p-6 w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl"
    >
      <h2 className="text-2xl font-bold mb-3">Add New Product</h2>

      {/* Image Upload */}
      <div>
        <label className="font-semibold block mb-2">Product Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="border p-2 rounded w-full"
        />
        <div className="flex flex-wrap gap-3 mt-3">
          {imagePreviews.map((preview, idx) => (
            <div key={idx} className="relative">
              <img
                src={preview}
                alt={`preview-${idx}`}
                className="w-24 h-24 object-cover border rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded-full"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Product Name */}
      <div>
        <label className="font-semibold block mb-1">Product Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter product name"
          className="border p-2 rounded w-full"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="font-semibold block mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter product description"
          className="border p-2 rounded w-full h-24"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="font-semibold block mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory */}
      <div>
        <label className="font-semibold block mb-1">Subcategory</label>
        <select
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">Select Subcategory</option>
          {subCategories.map((sub, idx) => (
            <option key={idx} value={sub.name}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div>
        <label className="font-semibold block mb-1">Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter price"
          className="border p-2 rounded w-full"
          required
        />
      </div>

      {/* Sizes */}
      <div>
        <label className="font-semibold block mb-2">Available Sizes</label>
        {availableSizes.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No sizes defined for this subcategory.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => toggleSize(size)}
                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                  sizes.includes(size)
                    ? "bg-black text-white border-black"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bestseller */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={bestSeller}
          onChange={() => setBestSeller(!bestSeller)}
        />
        Add to Best Seller
      </label>

      {/* Submit */}
      <button
        type="submit"
        className="px-5 py-2 bg-black text-white rounded hover:bg-gray-900 disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
};

export default Add;
