import React from 'react';

/**
 * Simple layout wrapper that centers content and applies max width.
 */
export default function Layout({ children }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}
