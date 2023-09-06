import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const AppNavbar = () => {
  const [collapse, setCollapse] = useState(false);

  const toggleCollapse = () => {
    setCollapse(!collapse);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <NavLink className="navbar-brand" to="/">EventPlaza</NavLink>
        <button className="navbar-toggler" type="button" onClick={toggleCollapse}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse${collapse ? ' show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <NavLink className="nav-link" exact to="/" onClick={toggleCollapse}>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/events" onClick={toggleCollapse}>Book Tickets</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/create" onClick={toggleCollapse}>Create Event</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/manage" onClick={toggleCollapse}>Manage Event</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;
