import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const allLinks = [
  { to: '/', num: '00', label: 'Home' },
  { to: '/projects', num: '01', label: 'Projects' },
  { to: '/playground', num: '02', label: 'Playground' },
  { to: '/about', num: '03', label: 'About' },
  { to: '/contact', num: '04', label: 'Contact' },
];

export default function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Show 4 links, excluding the current page
  const links = allLinks.filter((l) => l.to !== currentPath).slice(0, 4);
  const left = links.slice(0, 2);
  const right = links.slice(2, 4);

  return (
    <nav className="bottom-nav">
      <div className="nav-group">
        {left.map((link) => (
          <Link key={link.to} to={link.to} className="nav-link">
            <span className="nav-num">{link.num}</span> {link.label}
          </Link>
        ))}
      </div>
      <div className="nav-group">
        {right.map((link) => (
          <Link key={link.to} to={link.to} className="nav-link">
            <span className="nav-num">{link.num}</span> {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
