import React, { useState, useEffect } from "react";
import {
  addCategory,
  addSubCategory,
  listCategories,
  updateSubcategorySizes,
  deleteCategory,
} from "../api/categoryApi";
import { toast } from "react-toastify";

const AddCategory = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [sizeList, setSizeList] = useState([]);
  const [newSize, setNewSize] = useState("");

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data } = await listCategories();
      if (data.success) {
        // Normalize backend data (support both string and object subcategories)
        const normalized = data.categories.map((cat) => ({
          ...cat,
          subCategories: cat.subCategories.map((sub) =>
            typeof sub === "string" ? { name: sub, sizeOptions: [] } : sub
          ),
        }));
        setCategories(normalized);
      }
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ➕ Add main category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return toast.error("Enter category name");
    try {
      const { data } = await addCategory(categoryName);
      if (data.success) {
        toast.success("Category added");
        setCategoryName("");
        fetchCategories();
      } else toast.error(data.message);
    } catch {
      toast.error("Error adding category");
    }
  };

  // ➕ Add subcategory
  const handleAddSubCategory = async (e) => {
    e.preventDefault();
    if (!selectedCategory || !subCategoryName.trim())
      return toast.error("Select category and enter subcategory name");
    try {
      const { data } = await addSubCategory(selectedCategory, subCategoryName);
      if (data.success) {
        toast.success("Subcategory added");
        setSubCategoryName("");
        fetchCategories();
      } else toast.error(data.message);
    } catch {
      toast.error("Error adding subcategory");
    }
  };

  // ➕ Add size to subcategory
  const handleAddSize = () => {
    if (!newSize.trim()) return toast.error("Enter size name");
    if (sizeList.includes(newSize.trim()))
      return toast.error("Size already exists");
    setSizeList([...sizeList, newSize.trim()]);
    setNewSize("");
  };

  // 💾 Save subcategory sizes
  const handleSaveSizes = async () => {
    if (!selectedCategory || !selectedSubcategory)
      return toast.error("Select category & subcategory");
    try {
      const { data } = await updateSubcategorySizes(
        selectedCategory,
        selectedSubcategory,
        sizeList
      );
      if (data.success) {
        toast.success("Sizes updated");
        fetchCategories();
      } else toast.error(data.message);
    } catch {
      toast.error("Error updating sizes");
    }
  };

  // 🗑 Delete category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      const { data } = await deleteCategory(id);
      if (data.success) {
        toast.success("Category deleted");
        fetchCategories();
      } else toast.error(data.message);
    } catch {
      toast.error("Error deleting category");
    }
  };

  // 🧠 Load sizes when subcategory selected
  useEffect(() => {
    if (!selectedCategory || !selectedSubcategory) {
      setSizeList([]);
      return;
    }
    const cat = categories.find((c) => c._id === selectedCategory);
    const sub = cat?.subCategories.find((s) => s.name === selectedSubcategory);
    setSizeList(sub?.sizeOptions || []);
  }, [selectedSubcategory, selectedCategory]);

  return (
    <div className="flex flex-col gap-5 p-5 w-full">
      <h2 className="text-2xl font-bold">Manage Categories</h2>

      {/* 🟢 Add Category */}
      <form onSubmit={handleAddCategory} className="flex flex-col gap-3">
        <h3 className="font-semibold">Add New Category</h3>
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Enter Category Name"
          className="border p-2 rounded"
          required
        />
        <button className="px-5 py-2 bg-black text-white rounded hover:bg-gray-800">
          Add Category
        </button>
      </form>

      <hr className="my-4" />

      {/* 🟢 Add Subcategory */}
      <form onSubmit={handleAddSubCategory} className="flex flex-col gap-3">
        <h3 className="font-semibold">Add Subcategory</h3>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={subCategoryName}
          onChange={(e) => setSubCategoryName(e.target.value)}
          placeholder="Enter Subcategory Name"
          className="border p-2 rounded"
          required
        />
        <button className="px-5 py-2 bg-black text-white rounded hover:bg-gray-800">
          Add Subcategory
        </button>
      </form>

      <hr className="my-4" />

      {/* 🧩 Size Manager */}
      <div className="flex flex-col gap-3">
        <h3 className="font-semibold">Manage Sizes</h3>
        <div className="flex flex-col md:flex-row gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubcategory("");
            }}
            className="border p-2 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select Subcategory</option>
            {categories
              .find((cat) => cat._id === selectedCategory)
              ?.subCategories.map((sub, i) => (
                <option key={i} value={sub.name}>
                  {sub.name}
                </option>
              ))}
          </select>
        </div>

        {/* Add new size */}
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            placeholder="Enter new size (e.g. S, M, L, XL, 4Y, 6Y)"
            className="border p-2 rounded flex-1"
          />
          <button
            type="button"
            onClick={handleAddSize}
            className="px-4 py-2 bg-gray-800 text-white rounded"
          >
            Add
          </button>
        </div>

        {/* Display current sizes */}
        {sizeList.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {sizeList.map((size, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-gray-200 rounded-full flex items-center gap-2"
              >
                {size}
                <button
                  onClick={() =>
                    setSizeList(sizeList.filter((s) => s !== size))
                  }
                  className="text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <button
          onClick={handleSaveSizes}
          className="px-5 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Save Sizes
        </button>
      </div>

      <hr className="my-4" />

      {/* 📋 Existing Categories */}
      <div>
        <h3 className="font-semibold mb-2">Existing Categories</h3>
        {categories.length === 0 ? (
          <p className="text-gray-500">No categories yet.</p>
        ) : (
          <ul className="list-disc pl-6">
            {categories.map((cat) => (
              <li key={cat._id} className="mb-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{cat.name}</span>
                  <button
                    onClick={() => handleDeleteCategory(cat._id)}
                    className="text-red-500 text-sm"
                  >
                    Delete
                  </button>
                </div>
                {cat.subCategories?.length > 0 && (
                  <ul className="list-square pl-6 text-gray-600">
                    {cat.subCategories.map((sub, i) => (
                      <li key={i}>
                        {sub.name}{" "}
                        {sub.sizeOptions?.length > 0 && (
                          <span className="text-xs text-gray-500">
                            ({sub.sizeOptions.join(", ")})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddCategory;
