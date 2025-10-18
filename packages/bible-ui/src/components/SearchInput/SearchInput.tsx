import React from 'react';
import { clsx } from 'clsx';
import { Search, X } from 'lucide-react';
import './SearchInput.css';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  showClear?: boolean;
  isLoading?: boolean;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, showClear = false, isLoading = false, className, ...props }, ref) => {
    return (
      <div className={clsx('search-input', className)}>
        <div className="search-input__wrapper">
          <Search className="search-input__icon" size={20} />
          <input
            ref={ref}
            className="search-input__field"
            placeholder="Search Bible verses..."
            {...props}
          />
          {showClear && (
            <button
              onClick={onClear}
              className="search-input__clear"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
          {isLoading && (
            <div className="search-input__spinner" />
          )}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
