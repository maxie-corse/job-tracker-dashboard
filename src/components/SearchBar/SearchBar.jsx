import React from 'react';
import { RiSearchLine, RiCloseLine } from 'react-icons/ri';
import './SearchBar.css';

function SearchBar({ value, onChange, placeholder = 'Search by company or role…' }) {
  return (
    <div className="search-bar">
      <RiSearchLine className="search-icon" size={16} />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          className="search-clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <RiCloseLine size={14} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
