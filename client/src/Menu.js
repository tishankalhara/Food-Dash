import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Menu.css';
import './Home.css';

const Menu = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState(""); // ✅ Search වචනය තියාගන්න State එක
  const [cartCount, setCartCount] = useState(0);
  const [menuItems, setMenuItems] = useState([]);

  // Cart Count
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartCount(cart.reduce((acc, item) => acc + item.qty, 0));
  }, []);

  // Fetch Food
  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await fetch('http://localhost:5000/foods');
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching food:", error);
      }
    };
    fetchFood();
  }, []);

  const restaurantInfo = {
    name: "Burger Barn",
    rating: "4.8",
    time: "25-35 min",
    delivery: "Free",
    tags: "American • Fast Food • Sides"
  };

  //SUPER FILTER LOGIC (Category + Search)
  const filteredItems = menuItems.filter((item) => {
    
    const categoryMatch = activeCategory === "All" || item.category === activeCategory;
    
    const searchMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase());

    return categoryMatch && searchMatch;
  });

  const addToCart = (item) => {
    let currentCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const itemId = item._id || item.id;
    const existingItem = currentCart.find((x) => (x._id || x.id) === itemId);

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      currentCart.push({ ...item, id: itemId, qty: 1 });
    }

    localStorage.setItem('cartItems', JSON.stringify(currentCart));
    setCartCount(currentCart.reduce((acc, item) => acc + item.qty, 0));
    alert(`${item.name} added to cart!`);
  };

  return (
    <div className="menu-container">
      <nav className="navbar">
        <div className="nav-logo" onClick={() => navigate('/home')}>Food Dash</div>
        <div className="nav-icons">
          <span className="icon-btn" onClick={() => navigate('/cart')}>
            🛒 <span className="badge">{cartCount}</span>
          </span>
        </div>
      </nav>

      <header className="restaurant-hero">
        <div className="res-details">
          <h1 className="res-name">{restaurantInfo.name}</h1>
          <p className="res-meta">{restaurantInfo.tags}</p>
        </div>
      </header>

      {/* SEARCH BAR SECTION*/}
      <div className="search-wrapper">
        <input 
            type="text" 
            placeholder="🔍 Search for food (e.g. Pizza, Burger)..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="menu-tabs">
        {["All", "Fast Food", "Sides", "Drinks"].map((cat) => (
            <span key={cat} className={`menu-tab ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>{cat}</span>
        ))}
      </div>

      <div className="menu-section">
        <div className="menu-grid">
          {filteredItems.length === 0 ? (
            <div style={{gridColumn:'1/-1', textAlign:'center', padding:'40px'}}>
                <h3>No items found</h3>
                <p>Try searching for something else!</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item._id} className="food-card">
                <img 
                    src={item.img} 
                    alt={item.name} 
                    className="food-img" 
                    referrerPolicy="no-referrer"
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = "https://placehold.co/600x400?text=No+Image"; 
                    }} 
                />
                <div className="food-info">
                  <h4 className="food-name">{item.name}</h4>
                  <p className="food-desc" style={{fontSize:'12px', color:'#777'}}>{item.description}</p>
                  <div className="food-footer">
                    <span className="food-price">${item.price}</span>
                    <button className="add-btn" onClick={() => addToCart(item)}>ADD</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;