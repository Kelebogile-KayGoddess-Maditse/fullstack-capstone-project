import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import './MainPage.css';

function MainPage() {
  const [gifts, setGifts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const url = `${urlConfig.backendUrl}/api/gifts`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setGifts(data);
      } catch (err) {
        console.error('Fetch error:', err.message);
      }
    };
    fetchGifts();
  }, []);

  const goToDetailsPage = (productId) => navigate(`/app/product/${productId}`);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000 || timestamp);
    return date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getConditionClass = (condition) => condition === 'New' ? 'list-group-item-success' : 'list-group-item-warning';

  return (
    <div className="container mt-5">
      <div className="row">
        {gifts.map((gift) => (
          <div key={gift.id || gift._id} className="col-md-4 mb-4">
            <div className="card product-card">
              <div className="image-placeholder">
                {gift.image ? (<img src={gift.image} alt={gift.name} />) : (<div className="no-image-available">No Image Available</div>)}
              </div>
              <div className="card-body">
                <h5 className="card-title">{gift.name}</h5>
                <p className={`card-text ${getConditionClass(gift.condition)}`}>{gift.condition}</p>
                <p className="card-text date-added">{formatDate(gift.date_added)}</p>
              </div>
              <div className="card-footer">
                <button onClick={() => goToDetailsPage(gift.id || gift._id)} className="btn btn-primary w-100">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default MainPage;

