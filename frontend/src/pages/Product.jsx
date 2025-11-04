import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch product data
  const fetchProductData = async () => {
    setLoading(true);
    try {
      // Try from context first
      const localProduct = products.find((item) => item._id === productId);
      if (localProduct) {
        setProductData(localProduct);
        setImage(localProduct.image?.[0] || "");
      } else {
        // Fallback to backend fetch
        const res = await axiosInstance.get(`/v1/products/${productId}`);
        if (res.data.success && res.data.product) {
          setProductData(res.data.product);
          setImage(res.data.product.image?.[0] || "");
        } else {
          toast.error("Product not found");
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  if (loading)
    return (
      <div className="py-10 text-center text-gray-500">Loading product...</div>
    );

  if (!productData)
    return (
      <div className="py-10 text-center text-gray-500">
        Product not found or unavailable.
      </div>
    );

  return (
    <div className="pt-10 transition-opacity duration-500 ease-in border-t-2 opacity-100">
      {/* Product Section */}
      <div className="flex flex-col gap-12 sm:gap-12 sm:flex-row">
        {/* Images */}
        <div className="flex flex-col-reverse flex-1 gap-3 sm:flex-row">
          {/* Thumbnails */}
          <div className="flex justify-between overflow-x-auto sm:flex-col sm:overflow-y-scroll sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                onClick={() => setImage(img)}
                alt="Thumbnail"
                className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer rounded-md ${
                  image === img ? "border-2 border-gray-600" : ""
                }`}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="w-full sm:w-[80%]">
            <img
              src={image}
              className="w-full h-auto object-contain rounded-md"
              alt={productData.name}
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="mt-2 text-2xl font-medium">{productData.name}</h1>

          {/* Ratings Placeholder */}
          <div className="flex items-center gap-1 mt-2 text-yellow-500">
            {"★".repeat(4)} <span className="text-gray-400">★</span>
            <p className="pl-2 text-sm text-gray-500">(122 Reviews)</p>
          </div>

          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>

          {/* Sizes */}
          <div className="flex flex-col gap-4 my-8">
            <p className="font-medium">Select Size</p>
            <div className="flex gap-2 flex-wrap">
              {productData.sizes?.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 rounded-md ${
                    item === size
                      ? "border-black bg-gray-200 font-medium"
                      : "hover:border-gray-400"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => addToCart(productData._id, size)}
            className="px-8 py-3 text-sm text-white bg-black rounded-md hover:bg-gray-800 active:bg-gray-700"
          >
            ADD TO CART
          </button>

          <hr className="mt-8 sm:w-4/5" />
          <div className="flex flex-col gap-1 mt-5 text-sm text-gray-500">
            <p>✅ 100% Authentic – Shop with Confidence!</p>
            <p>💵 Cash on Delivery – Pay at Your Doorstep!</p>
            <p>↩️ Hassle-Free Returns within 10 Days.</p>
          </div>
        </div>
      </div>

      {/* Description and Reviews */}
      <div className="mt-20">
        <div className="flex">
          <b className="px-5 py-3 text-sm border">Description</b>
          <p className="px-5 py-3 text-sm border">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 px-6 py-6 text-sm text-gray-500 border">
          <p>
            Elevate your style with our premium-quality product designed for
            comfort, durability, and elegance. Perfect for any occasion, this
            item combines timeless craftsmanship with modern versatility.
          </p>
          <p>
            Whether you’re upgrading your daily essentials or making a bold
            statement, this product ensures you look and feel your best every
            day. Shop now and experience the perfect blend of form and function!
          </p>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;
