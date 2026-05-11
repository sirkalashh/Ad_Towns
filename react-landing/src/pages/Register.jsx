import React, { useEffect } from 'react';
import Signup from '../sections/Signup';
import SEO from '../components/SEO';

export default function Register() {
  useEffect(() => {
    // Scroll to top when entering this page
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <SEO 
        title="Register Your Interest | AdTowns"
        description="Register for AdTowns to secure your shop before launch. Enter the grand competition to win cars, flats, bikes, and cash prizes."
        url="https://adtowns.com/register"
      />
      <Signup />
    </div>
  );
}
