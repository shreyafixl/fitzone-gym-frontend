import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "",
    message: ""
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const interests = [
    "General Membership",
    "Personal Training",
    "Group Classes",
    "Nutrition Consultation",
    "Corporate Membership",
    "Free Trial Session",
    "Other"
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{7,15}$/.test(formData.phone.replace(/[\s\-+()]/g, ""))) {
      newErrors.phone = "Please enter a valid phone number.";
    }
    if (!formData.interest) newErrors.interest = "Please select an area of interest.";
    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", interest: "", message: "" });
    setErrors({});
  };

  if (submitted) {
    return (
      <div className="form-success" role="alert">
        <span className="success-icon" aria-hidden="true">✅</span>
        <h3>Message Sent Successfully!</h3>
        <p>
          Thank you for reaching out, <strong>{formData.name || "there"}</strong>!
          Our team will get back to you within 24 hours.
        </p>
        <button className="btn btn-primary" onClick={() => setSubmitted(false)}>
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate aria-label="Contact form">
      <div className="form-group">
        <label htmlFor="name">Full Name <span aria-hidden="true">*</span></label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Rahul Sharma"
          aria-required="true"
          aria-describedby={errors.name ? "name-error" : undefined}
          className={errors.name ? "input-error" : ""}
        />
        {errors.name && <span id="name-error" className="error-msg" role="alert">{errors.name}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">Email Address <span aria-hidden="true">*</span></label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            aria-required="true"
            aria-describedby={errors.email ? "email-error" : undefined}
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && <span id="email-error" className="error-msg" role="alert">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number <span aria-hidden="true">*</span></label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            aria-required="true"
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={errors.phone ? "input-error" : ""}
          />
          {errors.phone && <span id="phone-error" className="error-msg" role="alert">{errors.phone}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="interest">Area of Interest <span aria-hidden="true">*</span></label>
        <select
          id="interest"
          name="interest"
          value={formData.interest}
          onChange={handleChange}
          aria-required="true"
          aria-describedby={errors.interest ? "interest-error" : undefined}
          className={errors.interest ? "input-error" : ""}
        >
          <option value="">Select an option...</option>
          {interests.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        {errors.interest && <span id="interest-error" className="error-msg" role="alert">{errors.interest}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="message">Your Message <span aria-hidden="true">*</span></label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us about your fitness goals or any questions you have..."
          rows={5}
          aria-required="true"
          aria-describedby={errors.message ? "message-error" : undefined}
          className={errors.message ? "input-error" : ""}
        />
        {errors.message && <span id="message-error" className="error-msg" role="alert">{errors.message}</span>}
      </div>

      <button type="submit" className="btn btn-primary btn-full">
        Send Message
      </button>
    </form>
  );
}

export default Contact;
