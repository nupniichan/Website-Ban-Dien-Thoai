import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL } from "../config";
import { Spin } from 'antd'; // Import Spin for loading animation

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: [0, 3000000],
    colors: [],
    brands: []
  });
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query') || '';

    const minPrice = params.get('minPrice') || filters.priceRange[0];
    const maxPrice = params.get('maxPrice') || filters.priceRange[1];
    const colors = params.get('colors')?.split(',') || [];
    const brands = params.get('brands')?.split(',') || [];

    setFilters({
      priceRange: [Number(minPrice), Number(maxPrice)],
      colors,
      brands
    });

    if (query) {
      fetchProducts(query);
    }
}, [location.search]);


  const fetchProducts = async (query) => {
    const { priceRange, colors, brands } = filters;
    setLoading(true); // Start loading

    try {
      const response = await fetch(`${BASE_URL}/api/products?query=${query}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}&colors=${colors.join(',')}&brands=${brands.join(',')}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const filterMessage = () => {
    const query = new URLSearchParams(location.search).get('query') || '';
    const { priceRange, colors, brands } = filters;
    let message = `You searched for "${query}"`;

    const appliedFilters = [];
    if (colors.length > 0) appliedFilters.push(`Colors: ${colors.join(', ')}`);
    if (brands.length > 0) appliedFilters.push(`Brands: ${brands.join(', ')}`);
    if (priceRange[0] > 0 || priceRange[1] < 3000000) {
      appliedFilters.push(`Price Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()} VND`);
    }

    return appliedFilters.length ? `${message} with ${appliedFilters.join(', ')}` : message;
  };

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Search Results</h1>
      <p className="text-lg text-center mb-4">{filterMessage()}</p>
      {loading ? ( // Show loading spinner if loading
        <div className="flex justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              >
                <img
                  src={`${BASE_URL}/${product.image}`}
                  alt={product.name}
                  className="w-full h-80 rounded-t-lg object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <p className="text-red-600 mb-2 text-[19px]">
                    Price: <span className="font-bold">{product.price.toLocaleString()} VND</span>
                  </p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
                    Buy Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xl text-gray-600">No products found.</p>
          )}
        </div>
      )}
    </main>
  );
};

export default SearchResults;
