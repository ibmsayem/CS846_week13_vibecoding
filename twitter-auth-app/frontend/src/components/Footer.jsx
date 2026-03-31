import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="professional-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>𝕏CS846</h4>
          <p>A modern social platform</p>
        </div>
        <div className="footer-section">
          <h5>Quick Links</h5>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/support">Support</Link></li>
            <li><a href="#privacy">Privacy</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h5>Support</h5>
          <ul>
            <li><Link to="/support">Contact Us</Link></li>
            <li><a href="mailto:support@xcs846.com">Email</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 𝕏CS846. All rights reserved.</p>
      </div>
    </footer>
  );
}
