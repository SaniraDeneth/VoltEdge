'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
  id: string;
  name: string;
}

interface CustomSelectProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export default function CustomSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  error,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">
        {label}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex w-full items-center justify-between rounded-xl border bg-white px-4 py-3.5 text-sm font-medium transition-all ${
            error 
              ? 'border-red-500 ring-4 ring-red-500/10' 
              : isOpen 
                ? 'border-accent ring-4 ring-accent/10' 
                : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className={selectedOption ? 'text-slate-900' : 'text-slate-400'}>
            {selectedOption ? selectedOption.name : placeholder}
          </span>
          <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 right-0 z-[100] mt-2 max-h-60 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl"
            >
              {options.length > 0 ? (
                options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      onChange(option.id);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-bold transition-all ${
                      value === option.id
                        ? 'bg-accent text-white shadow-lg shadow-accent/20'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {option.name}
                    {value === option.id && <Check className="h-4 w-4" />}
                  </button>
                ))
              ) : (
                <div className="px-3.5 py-2.5 text-sm text-slate-400">No options available</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {error && <p className="mt-1 text-xs font-bold text-red-500 ml-1">{error}</p>}
    </div>
  );
}
