import React from 'react';
 
import { NavLink } from 'react-router-dom';
 
const Navigation = () => {
    return (
       <div>
          <NavLink to="/ui">Home</NavLink>
          _____
          <NavLink to="/about">About</NavLink>
       </div>
    );
}
 
export default Navigation;