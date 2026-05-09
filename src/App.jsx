import { useState, useEffect, useRef } from 'react'
// --- Showcase Data Setup ---
// These are used purely for the visual showcase and gallery modals.
// Actual booking inventory, pricing, and availability are handled entirely by the official booking portal.
const SHOWCASE_ROOMS = [
  {
    id: 'standard',
    name: 'Standard Room',
    base_price: 1499,
    description: 'Perfect for quick stays and solo travelers. Features modern amenities and a comfortable bed.',
    images: [
      '/Standard 103/103A.png', '/Standard 103/103B.png', '/Standard 103/103C.png', '/Standard 103/103D.png',
      '/Standard 106/106A.png', '/Standard 106/106B.png', '/Standard 106/106C.png', '/Standard 106/106D.png', '/Standard 106/106E.png',
      '/Standard 203/203A.png', '/Standard 203/203B.png', '/Standard 203/203C.png', '/Standard 203/203D.png', '/Standard 203/203E.png'
    ]
  },
  {
    id: 'deluxe',
    name: 'Deluxe Room',
    base_price: 1939,
    description: 'A cozy, elegant space perfect for solo travelers and couples. Features plush bedding and enhanced views.',
    images: [
      '/Deluxe 101/101A.png', '/Deluxe 101/101B.png', '/Deluxe 101/101C.png', '/Deluxe 101/101D.png',
      '/Deluxe 102/102A.png', '/Deluxe 102/102B.png', '/Deluxe 102/102C.png', '/Deluxe 102/102D.png', '/Deluxe 102/102E.png', '/Deluxe 102/102F.png',
      '/Deluxe 105/105A.png', '/Deluxe 105/105B.png', '/Deluxe 105/105C.png', '/Deluxe 105/105D.png',
      '/Deluxe 201/201A.png', '/Deluxe 201/201B.png', '/Deluxe 201/201C.png', '/Deluxe 201/201D.png', '/Deluxe 201/201E.png',
      '/Deluxe 202/202A.png', '/Deluxe 202/202B.png', '/Deluxe 202/202C.png', '/Deluxe 202/202D.png'
    ]
  },
  {
    id: 'suite',
    name: 'Royal Suite',
    base_price: 3499,
    description: 'The ultimate luxury experience with premium regal interiors, expansive bathroom, and exclusive services.',
    images: [
      '/Suite 204/204A.png', '/Suite 204/204B.png', '/Suite 204/204C.png', '/Suite 204/204D.png', '/Suite 204/204E.png', '/Suite 204/204F.png', '/Suite 204/204G.png'
    ]
  }
]

