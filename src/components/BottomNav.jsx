import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const fixedLinks = [
  { to: '/projects', num: '01', label: 'Projects' },
  { to: '/playground', num: '02', label: 'Playground' },
  { to: '/about', num: '03', label: 'About' },
  { to: '/contact', num: '04', label: 'Contact' },
];

export default function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const left = fixedLinks.slice(0, 2);
  const right = fixedLinks.slice(2, 4);

  return (
    <nav className="bottom-nav">
      <div className="nav-group">
        {left.map((link) => (
          <Link key={link.to} to={link.to} className={`nav-link ${currentPath === link.to ? 'active' : ''}`}>
            <span className="nav-num">{link.num}</span> {link.label}
          </Link>
        ))}
      </div>
      <div className="nav-group">
        {right.map((link) => (
          <Link key={link.to} to={link.to} className={`nav-link ${currentPath === link.to ? 'active' : ''}`}>
            <span className="nav-num">{link.num}</span> {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
