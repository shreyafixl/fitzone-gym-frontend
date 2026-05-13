import { Link } from "react-router-dom";

function Footer() {
  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/classes", label: "Classes" },
    { to: "/equipment", label: "Equipment" },
    { to: "/facilities", label: "Facilities" },
    { to: "/trainers", label: "Trainers" },
    { to: "/pricing", label: "Pricing" },
    { to: "/gallery", label: "Gallery" },
    { to: "/testimonials", label: "Testimonials" },
    { to: "/faq", label: "FAQ" },
    { to: "/contact", label: "Contact" }
  ];

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <h2 className="footer-logo">⚡ FitZone</h2>
          <p>
            Your premium fitness destination. Transform your body, build your strength,
            and join a community that pushes you to be your best.
          </p>
          <div className="footer-socials">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <span aria-hidden="true">📸</span> Instagram
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <span aria-hidden="true">👍</span> Facebook
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <span aria-hidden="true">🐦</span> Twitter
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <span aria-hidden="true">▶️</span> YouTube
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            {quickLinks.slice(0, 6).map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h3>More Pages</h3>
          <ul>
            {quickLinks.slice(6).map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <address>
            <p>📍 123 Fitness Avenue, Sector 18<br />New Delhi, India 110001</p>
            <p>📞 <a href="tel:+911234567890">+91 12345 67890</a></p>
            <p>✉️ <a href="mailto:hello@fitzone.com">hello@fitzone.com</a></p>
          </address>
          <div className="footer-hours">
            <h4>Opening Hours</h4>
            <p>Mon – Fri: 5:30 AM – 11 PM</p>
            <p>Sat – Sun: 6 AM – 9 PM</p>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 FitZone Gym. All Rights Reserved.</p>
        <p>Built with ❤️ for fitness enthusiasts everywhere.</p>
      </div>
    </footer>
  );
}

export default Footer;
