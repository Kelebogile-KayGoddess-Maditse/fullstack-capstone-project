import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetailsPage.css';
import { urlConfig } from '../../config';

function DetailsPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [gift, setGift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!sessionStorage.getItem('auth-token')) navigate('/app/login');
    const fetchGift = async () => {
      try {
        const url = `${urlConfig.backendUrl}/api/gifts/${productId}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setGift(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGift();
    window.scrollTo(0, 0);
  }, [productId, navigate]);

  const handleBackClick = () => navigate(-1);

  const comments = [
    { author: 'John Doe', comment: 'I would like this!' },
    { author: 'Jane Smith', comment: 'Just DMed you.' }
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!gift) return <div>Gift not found</div>;

  return (
    <div className="container mt-5">
      <button className="btn btn-secondary mb-3" onClick={handleBackClick}>Back</button>
      <div className="card product-details-card">
        <div className="card-header text-white">
          <h2 className="details-title">{gift.name}</h2>
        </div>
        <div className="card-body">
          <div className="image-placeholder-large">
            {gift.image ? (<img src={gift.image} alt={gift.name} className="product-image-large" />) : (<div className="no-image-available-large">No Image Available</div>)}
          </div>
          <p><strong>Category:</strong> {gift.category}</p>
          <p><strong>Condition:</strong> {gift.condition}</p>
          <p><strong>Date Added:</strong> {gift.dateAdded || gift.date_added}</p>
          <p><strong>Age (Years):</strong> {gift.age || gift.age_years}</p>
          <p><strong>Description:</strong> {gift.description}</p>
        </div>
      </div>
      <div className="comments-section mt-4">
        <h3 className="mb-3">Comments</h3>
        {comments.map((comment, index) => (
          <div key={index} className="card mb-3">
            <div className="card-body">
              <p className="comment-author"><strong>{comment.author}:</strong></p>
              <p className="comment-text">{comment.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default DetailsPage;

