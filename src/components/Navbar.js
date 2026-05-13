import { useState, useCallback, useMemo } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import AuthModal from "./AuthModal";
import { useAuth, ROLE_ROUTES } from "../contexts/AuthContext";

function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const openLogin  = useCallback(() => { setAuthMode('login');  setAuthOpen(true); }, []);
  const openSignup = useCallback(() => { setAuthMode('signup'); setAuthOpen(true); }, []);
  const closeAuth  = useCallback(() => setAuthOpen(false), []);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

  const navLinks = useMemo(() => [
    { to: "/",            label: "Home"         },
    { to: "/about",       label: "About"        },
    { to: "/classes",     label: "Classes"      },
    { to: "/equipment",   label: "Equipment"    },
    { to: "/facilities",  label: "Facilities"   },
    { to: "/trainers",    label: "Trainers"     },
    { to: "/pricing",     label: "Pricing"      },
    { to: "/gallery",     label: "Gallery"      },
    { to: "/testimonials",label: "Testimonials" },
    { to: "/faq",         label: "FAQ"          },
    { to: "/contact",     label: "Contact"      },
  ], []);

  const toggleMenu = useCallback(() => setMenuOpen(p => !p), []);
  const closeMenu  = useCallback(() => setMenuOpen(false), []);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <Link to="/" className="navbar-logo" aria-label="FitZone Gym Home">
        <span className="logo-icon">⚡</span> FitZone
      </Link>

      {/* Desktop nav links */}
      <ul className="navbar-links">
        {navLinks.map(link => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              end={link.to === "/"}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Desktop right-side actions */}
      <div className="navbar-actions">
        {isLoggedIn ? (
          <>
            <Link to={ROLE_ROUTES[user.role] || '/dashboard'} className="navbar-user-btn">
              <span className="navbar-avatar">{user.avatar || (user.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U')}</span>
              <span className="navbar-username">{user.fullName ? user.fullName.split(' ')[0] : 'User'}</span>
            </Link>
            <button className="navbar-auth-btn navbar-login" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="navbar-auth-btn navbar-login"  onClick={openLogin}>Login</button>
            <button className="navbar-auth-btn navbar-signup" onClick={openSignup}>Sign Up</button>
          </>
        )}
        <ThemeToggle />
        <Link to="/contact" className="navbar-cta">Join Now</Link>
      </div>

      {/* Hamburger */}
      <button
        className="hamburger"
        onClick={toggleMenu}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        <span className={`hamburger-line ${menuOpen ? "open" : ""}`}></span>
        <span className={`hamburger-line ${menuOpen ? "open" : ""}`}></span>
        <span className={`hamburger-line ${menuOpen ? "open" : ""}`}></span>
      </button>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`}>
        <ul>
          {navLinks.map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                end={link.to === "/"}
                onClick={closeMenu}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          {isLoggedIn && (
            <li>
              <NavLink
                to={ROLE_ROUTES[user.role] || '/dashboard'}
                className="nav-link"
                onClick={closeMenu}
              >
                My Dashboard
              </NavLink>
            </li>
          )}
        </ul>

        <div className="mobile-auth-btns">
          {isLoggedIn ? (
            <button
              className="navbar-auth-btn navbar-login"
              style={{ flex: 1 }}
              onClick={() => { closeMenu(); handleLogout(); }}
            >
              Logout
            </button>
          ) : (
            <>
              <button className="navbar-auth-btn navbar-login"  onClick={() => { closeMenu(); openLogin(); }}>Login</button>
              <button className="navbar-auth-btn navbar-signup" onClick={() => { closeMenu(); openSignup(); }}>Sign Up</button>
            </>
          )}
        </div>

        {!isLoggedIn && (
          <Link to="/contact" className="navbar-cta mobile-cta" onClick={closeMenu}>
            Join Now
          </Link>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={authOpen} onClose={closeAuth} defaultMode={authMode} />
    </nav>
  );
}

export default Navbar;
