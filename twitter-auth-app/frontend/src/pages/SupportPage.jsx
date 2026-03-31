import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

export default function SupportPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulating form submission
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, you'd send this to your backend
      console.log('Support ticket:', formData);
      
      setSubmitted(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="support-page">
      <div className="support-container">
        <div className="support-header">
          <h1>Support & Contact</h1>
          <p>We're here to help. Get in touch with us.</p>
        </div>

        {submitted ? (
          <div className="support-success">
            <div className="success-icon">✓</div>
            <h2>Thank You!</h2>
            <p>Your message has been received. We'll get back to you shortly.</p>
          </div>
        ) : (
          <div className="support-grid">
            <div className="support-info">
              <div className="info-card">
                <div className="info-icon">📧</div>
                <h3>Email</h3>
                <p>support@xcs846.com</p>
              </div>
              <div className="info-card">
                <div className="info-icon">💬</div>
                <h3>Response Time</h3>
                <p>Within 24 hours</p>
              </div>
              <div className="info-card">
                <div className="info-icon">🕐</div>
                <h3>Hours</h3>
                <p>24/7 Available</p>
              </div>
            </div>

            <form className="support-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Your email"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="What is this about?"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Tell us more..."
                  rows="5"
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
