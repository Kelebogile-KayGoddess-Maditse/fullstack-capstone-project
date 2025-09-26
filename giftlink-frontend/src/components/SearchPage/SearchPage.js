import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import './SearchPage.css';

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [ageRange, setAgeRange] = useState(6);
  const [searchResults, setSearchResults] = useState([]);
  const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
  const conditions = ['New', 'Like New', 'Older'];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = `${urlConfig.backendUrl}/api/gifts`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setSearchResults(data);
      } catch (err) {
        console.error('Fetch error:', err.message);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = async () => {
    const baseUrl = `${urlConfig.backendUrl}/api/search?`;
    const queryParams = new URLSearchParams({
      name: searchQuery,
      age_years: ageRange,
      category: document.getElementById('categorySelect').value,
      condition: document.getElementById('conditionSelect').value
    }).toString();

    try {
      const res = await fetch(`${baseUrl}${queryParams}`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Failed to fetch search results:', err);
    }
  };

  const goToDetailsPage = (productId) => navigate(`/app/product/${productId}`);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="filter-section mb-3 p-3 border rounded">
            <h5>Filters</h5>
            <div className="d-flex flex-column">
              <label>Category</label>
              <select id="categorySelect" className="form-control my-1">
                <option value="">All</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <label>Condition</label>
              <select id="conditionSelect" className="form-control my-1">
                <option value="">All</option>
                {conditions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <label>Less than {ageRange} years</label>
              <input type="range" className="form-control-range" id="ageRange" min="1" max="10" value={ageRange} onChange={e => setAgeRange(e.target.value)} />
            </div>
          </div>
          <input type="text" className="form-control mb-2" placeholder="Search for items..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          <button className="btn btn-primary" onClick={handleSearch}>Search</button>

          <div className="search-results mt-4">
            {searchResults.length > 0 ? searchResults.map(product => (
              <div key={product.id || product._id} className="card mb-3">
                <img src={product.image} alt={product.name} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{(product.description || '').slice(0, 120)}...</p>
                </div>
                <div className="card-footer">
                  <button onClick={() => goToDetailsPage(product.id || product._id)} className="btn btn-primary">View More</button>
                </div>
              </div>
            )) : <div className="alert alert-info">No products found. Please revise your filters.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
export default SearchPage;
