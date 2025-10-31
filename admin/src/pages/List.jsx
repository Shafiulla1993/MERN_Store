import React, { useEffect, useState } from "react";
import { listProducts, removeProduct } from "../api/productApi";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null); // holds product to delete

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await listProducts();
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message || "Failed to load products");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching products");
    }
  };

  // Confirm + Delete
  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    try {
      const response = await removeProduct(confirmDelete._id);
      if (response.data.success) {
        toast.success(`"${confirmDelete.name}" deleted successfully`);
        setConfirmDelete(null);
        fetchProducts();
      } else {
        toast.error(response.data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting product");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="relative flex flex-col gap-2">
      {/* Header Row */}
      <div className="hidden md:grid grid-cols-[0.5fr_1fr_1.5fr_0.5fr_0.5fr_0.5fr_0.2fr] items-center py-1 px-2 border bg-gray-200 text-xl text-center">
        <b>Image</b>
        <b>Name</b>
        <b>Description</b>
        <b>Category</b>
        <b>Subcategory</b>
        <b>Price</b>
        <b className="text-center">Action</b>
      </div>

      {/* Product Rows */}
      {products.map((item) => (
        <div
          key={item._id}
          className="grid grid-cols-[0.5fr_1fr_1.5fr_0.5fr_0.5fr_0.5fr_0.2fr] items-center gap-2 py-1 px-2 border text-sm text-center bg-white hover:bg-gray-50 transition"
        >
          <img
            className="w-12 h-12 object-cover mx-auto rounded"
            src={item.image?.[0] || `${backendUrl}/default-product.png`}
            alt="Product"
          />
          <p className="text-left font-medium">{item.name}</p>
          <p className="text-left text-gray-600 truncate">{item.description}</p>
          <p>{item.category}</p>
          <p>{item.subCategory}</p>
          <p>{currency(item.price)}</p>
          <button
            onClick={() => setConfirmDelete(item)}
            className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition"
          >
            X
          </button>
        </div>
      ))}

      {products.length === 0 && (
        <div className="text-center text-gray-500 mt-4">No products found.</div>
      )}

      {/* ✅ Custom Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
            <p className="text-lg font-semibold mb-4">
              Delete{" "}
              <span className="text-red-500">"{confirmDelete.name}"</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
