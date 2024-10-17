import React, { useEffect, useState } from 'react';
import { Slider, Checkbox, Button } from 'antd';
import { BASE_URL } from "../config";
import { useNavigate } from 'react-router-dom';

const FilterMenu = ({ searchQuery }) => {
  const navigate = useNavigate();
  const [priceRange, setPriceRange] = useState([0, 3000000]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    // Load filter choices from session storage
    const savedFilters = JSON.parse(sessionStorage.getItem('filters')) || {};
    setPriceRange(savedFilters.priceRange || [0, 3000000]);
    setSelectedColors(savedFilters.colors || []);
    setSelectedBrands(savedFilters.brands || []);
  }, []);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const colorResponse = await fetch(`${BASE_URL}/api/colors`);
        const brandResponse = await fetch(`${BASE_URL}/api/brands`);
        const colorsData = await colorResponse.json();
        const brandsData = await brandResponse.json();

        setColors(colorsData);
        setBrands(brandsData);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };

    fetchFilters();
  }, []);

  const handleColorChange = (color) => {
    setSelectedColors((prev) => {
      const updatedColors = prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color];
      saveFilters(updatedColors, selectedBrands, priceRange);
      return updatedColors;
    });
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) => {
      const updatedBrands = prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand];
      saveFilters(selectedColors, updatedBrands, priceRange);
      return updatedBrands;
    });
  };

  const saveFilters = (colors, brands, price) => {
    sessionStorage.setItem('filters', JSON.stringify({ colors, brands, priceRange: price }));
  };

  const searchProducts = () => {
    const queryParams = new URLSearchParams();

    if (searchQuery.trim()) {
      queryParams.append('query', searchQuery);
    }

    const [minPrice, maxPrice] = priceRange;
    if (minPrice >= 0 && maxPrice <= 3000000) {
      queryParams.append('minPrice', minPrice);
      queryParams.append('maxPrice', maxPrice);
    }

    if (selectedColors.length) {
      queryParams.append('colors', selectedColors.join(',')); // Add selected colors to the query
    }

    if (selectedBrands.length) {
      queryParams.append('brands', selectedBrands.join(',')); // Add selected brands to the query
    }

    navigate(`/search-results?${queryParams.toString()}`);
  };

  const handleResetFilters = () => {
    setSelectedColors([]);
    setSelectedBrands([]);
    setPriceRange([0, 3000000]);
    sessionStorage.removeItem('filters'); // Clear session storage on reset
    // Trigger search immediately after resetting filters
    searchProducts();
  };

  const handleApplyFilters = () => {
    // Save current filters to session storage
    saveFilters(selectedColors, selectedBrands, priceRange);
    // Trigger search immediately after applying filters
    searchProducts();
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-md absolute top-12 right-0 w-80">
      <h2 className="font-bold mb-2">Filters</h2>
      <div className="mb-4">
        <h3 className="font-semibold">Price Range</h3>
        <Slider
          range
          min={0}
          max={3000000}
          step={100000}
          value={priceRange}
          onChange={(value) => {
            setPriceRange(value);
            saveFilters(selectedColors, selectedBrands, value); // Save the new price range
          }}
        />
        <div className="flex justify-between text-sm">
          <span>{priceRange[0].toLocaleString()} VND</span>
          <span>{priceRange[1].toLocaleString()} VND</span>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Color</h3>
        {colors.map(color => (
          <Checkbox
            key={color}
            onChange={() => handleColorChange(color)}
            checked={selectedColors.includes(color)}
          >
            {color}
          </Checkbox>
        ))}
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Brand</h3>
        {brands.map(brand => (
          <Checkbox
            key={brand}
            onChange={() => handleBrandChange(brand)}
            checked={selectedBrands.includes(brand)}
          >
            {brand}
          </Checkbox>
        ))}
      </div>
      <div className="flex justify-between">
        <Button onClick={handleResetFilters} className="bg-gray-300">Reset</Button>
        <Button onClick={handleApplyFilters} className="bg-blue-600 text-white">Apply Filters</Button>
      </div>
    </div>
  );
};

export default FilterMenu;
