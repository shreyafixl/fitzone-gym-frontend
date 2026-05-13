import { useState } from "react";
import { Link } from "react-router-dom";
import faqData from "../data/faqData";

function FAQPage() {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <main className="faq-page">

      <section className="page-hero" aria-labelledby="faq-heading">
        <div className="section-container">
          <h1 id="faq-heading">Frequently Asked Questions</h1>
          <p>
            Got questions? We have answers. If you don't find what you're looking for,
            feel free to reach out to our team directly.
          </p>
        </div>
      </section>

      <section className="faq-content-section" aria-labelledby="faq-list-heading">
        <div className="section-container faq-container">
          <h2 id="faq-list-heading" className="sr-only">FAQ List</h2>
          <div className="faq-list">
            {faqData.map((faq) => (
              <div
                className={`faq-item ${openId === faq.id ? "faq-item--open" : ""}`}
                key={faq.id}
              >
                <button
                  className="faq-question"
                  onClick={() => toggle(faq.id)}
                  aria-expanded={openId === faq.id}
                  aria-controls={`faq-answer-${faq.id}`}
                  id={`faq-btn-${faq.id}`}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon" aria-hidden="true">
                    {openId === faq.id ? "−" : "+"}
                  </span>
                </button>
                <div
                  id={`faq-answer-${faq.id}`}
                  className="faq-answer"
                  role="region"
                  aria-labelledby={`faq-btn-${faq.id}`}
                  hidden={openId !== faq.id}
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner" aria-labelledby="faq-cta-heading">
        <div className="section-container cta-banner-content">
          <h2 id="faq-cta-heading">Still Have Questions?</h2>
          <p>Our team is happy to help. Reach out and we'll get back to you within 24 hours.</p>
          <Link to="/contact" className="btn btn-primary">Contact Us</Link>
        </div>
      </section>

    </main>
  );
}

export default FAQPage;