export default function App() {
  // --- Core Application State ---
  // Theme Preferences: We store the user's design settings (color, radius, dark/light mode) 
  // in localStorage so they persist across page reloads.
  const [themePrefs, setThemePrefs] = useState(() => {
    const saved = localStorage.getItem('rajbari_theme_v2')
    return saved ? JSON.parse(saved) : { theme: 'dark', color: 'dark-gold', radius: 'balanced', button: 'solid' }
  })
  
  

  
  // Room Data State: Stores the list of rooms for the visual showcase
  const [rooms] = useState(SHOWCASE_ROOMS)
  // Gallery Logic: Tracks which room's image gallery is currently open in the popup modal
  const [selectedGallery, setSelectedGallery] = useState(null) 
  
  // Legal Modal Logic: Tracks which legal document is open ('terms' or 'privacy')
  const [legalModal, setLegalModal] = useState(null)
  
  // Booking Confirmation: Detects successful booking redirect
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  
  // Helper to update a single theme preference
  const updatePref = (key, value) => {
    setThemePrefs(prev => ({ ...prev, [key]: value }))
  }
  
  // Ref for scrolling to the booking widget section
  const bookingSectionRef = useRef(null)

  // --- Lifecycle Hooks ---
  // 1. Theme Syncer: Whenever 'themePrefs' changes, this applies the new CSS variables 
  // to the root HTML element, instantly changing the site's look and feel.
  useEffect(() => {
    // Apply preferences to HTML standard elements
    const html = document.documentElement;
    html.setAttribute('data-theme', themePrefs.theme);
    html.setAttribute('data-color', themePrefs.color);
    html.setAttribute('data-radius', themePrefs.radius);
    html.setAttribute('data-button', themePrefs.button);
    localStorage.setItem('rajbari_theme_v2', JSON.stringify(themePrefs))
  }, [themePrefs])

  // 2. Scroll Animation Observer: Triggers the smooth fade-in animations 
  // when an element with the 'reveal' class enters the screen viewport.
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          entry.target.classList.add('visible') // Adds CSS class to trigger the CSS transition
          observer.unobserve(entry.target) // Only animate once
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, []) // Empty dep array assumes elements are rendered

  // 3. Booking Success Detector: Checks URL for ?booking=success after redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('booking') === 'success') {
      setBookingConfirmed(true)
      // Clean up the URL without reload
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  // 4. Booking search is now handled by the external portal redirect

  // Handle "Book This Room" button click
  const scrollToBooking = () => {
    bookingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      {/* Navigation */}
      <nav>
        <div className="logo">
          <img src="/RAJBARI PNG BOARD (1).png" alt="Rajbari Palace" style={{height: '80px', width: 'auto', objectFit: 'contain'}} />
        </div>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#rooms">Rooms</a>
          <a href="#amenities">Amenities</a>
          <a href="#events">Events</a>
          <a href="#reviews">Reviews</a>
          <a href="#contact">Contact</a>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <button 
            className="theme-toggle-btn"
            onClick={() => updatePref('theme', themePrefs.theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle Theme"
          >
            {themePrefs.theme === 'dark' ? <i className="ph-fill ph-moon"></i> : <i className="ph-fill ph-sun"></i>}
          </button>
          <div className="menu-btn"><i className="ph ph-list"></i></div>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero">
        <div className="hero-bg"></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-ring-container reveal">
            <div className="ornamental-ring"></div>
            <img src="/RAJBARI PNG BOARD (1).png" alt="Rajbari Palace" className="hero-crown" style={{width: '180px', height: '180px', objectFit: 'contain'}} />
          </div>
          {/* Removed rating as requested */}
          <h1 className="reveal delay-100">A Palace for Your Soul</h1>
          <p className="reveal delay-200">Experience royal heritage and deep serenity 2.5 km from the sacred Baba Baidyanath Dham.</p>
          <div className="reveal delay-200" style={{display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            <a href="#booking" className="btn btn-primary">Book Your Stay</a>
            <a href="#events" className="btn btn-primary" data-button="outline">Book for Events/Weddings</a>
          </div>
        </div>
      </header>

      {/* Ticker */}
      <div className="ticker-wrap">
        <div className="ticker">
          <span className="ticker-item"><i className="ph ph-phone"></i> +91 9296969954</span>
          <span className="ticker-item"><i className="ph ph-map-pin"></i> 2.5 km from Baba Baidyanath Dham</span>
          <span className="ticker-item"><i className="ph ph-wifi-high"></i> Free High-Speed WiFi</span>
          <span className="ticker-item"><i className="ph ph-shield-check"></i> Safe & Secure Stay</span>
          
          <span className="ticker-item"><i className="ph ph-phone"></i> +91 9296969954</span>
          <span className="ticker-item"><i className="ph ph-map-pin"></i> 2.5 km from Baba Baidyanath Dham</span>
          <span className="ticker-item"><i className="ph ph-wifi-high"></i> Free High-Speed WiFi</span>
          <span className="ticker-item"><i className="ph ph-shield-check"></i> Safe & Secure Stay</span>
        </div>
      </div>

      {/* About */}
      <section id="about" className="section">
        <div className="container">
          <div className="grid-2">
            <div className="reveal">
              <div style={{position: 'relative', borderRadius: 'var(--radius-card)', overflow: 'hidden', border: '1px solid var(--border-color)'}}>
                <img src="/Indoor/IN01.JPG" alt="Rajbari Palace Interiors" />
                <div style={{position: 'absolute', bottom: '0', left: '0', right: '0', padding: '2rem', background: 'linear-gradient(0deg, rgba(0,0,0,0.8), transparent)'}}>
                  <p style={{color: '#fff', fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontStyle: 'italic'}}>"A perfect blend of devotion and luxury."</p>
                </div>
              </div>
            </div>
            <div className="reveal delay-100">
              <span className="subtitle">Our Philosophy</span>
              <h2 className="heading-xl">Heritage meets<br/>Serenity</h2>
              <p style={{color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.1rem', lineHeight: '1.8'}}>
                Rajbari Palace rejects generic hotel templates. We build an experience that is royal but accessible, heritage-driven, warm, and deeply inviting. 
              </p>
              <p style={{color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: '1.8'}}>
                Located in the sacred city of Deoghar, we cater to Hindu pilgrims visiting the temple, families on religious trips, and luxury travelers seeking a premium sanctuary. 
              </p>
              <div className="stats-block">
                <div className="stat-item">
                   <h3>2.5km</h3>
                  <p>To Baba Dham</p>
                </div>
                <div className="stat-item">
                  <h3>26</h3>
                  <p>5-Star Reviews</p>
                </div>
                <div className="stat-item">
                  <h3>100%</h3>
                  <p>Royal Heritage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unified Booking Engine */}
      <section id="booking" className="section" style={{background: 'var(--bg-secondary)', borderRadius: 'var(--radius-card)', paddingBlock: '8rem', marginBlock: '4rem'}}>
        <div className="container">
          <div className="text-center reveal" style={{marginBottom: '5rem'}}>
            <span className="subtitle">Accommodations</span>
            <h2 className="heading-xl">Select Your Rooms</h2>
            <p style={{color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto'}}>Browse our curated categories and book your stay securely through our official portal.</p>
          </div>
          
          <div className="booking-layout">
            {/* Left Column: Room Grid */}
            <div className="grid-2" style={{gap: '2.5rem'}}>
              {rooms.map((room, idx) => (
                <div className={`card reveal delay-${idx*100}`} key={room.id}>
                  <div className="card-img-wrap" onClick={() => setSelectedGallery(room)}>
                    <img src={room.images[0]} className="card-img" alt={room.name} onError={(e) => { e.target.src = "/Outdoor/OU01.png" }} />
                    <div style={{position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.6)', padding: '5px 10px', borderRadius: 20, color:'#fff', fontSize: '0.8rem'}}>
                      <i className="ph ph-images"></i> View Gallery
                    </div>
                  </div>
                  <div className="card-content" style={{padding: '1.5rem'}}>
                    {/* Removed price display */}
                    <h4 style={{fontSize: '1.6rem', marginBottom: '1rem'}}>{room.name}</h4>
                    <p style={{color: 'var(--text-secondary)', marginBottom: '1.5rem', minHeight: '60px', fontSize: '0.9rem'}}>{room.description}</p>
                    
                    <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                      <a href="https://live.ipms247.com/booking/book-rooms-rajbaripalace" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{flex: 1, padding: '0.6rem 0.5rem', fontSize: '0.8rem'}}>Book Now</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* External Booking Portal Section */}
      <section id="booking" ref={bookingSectionRef} className="section container">
        <div className="booking-section reveal delay-200" style={{textAlign: 'center', padding: '6rem 2rem'}}>
          <div className="text-center" style={{marginBottom: '3rem'}}>
            <span className="subtitle">Reservations</span>
            <h2 className="heading-xl" style={{fontSize: '3.5rem', marginBottom: '1.5rem'}}>Book Your Royal Stay</h2>
            <p style={{color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2.5rem'}}>Experience heritage and luxury. Click below to check availability and secure your room instantly via our official booking portal.</p>
            
            <a 
              href="https://live.ipms247.com/booking/book-rooms-rajbaripalace" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary"
              style={{padding: '1.2rem 4rem', fontSize: '1.1rem'}}
            >
              Book Your Stay
            </a>
          </div>

          <div style={{marginTop: '4rem', textAlign: 'center'}}>
            <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4'}}>
              Powered by Official Booking Engine. Secure SSL Connection.<br/>
              By proceeding, you agree to our <a href="#terms" onClick={(e) => { e.preventDefault(); setLegalModal('terms'); }} style={{color: 'var(--accent-color)', textDecoration: 'none', borderBottom: '1px solid var(--accent-color)'}}>Terms & Conditions</a> and <a href="#privacy" onClick={(e) => { e.preventDefault(); setLegalModal('privacy'); }} style={{color: 'var(--accent-color)', textDecoration: 'none', borderBottom: '1px solid var(--accent-color)'}}>Privacy Policy</a>.
            </p>
          </div>

          {/* Cancel / Modify Booking */}
          <div className="cancel-booking-strip">
            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center'}}>
              <i className="ph ph-info" style={{fontSize: '1.2rem', color: 'var(--accent-color)'}}></i>
              <span style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>Already have a reservation?</span>
              <a 
                href="https://live.ipms247.com/booking/book-rooms-rajbaripalace"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-cancel-booking"
              >
                <i className="ph ph-x-circle"></i> Cancel / Modify Booking
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section id="amenities" className="section">
        <div className="container">
          <div className="text-center reveal" style={{marginBottom: '5rem'}}>
            <span className="subtitle">Experience</span>
            <h2 className="heading-xl">Premium Amenities</h2>
          </div>
          <div className="amenity-grid reveal">
            <div className="amenity-item"><i className="ph-fill ph-fork-knife"></i><p>Restaurant</p></div>
            <div className="amenity-item"><i className="ph-fill ph-barbell"></i><p>Gym</p></div>
            <div className="amenity-item"><i className="ph-fill ph-bell-ringing"></i><p>Room Service</p></div>
            <div className="amenity-item"><i className="ph-fill ph-wind"></i><p>Air Conditioning</p></div>
            <div className="amenity-item"><i className="ph-fill ph-wifi-high"></i><p>Free WiFi</p></div>
            <div className="amenity-item"><i className="ph-fill ph-lightning"></i><p>Power Backup</p></div>
            <div className="amenity-item"><i className="ph-fill ph-thermometer-cold"></i><p>Refrigerator</p></div>
            <div className="amenity-item"><i className="ph-fill ph-clock"></i><p>24-Hour Desk</p></div>
            <div className="amenity-item"><i className="ph-fill ph-car"></i><p>Ample Parking</p></div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="section">
        <div className="container">
          <div className="text-center reveal" style={{marginBottom: '5rem'}}>
            <span className="subtitle">Visual Tour</span>
            <h2 className="heading-xl">The Property</h2>
          </div>
          <div className="masonry-grid reveal delay-100">
            {/* Dynamically loading a few from indoor/outdoor mapped in img.txt */}
            <img src="/Outdoor/OU01.png" alt="Outdoor View" />
            <img src="/Indoor/IN01.JPG" alt="Indoor Decor" />
            <img src="/Outdoor/OU02.png" alt="Outdoor View" />
            <img src="/Indoor/IN02.png" alt="Indoor Decor" />
            <img src="/Outdoor/OU03.png" alt="Outdoor View" />
            <img src="/Indoor/IN03.JPG" alt="Indoor Decor" />
            <img src="/Outdoor/OU04.png" alt="Outdoor View" />
            <img src="/Indoor/IN04.jpg" alt="Indoor Decor" />
            <img src="/Outdoor/OU05.png" alt="Outdoor View" />
          </div>
        </div>
      </section>

      {/* Weddings & Banquets */}
      <section id="events" className="section" style={{background: 'var(--bg-secondary)', paddingBlock: '8rem'}}>
        <div className="container">
          <div className="text-center reveal" style={{marginBottom: '5rem'}}>
            <span className="subtitle">Celebrations</span>
            <h2 className="heading-xl">Weddings & Banquets</h2>
            <p style={{color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.8'}}>
              Set against lush gardens, towering palms, and the regal Rajbari facade — create memories that last a lifetime. 
              Our open-air grounds and covered pavilion are perfect for weddings, receptions, and private celebrations.
            </p>
          </div>

          {/* Venue Photo Showcase */}
          <div className="events-gallery reveal delay-100">
            <div className="events-gallery-hero">
              <img src="/Outdoor/OU05.png" alt="Rajbari Palace Garden Venue" />
              <div className="events-gallery-hero-overlay">
                <h3>The Royal Garden</h3>
                <p>A stunning open-air venue framed by marigolds & palms</p>
              </div>
            </div>
            <div className="events-gallery-grid">
              <div className="events-gallery-item">
                <img src="/Outdoor/OU01.png" alt="Courtyard & Garden Lawn" />
                <span className="events-gallery-label">Courtyard & Lawn</span>
              </div>
              <div className="events-gallery-item">
                <img src="/Outdoor/OU03.png" alt="Covered Pavilion" />
                <span className="events-gallery-label">Covered Pavilion</span>
              </div>
              <div className="events-gallery-item">
                <img src="/Outdoor/OU06.png" alt="Evening Facade" />
                <span className="events-gallery-label">Evening Ambience</span>
              </div>
              <div className="events-gallery-item">
                <img src="/Outdoor/OU04.png" alt="Outdoor Seating" />
                <span className="events-gallery-label">Outdoor Seating</span>
              </div>
            </div>
          </div>

          {/* Event Services */}
          <div className="grid-3 reveal delay-200" style={{marginTop: '5rem', marginBottom: '5rem'}}>
            <div className="event-feature-card">
              <div className="event-feature-icon"><i className="ph-fill ph-flower-lotus"></i></div>
              <h4>Wedding Ceremonies</h4>
              <p>Traditional or contemporary setups in our lush garden grounds with full décor coordination.</p>
            </div>
            <div className="event-feature-card">
              <div className="event-feature-icon"><i className="ph-fill ph-champagne"></i></div>
              <h4>Reception & Banquets</h4>
              <p>Elegant dining experiences for up to 200 guests with custom menus from our in-house kitchen.</p>
            </div>
            <div className="event-feature-card">
              <div className="event-feature-icon"><i className="ph-fill ph-hand-heart"></i></div>
              <h4>Private Celebrations</h4>
              <p>Anniversaries, birthday milestones, engagements, and family gatherings in an intimate royal setting.</p>
            </div>
          </div>

          {/* Venue Highlights Strip */}
          <div className="events-highlights reveal">
            <div className="events-highlight-item">
              <i className="ph-fill ph-users-three"></i>
              <h4>Up to 200</h4>
              <p>Guest Capacity</p>
            </div>
            <div className="events-highlight-item">
              <i className="ph-fill ph-tree-palm"></i>
              <h4>Open-Air</h4>
              <p>Garden Venue</p>
            </div>
            <div className="events-highlight-item">
              <i className="ph-fill ph-cooking-pot"></i>
              <h4>Custom</h4>
              <p>Catering Menu</p>
            </div>
            <div className="events-highlight-item">
              <i className="ph-fill ph-sparkle"></i>
              <h4>Full Décor</h4>
              <p>Coordination</p>
            </div>
          </div>

          {/* Google Form Inquiry */}
          <div className="events-inquiry reveal delay-100" style={{marginTop: '5rem'}}>
            <div className="events-inquiry-header">
              <i className="ph-fill ph-envelope-simple" style={{fontSize: '2rem', color: 'var(--accent-color)', marginBottom: '1rem', display: 'block'}}></i>
              <h3 className="heading-lg" style={{marginBottom: '0.5rem'}}>Plan Your Event</h3>
              <p style={{color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 2rem'}}>Fill out the form below and our events team will get back to you within 24 hours with a customized quote.</p>
            </div>
            <div className="events-form-container">
              {/* 
                GOOGLE FORM EMBED
                Replace the src below with your actual Google Form embed URL.
                To get it: Google Forms → Send → Embed icon → Copy iframe src
              */}
              <iframe 
                src="https://forms.gle/4UmNaMjtBwQP2XcE6"
                title="Rajbari Palace Event Inquiry Form"
                className="events-google-form"
                frameBorder="0"
                marginHeight="0"
                marginWidth="0"
              >
                Loading…
              </iframe>
              <div className="events-form-placeholder">
                <i className="ph ph-note-pencil" style={{fontSize: '3rem', color: 'var(--accent-color)', marginBottom: '1rem'}}></i>
                <h4 style={{fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '0.5rem'}}>Event Inquiry Form</h4>
                <p style={{color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem'}}>Our Google Form will load here. For immediate inquiries, reach us directly:</p>
                <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
                  <a href="tel:+919296969954" className="btn btn-primary" style={{padding: '0.8rem 1.5rem', fontSize: '0.85rem'}}>
                    <i className="ph ph-phone" style={{marginRight: '0.5rem'}}></i>Call Now
                  </a>
                  <a href="mailto:contact@rajbaripalace.com?subject=Event Inquiry - Rajbari Palace" className="btn btn-primary" data-button="outline" style={{padding: '0.8rem 1.5rem', fontSize: '0.85rem'}}>
                    <i className="ph ph-envelope" style={{marginRight: '0.5rem'}}></i>Email Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews (Static setup) */}
      <section id="reviews" className="section" style={{marginTop: '4rem'}}>
        <div className="container">
          <div className="text-center reveal" style={{marginBottom: '5rem'}}>
            <span className="subtitle">Testimonials</span>
            <h2 className="heading-xl">Words from Our Guests</h2>
            <div className="rating" style={{justifyContent: 'center', marginTop: '1rem'}}>
              <h3 style={{fontSize: '3rem', color: 'var(--accent-color)', fontFamily: 'var(--font-heading)', marginRight: '15px'}}>4.9</h3>
              <div>
                <i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i>
                <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', letterSpacing: '1px'}}>BASED ON 26 REVIEWS</p>
              </div>
            </div>
          </div>
          <div className="grid-3">
            <div className="review-card reveal">
              <i className="ph-fill ph-quotes"></i>
              <p>"An absolute palace! The rooms are so clean and luxurious, and it's extremely close to Baba Mandir."</p>
              <div className="reviewer">
                <h5>Rahul Sharma</h5>
                <span style={{color: 'var(--accent-color)', fontSize: '0.8rem'}}><i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i></span>
              </div>
            </div>
            <div className="review-card reveal delay-100">
              <i className="ph-fill ph-quotes"></i>
              <p>"Best hotel in Deoghar hands down. The royal aesthetic is beautiful, the food is amazing."</p>
              <div className="reviewer">
                <h5>Priya Singh</h5>
                <span style={{color: 'var(--accent-color)', fontSize: '0.8rem'}}><i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i></span>
              </div>
            </div>
            <div className="review-card reveal delay-200">
              <i className="ph-fill ph-quotes"></i>
              <p>"Stayed here with my family during our pilgrimage. Huge parking space, very safe, Highly recommended."</p>
              <div className="reviewer">
                <h5>Amit Kumar</h5>
                <span style={{color: 'var(--accent-color)', fontSize: '0.8rem'}}><i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section" style={{marginTop: '2rem', marginBottom: '6rem'}}>
        <div className="container">
          <div className="text-center reveal" style={{marginBottom: '5rem'}}>
            <span className="subtitle">Get in Touch</span>
            <h2 className="heading-xl">Location & Contact</h2>
          </div>
          
          <div className="grid-2">
            <div className="reveal">
              <ul className="contact-list">
                <li><i className="ph-fill ph-map-pin"></i><div><h4 style={{color: 'var(--text-primary)', marginBottom: '0.2rem', fontFamily: 'var(--font-body)', fontSize: '1.2rem'}}>Address</h4><p style={{fontSize: '1.1rem'}}>Belabagan, Deoghar, Jharkhand 814112</p></div></li>
                <li><i className="ph-fill ph-phone-call"></i><div><h4 style={{color: 'var(--text-primary)', marginBottom: '0.2rem', fontFamily: 'var(--font-body)', fontSize: '1.2rem'}}>Phone</h4><p style={{fontSize: '1.1rem'}}>+91 9296969954</p></div></li>
                <li><i className="ph-fill ph-envelope"></i><div><h4 style={{color: 'var(--text-primary)', marginBottom: '0.2rem', fontFamily: 'var(--font-body)', fontSize: '1.2rem'}}>Email</h4><p style={{fontSize: '1.1rem'}}>contact@rajbaripalace.com</p></div></li>
                <li><i className="ph-fill ph-clock"></i><div><h4 style={{color: 'var(--text-primary)', marginBottom: '0.2rem', fontFamily: 'var(--font-body)', fontSize: '1.2rem'}}>Front Desk</h4><p style={{fontSize: '1.1rem'}}>24 Hours Open</p></div></li>
              </ul>
            </div>

            <div className="reveal delay-100">
              <div style={{borderRadius: 'var(--radius-card)', overflow: 'hidden', height: '250px', border: '1px solid var(--border-color)'}}>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3623.570222019777!2d86.7027581750239!3d24.498416462963162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f116174a81ba37%3A0xc3cf6b95c3459c!2sDeoghar%2C%20Jharkhand!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" width="100%" height="100%" style={{border:0, filter: 'grayscale(20%) contrast(1.2)'}} allowFullScreen="" loading="lazy"></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container" style={{maxWidth: 800}}>
          <div style={{marginBottom: '1rem'}}>
            <img src="/RAJBARI PNG BOARD (1).png" alt="Rajbari Palace" style={{height: '120px', width: 'auto', objectFit: 'contain', filter: 'brightness(1.2)'}} />
          </div>
          <p style={{color: 'var(--text-secondary)'}}>A Luxury Boutique Resort in the sacred heart of Deoghar.</p>
          <div style={{borderTop: '1px solid var(--border-color)', paddingTop: '2rem', marginTop: '2rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'}}>
            <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>&copy; 2026 Rajbari Palace. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Gallery Modal (Popup built dynamic for each room) */}
      <div className={`modal-overlay ${selectedGallery ? 'open' : ''}`} onClick={(e) => {if(e.target === e.currentTarget) setSelectedGallery(null)}}>
        <div className="modal-content">
          <button className="modal-close" onClick={() => setSelectedGallery(null)}><i className="ph ph-x" style={{fontSize: '2rem'}}></i></button>
          
          {selectedGallery && (
            <>
              <h2 className="heading-lg" style={{marginBottom: '0.5rem'}}>{selectedGallery.name} Gallery</h2>
              <p style={{color: 'var(--text-secondary)', marginBottom: '2rem'}}>{selectedGallery.description}</p>
              
              <div className="gallery-grid">
                {selectedGallery.images.map((imgUrl, i) => (
                  <img src={imgUrl} key={i} className="gallery-item" alt={`${selectedGallery.name} View ${i+1}`} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Legal Modal */}
      <div className={`modal-overlay ${legalModal ? 'open' : ''}`} onClick={(e) => {if(e.target === e.currentTarget) setLegalModal(null)}}>
        <div className="modal-content" style={{maxWidth: '800px'}}>
          <button className="modal-close" onClick={() => setLegalModal(null)}><i className="ph ph-x" style={{fontSize: '2rem'}}></i></button>
          
          {legalModal === 'terms' && (
            <>
              <h2 className="heading-lg" style={{marginBottom: '1rem'}}>Terms & Conditions</h2>
              <div style={{color: 'var(--text-secondary)', lineHeight: '1.8', maxHeight: '60vh', overflowY: 'auto', paddingRight: '1rem'}}>
                {[
                  "Check-in time is from 2:00 PM and check-out time is until 11:00 AM. Early check-in or late check-out is subject to room availability and may incur additional charges.",
                  "All guests must present a valid government-issued photo identification at the time of check-in. Accepted IDs include Aadhaar Card, Passport, Driving License, and Voter ID.",
                  "The primary guest must be at least 18 years of age to make a reservation and stay at the property.",
                  "Guests are requested to maintain decorum and respect the comfort and privacy of other guests staying at the property.",
                  "Smoking inside rooms and restricted indoor areas is strictly prohibited. Any damage caused due to smoking or negligence will be chargeable.",
                  "Any damage to hotel property, furnishings, linens, electronics, or décor caused during the stay will be charged to the guest.",
                  "Outside visitors may be allowed only with prior approval from hotel management and valid identification.",
                  "Pets are not allowed inside the hotel premises unless specifically permitted by management.",
                  "Rajbari Palace reserves the right to refuse accommodation to guests found violating hotel policies or engaging in inappropriate behavior.",
                  "Cancellation and refund policies may vary depending on the booking source and selected room plan.",
                  "The hotel shall not be responsible for loss of valuables, cash, jewelry, or personal belongings during the stay.",
                  "Guests are requested to comply with all local laws, safety regulations, and hotel guidelines during their stay.",
                  "All bookings are subject to availability and confirmation by the hotel management.",
                  "Hotel management reserves the right to amend the terms and conditions without prior notice."
                ].map((item, i) => (
                  <p key={i} style={{marginBottom: '1.2rem', display: 'flex', gap: '10px'}}>
                    <span style={{color: 'var(--accent-color)', fontWeight: 'bold', minWidth: '25px'}}>{i + 1}.</span>
                    <span>{item}</span>
                  </p>
                ))}
              </div>
            </>
          )}

          {legalModal === 'privacy' && (
            <>
              <h2 className="heading-lg" style={{marginBottom: '1rem'}}>Privacy Policy</h2>
              <div style={{color: 'var(--text-secondary)', lineHeight: '1.8', maxHeight: '60vh', overflowY: 'auto', paddingRight: '1rem'}}>
                <h4 style={{color: 'var(--text-primary)', marginTop: '1rem'}}>Data Collection</h4>
                <p>We collect personal information such as your name, contact number, and email address solely for the purpose of managing your reservation and improving our services.</p>
                <h4 style={{color: 'var(--text-primary)', marginTop: '1rem'}}>Data Security</h4>
                <p>Your data is securely stored and is never shared with third parties for marketing purposes without your explicit consent.</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Booking Confirmation Overlay — shown after redirect with ?booking=success */}
      <div className={`booking-confirmation-overlay ${bookingConfirmed ? 'open' : ''}`}>
        <div className="booking-confirmation-card">
          <div className="confirmation-checkmark">
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="36" stroke="var(--accent-color)" strokeWidth="3" opacity="0.3"/>
              <circle cx="40" cy="40" r="36" stroke="var(--accent-color)" strokeWidth="3" className="confirmation-circle"/>
              <path d="M24 40L35 51L56 30" stroke="var(--accent-color)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="confirmation-check"/>
            </svg>
          </div>
          <h2 style={{fontFamily: 'var(--font-heading)', fontSize: '2.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem'}}>Booking Confirmed!</h2>
          <p style={{color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '0.5rem'}}>Thank you for choosing <strong style={{color: 'var(--accent-color)'}}>Rajbari Palace</strong>.</p>
          <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '2rem'}}>A confirmation email has been sent to you. Please check your inbox for your booking details, reservation ID, and check-in instructions.</p>
          
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            <button onClick={() => setBookingConfirmed(false)} className="btn btn-primary" style={{minWidth: '180px'}}>
              <i className="ph ph-house" style={{marginRight: '0.5rem'}}></i> Back to Home
            </button>
            <a 
              href="https://live.ipms247.com/booking/book-rooms-rajbaripalace"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              data-button="outline"
              style={{minWidth: '180px'}}
            >
              <i className="ph ph-x-circle" style={{marginRight: '0.5rem'}}></i> Cancel Booking
            </a>
          </div>

          <div style={{marginTop: '2rem', padding: '1rem', borderRadius: 'var(--radius-card)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)'}}>
            <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6'}}>
              <i className="ph ph-phone" style={{marginRight: '0.4rem', color: 'var(--accent-color)'}}></i>
              Need help? Call us at <strong style={{color: 'var(--text-primary)'}}>+91 9296969954</strong> or email <strong style={{color: 'var(--text-primary)'}}>contact@rajbaripalace.com</strong>
            </p>
          </div>
        </div>

        {/* Decorative floating particles */}
        <div className="confirmation-particles">
          {[...Array(12)].map((_, i) => (
            <span key={i} className="particle" style={{'--i': i}}></span>
          ))}
        </div>
      </div>

    </>
  )
}
