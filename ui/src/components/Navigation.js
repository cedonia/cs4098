import React from 'react';
 
import { NavLink } from 'react-router-dom';
 
const Navigation = () => {
    return (
       <div>
          <a href="https://cmp24.host.cs.st-andrews.ac.uk/ui">Home</a>
          _____
          <NavLink to="/about">About</NavLink>
       </div>
    );
}
 
export default Navigation;