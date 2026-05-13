import Contact from "../components/Contact";

function ContactPage() {
  return (
    <main className="contact-page">

      <section className="page-hero" aria-labelledby="contact-heading">
        <div className="section-container">
          <h1 id="contact-heading">Get in Touch</h1>
          <p>
            Have a question, want to book a trial, or just want to say hello?
            We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="contact-content-section" aria-labelledby="contact-form-heading">
        <div className="section-container contact-layout">

          {/* Info Panel */}
          <aside className="contact-info" aria-label="Contact information">
            <div className="contact-info-block">
              <h2 id="contact-form-heading" className="sr-only">Contact Information</h2>
              <h3>📍 Visit Us</h3>
              <address>
                123 Fitness Avenue, Sector 18<br />
                New Delhi, India 110001
              </address>
            </div>

            <div className="contact-info-block">
              <h3>📞 Call Us</h3>
              <p><a href="tel:+911234567890">+91 12345 67890</a></p>
              <p><a href="tel:+911234567891">+91 12345 67891</a> (WhatsApp)</p>
            </div>

            <div className="contact-info-block">
              <h3>✉️ Email Us</h3>
              <p><a href="mailto:hello@fitzone.com">hello@fitzone.com</a></p>
              <p><a href="mailto:trainers@fitzone.com">trainers@fitzone.com</a></p>
            </div>

            <div className="contact-info-block">
              <h3>🕐 Opening Hours</h3>
              <table className="hours-table" aria-label="Opening hours">
                <tbody>
                  <tr><td>Monday – Friday</td><td>5:30 AM – 11:00 PM</td></tr>
                  <tr><td>Saturday</td><td>6:00 AM – 9:00 PM</td></tr>
                  <tr><td>Sunday</td><td>6:00 AM – 9:00 PM</td></tr>
                  <tr><td>Public Holidays</td><td>8:00 AM – 6:00 PM</td></tr>
                </tbody>
              </table>
            </div>

            <div className="contact-info-block">
              <h3>🌐 Follow Us</h3>
              <div className="contact-socials">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">📸 Instagram</a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">👍 Facebook</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">🐦 Twitter</a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">▶️ YouTube</a>
              </div>
            </div>
          </aside>

          {/* Form */}
          <div className="contact-form-wrap">
            <h2>Send Us a Message</h2>
            <p>Fill in the form below and we'll get back to you within 24 hours.</p>
            <Contact />
          </div>

        </div>
      </section>

      {/* Map Placeholder */}
      <section className="map-section" aria-label="Location map">
        <div className="map-placeholder">
          <span aria-hidden="true">🗺️</span>
          <p>123 Fitness Avenue, Sector 18, New Delhi, India 110001</p>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            Open in Google Maps
          </a>
        </div>
      </section>

    </main>
  );
}

export default ContactPage;
