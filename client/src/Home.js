import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  // Address & Notification 
  const [address, setAddress] = useState("Colombo 07, Sri Lanka");
  const [notificationCount, setNotificationCount] = useState(2); 

  // User State 
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  // Logout Function 
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    navigate('/login');
  };

  // Address Change Function 
  const changeAddress = () => {
    const newAddress = prompt("Enter new address:", address);
    if (newAddress) setAddress(newAddress);
  };

  // Food Categories Data 
  const categories = [
    { id: 1, name: "Pizza", img: "https://img.freepik.com/free-photo/pizza-pizza-filled-with-tomatoes-salami-olives_140725-1200.jpg" },
    { id: 2, name: "Burgers", img: "https://img.freepik.com/free-photo/front-view-burger-stand_141793-15542.jpg" },
    { id: 3, name: "Noodles", img: "https://img.freepik.com/free-photo/side-view-noodle-soup-with-chicken-radish-cucumber-corn-bowl_141793-2589.jpg" },
    { id: 4, name: "Submarine", img: "https://img.freepik.com/free-photo/fresh-tasty-sandwich_144627-17490.jpg" },
    { id: 5, name: "Pasta", img: "https://img.freepik.com/free-photo/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table_2829-19744.jpg" },
    { id: 6, name: "Sushi", img: "https://img.freepik.com/free-photo/sushi-set-with-salmon-prawns-vegetables_140725-3642.jpg" },
    { id: 7, name: "Rice", img: "https://img.freepik.com/free-photo/fried-rice-with-pork-vegetables_1339-7874.jpg" },
    { id: 8, name: "Desserts", img: "https://img.freepik.com/free-photo/chocolate-brownie-cake-with-scoop-ice-cream_2829-13837.jpg" },
    { id: 9, name: "Drinks", img: "https://img.freepik.com/free-photo/fresh-cola-drink-glass_144627-16201.jpg" },
    { id: 10, name: "Coffee", img: "https://img.freepik.com/free-photo/cup-coffee-with-heart-drawn-foam_1286-70.jpg" },
    { id: 11, name: "Indian", img: "https://img.freepik.com/free-photo/chicken-tikka-masala-spicy-curry-meat-food-butter-chicken-with-rice-naan-bread_2829-19623.jpg" },
    { id: 12, name: "Healthy", img: "https://img.freepik.com/free-photo/salad-from-tomatoes-cucumber-red-onions-lettuce-leaves-healthy-summer-vitamin-menu_2829-6473.jpg" },
  ];
  // 1. Dynamic Hero Section Texts 
    const sentences = [
        "Delivering Happiness, One Meal at a Time.",
        "Fresh & Hot Food, Delivered To Your Door.",
        "Satisfy Your Cravings, Order Now!"
    ];
    

    const [index, setIndex] = useState(0);

    // 2. Auto-Cycle Hero Texts Every 3 Seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % sentences.length);
        }, 3000); 

        return () => clearInterval(interval);
    }, []);

  // Detailed Restaurant Data 
  const restaurants = [
    { id: 1, name: "Burger Barn", rating: "4.8", time: "25-35 min", fee: "$1.99", img: "https://img.freepik.com/free-photo/delicious-burger-with-fresh-ingredients_23-2150857908.jpg" },
    { id: 2, name: "Pizza Palace", rating: "4.6", time: "40-50 min", fee: "Free", img: "https://img.freepik.com/free-photo/freshly-baked-pizza-rustic-wooden-table-generated-by-ai_188544-19671.jpg" },
    { id: 3, name: "Sushi Spot", rating: "4.9", time: "30-45 min", fee: "$3.50", img: "https://img.freepik.com/free-photo/sushi-set-with-salmon-prawns-vegetables_140725-3642.jpg" },
    { id: 4, name: "Taco Town", rating: "4.3", time: "20-30 min", fee: "Free", img: "https://img.freepik.com/free-photo/mexican-tacos-with-beef-tomato-sauce-salsa_2829-14221.jpg" },
    { id: 5, name: "Crispy Chicken", rating: "4.5", time: "35-45 min", fee: "$2.50", img: "https://img.freepik.com/free-photo/fried-chicken-french-fries_1339-7647.jpg" },
    { id: 6, name: "Wok & Roll", rating: "4.1", time: "45-55 min", fee: "$1.50", img: "https://img.freepik.com/free-photo/stir-fry-noodles_1339-7639.jpg" }
  ];

  return (
    <div className="home-container">
      
      {/* Modern Sticky Navbar */}
      <nav className="navbar">
        <div className="nav-logo">
           Food Dash
        </div>

        {/* Address Bar */}
        <div className="location-pill" onClick={changeAddress}>
            <span className="pin-icon"></span>
            <div className="location-text">
                <span className="location-label">Deliver to:</span>
                <span className="location-value">{address} ▼</span>
            </div>
        </div>

        {/* Navigation Links */}
        <div className="nav-middle-links">
          <span className="nav-link-text active" onClick={() => navigate('/home')}>Home</span>
          <span className="nav-link-text" onClick={() => navigate('/offers')}>Offers</span>
          <span className="nav-link-text" onClick={() => navigate('/help')}>Help</span>
        </div>

        {/*Right Side (Login Button Removed) */}
        <div className="nav-right" style={{display:'flex', alignItems:'center', gap:'20px'}}>
          
          {/* Notification Bell */}
          <div className="notification-box">
             <span className="bell-icon"></span>
             {notificationCount > 0 && <span className="notif-badge">{notificationCount}</span>}
          </div>

          {/* User Profile & Logout Only */}
          {user && (
            <div className="user-profile-menu" style={{display:'flex', alignItems:'center', gap:'15px'}}>
               <span 
                 className="user-name" 
                 onClick={() => navigate('/profile')} 
                 style={{cursor:'pointer', fontWeight:'bold', color:'#333'}}
               >
                 Hi, {user.name}
               </span>
               <button 
                 onClick={handleLogout} 
                 style={{border:'1px solid #ff5722', background:'white', color:'#ff5722', borderRadius:'20px', padding:'5px 15px', cursor:'pointer'}}
               >
                 Logout
               </button>
            </div>
          )}

        </div>
      </nav>

    
      {/* Hero Section */}
      <header className="hero-section">
        
        {/* Dynamic Title*/}
        <h1 className="hero-title fade-in-text">
            {sentences[index].split(',').map((part, i) => (
                <React.Fragment key={i}>
                    {part}
                    {i === 0 && <br/>} 
                </React.Fragment>
            ))}
        </h1>

        <div className="search-container">
          <input type="text" placeholder="What are you craving? (e.g., Pizza, Sushi...)" className="search-bar" />
          <button className="search-btn">Find Food</button>
        </div>
        
      </header>

      {/* Categories Section */}
      <section className="category-section">
        <h3 className="section-title">Explore Categories</h3>
        <div className="category-row">
          {categories.map((cat) => (
            <div key={cat.id} className="category-card">
              <img src={cat.img} alt={cat.name} className="cat-img" />
              <span className="cat-name">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <div className="promo-banner">
        <div className="banner-text">
          <h2>Special Offer! 50% OFF</h2>
          <p>Get 50% off on your first 3 orders. Terms apply.</p>
        </div>
        <button className="banner-btn">Claim Now</button>
      </div>

      {/* Restaurant Cards */}
      <section className="section-container">
        <h2 className="section-title">Popular Restaurants Near You</h2>
        <div className="grid-container">
          {restaurants.map((res) => (
            <div key={res.id} className="card" onClick={() => navigate('/menu')}>
              <div className="card-img-container">
                <img src={res.img} alt={res.name} className="card-img" />
                {res.fee === "Free" && <span className="badge-free">Free Delivery</span>}
              </div>
              
              <div className="card-info">
                <div className="card-header">
                  <p className="card-name">{res.name}</p>
                  <span className="card-rating">{res.rating}</span>
                </div>
                
                <div className="card-meta">
                  <span className="meta-item">{res.time}</span>
                  <span className="meta-item">
                    {res.fee === "Free" ? <span style={{color: '#2ecc71', fontWeight:'bold'}}>Free</span> : res.fee}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 Food Dash. All rights reserved.</p>
      </footer>
 
    </div>
  );
};

export default Home;