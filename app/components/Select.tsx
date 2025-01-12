'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter, ReadonlyURLSearchParams } from 'next/navigation';

const Select = ({ options, label, parameter, allowMultipleSelections = true, setQueryParameter = true }: { options: { [id: string]: string }, label: string, parameter: string, allowMultipleSelections?: boolean, setQueryParameter?: boolean }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const queryOptions = searchParams.get(parameter);
    if (queryOptions) {
      setSelectedOptions(queryOptions.split(','));
    }
  }, [searchParams, parameter]);

  const handleSelectionChange = (option: string) => {
    let updatedSelections: string[];
    if (allowMultipleSelections) {
      if (selectedOptions.includes(option)) {
        updatedSelections = selectedOptions.filter((item) => item !== option);
      } else {
        updatedSelections = [...selectedOptions, option];
      }
    } else {
      updatedSelections = [option];
    }
    setSelectedOptions(updatedSelections);

    if (setQueryParameter) {
      const queryString = new URLSearchParams(searchParams as ReadonlyURLSearchParams);
      if (updatedSelections.length > 0) {
        queryString.set(parameter, updatedSelections.join(','));
      } else {
        queryString.delete(parameter);
      }
      window.history.replaceState(null, '', `?${queryString.toString()}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left dark:shadow-xl dark:shadow-gray-800 w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className="inline-flex justify-between w-full px-4 py-2 text-sm font-medium text-gray-400 dark:bg-gray-700 rounded border dark:border-gray-600"
      >
        {selectedOptions.length > 0 && allowMultipleSelections
          ? `${label} (${selectedOptions.length})`
          : `${selectedOptions.length > 0 ? options[selectedOptions[0]] : label}`}
        <svg
          className="w-5 h-5 ml-2 -mr-1"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`${isDropdownOpen ? 'block' : 'hidden'} absolute z-50 mt-2 dark:bg-gray-700 dark:text-white rounded shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none w-full`}
      >
        <ul className="py-1 overflow-y-auto text-sm text-white">
          {Object.entries(options).map(([id, value]) => (
            <li key={id} className="px-4 py-2 hover:bg-yellow-300 hover:text-gray-800">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(id)}
                  onChange={() => handleSelectionChange(id)}
                  className="appearance-none w-4 h-4 border border-gray-300 rounded dark:focus:ring-0 dark:focus:ring-yellow-300 dark:focus:outline-none checked:dark:bg-yellow-300 checked:dark:text-gray-900"
                />
                <span className="ml-2">{value}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Select;
