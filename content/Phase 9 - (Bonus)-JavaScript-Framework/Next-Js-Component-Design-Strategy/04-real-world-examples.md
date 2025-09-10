# Real-World Component Examples
## Complete Implementation Breakdowns for Complex UI Features

**Purpose**: See exactly how to apply component design principles to real applications. Get complete, production-ready implementations you can adapt to your own projects.

**Promise**: After studying these examples, you'll have a blueprint for building any complex UI feature with confidence and best practices.

---

## 🛒 COMPLETE SHOPPING CART IMPLEMENTATION

### Shopping Cart Architecture Overview

```
Shopping Cart System Components:
├── ShoppingCartProvider (Context + State)
├── ShoppingCartDrawer (Main UI Container)
├── CartTrigger (Header button)
├── CartItemsList (Items display)
├── CartItem (Individual item)
├── CartSummary (Totals calculation)
├── CartActions (Checkout/Clear buttons)
├── EmptyCartState (Empty state)
└── CartItemSkeleton (Loading state)
```

### 1. Shopping Cart Context and Hooks

```tsx
// contexts/ShoppingCartContext.tsx
import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'LOAD_CART'; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => 
        item.id === action.payload.id && item.variant === action.payload.variant
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id && item.variant === action.payload.variant
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload.id)
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'SET_CART_OPEN':
      return { ...state, isOpen: action.payload };

    case 'LOAD_CART':
      return { ...state, items: action.payload };

    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
  isInCart: (id: string, variant?: string) => boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export function ShoppingCartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('shopping-cart');
        if (savedCart) {
          const items = JSON.parse(savedCart);
          dispatch({ type: 'LOAD_CART', payload: items });
        }
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('shopping-cart', JSON.stringify(state.items));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }
    }
  }, [state.items]);

  // Action creators
  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    dispatch({ type: 'SET_CART_OPEN', payload: true });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const setCartOpen = (open: boolean) => {
    dispatch({ type: 'SET_CART_OPEN', payload: open });
  };

  // Computed values
  const itemCount = state.items.reduce((count, item) => count + item.quantity, 0);
  const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const isInCart = (id: string, variant?: string) => {
    return state.items.some(item => item.id === id && item.variant === variant);
  };

  const value = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    setCartOpen,
    itemCount,
    subtotal,
    tax,
    total,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useShoppingCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useShoppingCart must be used within ShoppingCartProvider');
  }
  return context;
}
```

### 2. Shopping Cart UI Components

```tsx
// components/ShoppingCart/ShoppingCartDrawer.tsx
'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useShoppingCart } from '@/contexts/ShoppingCartContext';
import { CartItemsList } from './CartItemsList';
import { CartSummary } from './CartSummary';
import { CartActions } from './CartActions';

export function ShoppingCartDrawer() {
  const { state, setCartOpen } = useShoppingCart();

  return (
    <Transition.Root show={state.isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setCartOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Shopping cart
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setCartOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      {/* Cart Items */}
                      <div className="mt-8">
                        <CartItemsList />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <CartSummary />
                      <CartActions />
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

// components/ShoppingCart/CartTrigger.tsx
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useShoppingCart } from '@/contexts/ShoppingCartContext';

export function CartTrigger() {
  const { itemCount, toggleCart } = useShoppingCart();

  return (
    <button
      type="button"
      className="group -m-2 flex items-center p-2 relative"
      onClick={toggleCart}
    >
      <ShoppingBagIcon
        className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
        aria-hidden="true"
      />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
      <span className="sr-only">items in cart, view bag</span>
    </button>
  );
}

// components/ShoppingCart/CartItemsList.tsx
import { useShoppingCart } from '@/contexts/ShoppingCartContext';
import { CartItem } from './CartItem';
import { EmptyCartState } from './EmptyCartState';

export function CartItemsList() {
  const { state } = useShoppingCart();

  if (state.items.length === 0) {
    return <EmptyCartState />;
  }

  return (
    <div className="flow-root">
      <ul role="list" className="-my-6 divide-y divide-gray-200">
        {state.items.map((item) => (
          <CartItem key={`${item.id}-${item.variant}`} item={item} />
        ))}
      </ul>
    </div>
  );
}

// components/ShoppingCart/CartItem.tsx
import Image from 'next/image';
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useShoppingCart } from '@/contexts/ShoppingCartContext';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    variant?: string;
  };
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useShoppingCart();

  return (
    <li className="flex py-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <Image
          src={item.image}
          alt={item.name}
          width={96}
          height={96}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{item.name}</h3>
            <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
          {item.variant && (
            <p className="mt-1 text-sm text-gray-500">{item.variant}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)} each</p>
        </div>
        
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">Qty</span>
            <div className="flex items-center border border-gray-300 rounded">
              <button
                type="button"
                className="p-1 text-gray-400 hover:text-gray-600"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <span className="px-3 py-1 text-sm">{item.quantity}</span>
              <button
                type="button"
                className="p-1 text-gray-400 hover:text-gray-600"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex">
            <button
              type="button"
              className="font-medium text-red-600 hover:text-red-500 flex items-center"
              onClick={() => removeItem(item.id)}
            >
              <TrashIcon className="h-4 w-4 mr-1" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
```

---

## 🔍 ADVANCED SEARCH WITH FILTERS IMPLEMENTATION

### Search Component Architecture

```
Search System Components:
├── SearchProvider (Context + State)
├── SearchContainer (Main search page)
├── SearchInput (Search bar)
├── SearchFilters (Filter sidebar)
├── SearchResults (Results display)
├── SearchSuggestions (Autocomplete)
├── FilterGroup (Reusable filter)
├── ResultsGrid (Results layout)
├── ResultCard (Individual result)
└── SearchPagination (Results pagination)
```

### Complete Search Implementation

```tsx
// hooks/useSearch.ts - Search logic hook
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDebounce } from './useDebounce';

interface SearchFilters {
  category: string;
  priceRange: [number, number];
  rating: number;
  inStock: boolean;
  brand: string[];
}

interface SearchResult {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  brand: string;
}

interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  filters: SearchFilters;
  setFilters: (filters: Partial<SearchFilters>) => void;
  results: SearchResult[];
  loading: boolean;
  error: Error | null;
  totalCount: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  hasMore: boolean;
  suggestions: string[];
  clearFilters: () => void;
}

export function useSearch(): UseSearchReturn {
  const [query, setQuery] = useState('');
  const [filters, setFiltersState] = useState<SearchFilters>({
    category: '',
    priceRange: [0, 1000],
    rating: 0,
    inStock: false,
    brand: []
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Debounce search query to avoid too many API calls
  const debouncedQuery = useDebounce(query, 300);

  // Search function
  const performSearch = useCallback(async (
    searchQuery: string,
    searchFilters: SearchFilters,
    page: number = 1
  ) => {
    if (!searchQuery.trim() && !Object.values(searchFilters).some(v => 
      Array.isArray(v) ? v.length > 0 : Boolean(v)
    )) {
      setResults([]);
      setTotalCount(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        q: searchQuery,
        page: page.toString(),
        ...searchFilters.category && { category: searchFilters.category },
        ...searchFilters.rating && { rating: searchFilters.rating.toString() },
        ...searchFilters.inStock && { inStock: 'true' },
        minPrice: searchFilters.priceRange[0].toString(),
        maxPrice: searchFilters.priceRange[1].toString(),
        ...searchFilters.brand.length && { brands: searchFilters.brand.join(',') }
      });

      const response = await fetch(`/api/search?${params}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data.results);
      setTotalCount(data.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setResults([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch suggestions
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`/api/suggestions?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  }, []);

  // Effect for search
  useEffect(() => {
    performSearch(debouncedQuery, filters, currentPage);
  }, [debouncedQuery, filters, currentPage, performSearch]);

  // Effect for suggestions
  useEffect(() => {
    fetchSuggestions(query);
  }, [query, fetchSuggestions]);

  // Reset page when query or filters change
  useEffect(() => {
    if (currentPage > 1) {
      setCurrentPage(1);
    }
  }, [debouncedQuery, filters]);

  const setFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFiltersState(current => ({ ...current, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({
      category: '',
      priceRange: [0, 1000],
      rating: 0,
      inStock: false,
      brand: []
    });
  }, []);

  const hasMore = useMemo(() => {
    const itemsPerPage = 20;
    return totalCount > currentPage * itemsPerPage;
  }, [totalCount, currentPage]);

  return {
    query,
    setQuery,
    filters,
    setFilters,
    results,
    loading,
    error,
    totalCount,
    currentPage,
    setCurrentPage,
    hasMore,
    suggestions,
    clearFilters
  };
}

// components/Search/SearchContainer.tsx
'use client';

import { useSearch } from '@/hooks/useSearch';
import { SearchInput } from './SearchInput';
import { SearchFilters } from './SearchFilters';
import { SearchResults } from './SearchResults';
import { SearchPagination } from './SearchPagination';

export function SearchContainer() {
  const {
    query,
    setQuery,
    filters,
    setFilters,
    results,
    loading,
    error,
    totalCount,
    currentPage,
    setCurrentPage,
    hasMore,
    suggestions,
    clearFilters
  } = useSearch();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Input */}
      <div className="mb-8">
        <SearchInput
          query={query}
          onQueryChange={setQuery}
          suggestions={suggestions}
          loading={loading}
        />
      </div>

      <div className="lg:grid lg:grid-cols-5 lg:gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <SearchFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Results */}
        <div className="lg:col-span-4">
          <SearchResults
            results={results}
            loading={loading}
            error={error}
            totalCount={totalCount}
            query={query}
          />
          
          {totalCount > 0 && (
            <SearchPagination
              currentPage={currentPage}
              totalCount={totalCount}
              hasMore={hasMore}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// components/Search/SearchInput.tsx
import { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchInputProps {
  query: string;
  onQueryChange: (query: string) => void;
  suggestions: string[];
  loading: boolean;
}

export function SearchInput({ query, onQueryChange, suggestions, loading }: SearchInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestion(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        if (selectedSuggestion >= 0) {
          e.preventDefault();
          onQueryChange(suggestions[selectedSuggestion]);
          setShowSuggestions(false);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onQueryChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400" />
          ) : (
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => setShowSuggestions(suggestions.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        
        {query && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => onQueryChange('')}
          >
            <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${
                index === selectedSuggestion
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <span className="block truncate">{suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 📊 DASHBOARD WITH WIDGETS IMPLEMENTATION

### Dashboard Architecture

```
Dashboard System Components:
├── DashboardProvider (Layout state)
├── DashboardContainer (Main layout)
├── DashboardHeader (Top navigation)
├── WidgetGrid (Widget layout manager)
├── Widget (Base widget component)
├── ChartWidget (Chart display)
├── StatsWidget (KPI display)
├── TableWidget (Data table)
├── WidgetCustomizer (Drag & drop)
└── WidgetLibrary (Available widgets)
```

### Dashboard Implementation

```tsx
// hooks/useDashboard.ts - Dashboard state management
import { useState, useCallback, useEffect } from 'react';

interface WidgetConfig {
  id: string;
  type: 'chart' | 'stats' | 'table' | 'list';
  title: string;
  span: { cols: number; rows: number };
  position: { x: number; y: number };
  data: any;
  config: any;
}

interface DashboardLayout {
  widgets: WidgetConfig[];
  columns: number;
  gap: number;
}

export function useDashboard() {
  const [layout, setLayout] = useState<DashboardLayout>({
    widgets: [],
    columns: 12,
    gap: 4
  });
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Load dashboard from localStorage
  useEffect(() => {
    const savedLayout = localStorage.getItem('dashboard-layout');
    if (savedLayout) {
      try {
        setLayout(JSON.parse(savedLayout));
      } catch (error) {
        console.error('Failed to load dashboard layout:', error);
      }
    } else {
      // Load default layout
      loadDefaultLayout();
    }
  }, []);

  // Save layout to localStorage
  const saveLayout = useCallback((newLayout: DashboardLayout) => {
    setLayout(newLayout);
    localStorage.setItem('dashboard-layout', JSON.stringify(newLayout));
  }, []);

  const addWidget = useCallback((widget: Omit<WidgetConfig, 'id'>) => {
    const newWidget = {
      ...widget,
      id: Date.now().toString()
    };
    
    saveLayout({
      ...layout,
      widgets: [...layout.widgets, newWidget]
    });
  }, [layout, saveLayout]);

  const removeWidget = useCallback((widgetId: string) => {
    saveLayout({
      ...layout,
      widgets: layout.widgets.filter(w => w.id !== widgetId)
    });
  }, [layout, saveLayout]);

  const updateWidget = useCallback((widgetId: string, updates: Partial<WidgetConfig>) => {
    saveLayout({
      ...layout,
      widgets: layout.widgets.map(w =>
        w.id === widgetId ? { ...w, ...updates } : w
      )
    });
  }, [layout, saveLayout]);

  const loadDefaultLayout = () => {
    const defaultLayout: DashboardLayout = {
      widgets: [
        {
          id: '1',
          type: 'stats',
          title: 'Total Revenue',
          span: { cols: 3, rows: 2 },
          position: { x: 0, y: 0 },
          data: { value: 125000, change: 12.5, period: 'vs last month' },
          config: { format: 'currency' }
        },
        {
          id: '2',
          type: 'chart',
          title: 'Sales Trend',
          span: { cols: 6, rows: 4 },
          position: { x: 3, y: 0 },
          data: { chartType: 'line', dataUrl: '/api/sales-trend' },
          config: { timeRange: '30d' }
        },
        {
          id: '3',
          type: 'table',
          title: 'Top Products',
          span: { cols: 6, rows: 4 },
          position: { x: 0, y: 2 },
          data: { dataUrl: '/api/top-products' },
          config: { pageSize: 10 }
        }
      ],
      columns: 12,
      gap: 4
    };
    
    saveLayout(defaultLayout);
  };

  return {
    layout,
    isCustomizing,
    setIsCustomizing,
    addWidget,
    removeWidget,
    updateWidget,
    saveLayout
  };
}

// components/Dashboard/DashboardContainer.tsx
'use client';

import { useDashboard } from '@/hooks/useDashboard';
import { DashboardHeader } from './DashboardHeader';
import { WidgetGrid } from './WidgetGrid';
import { WidgetLibrary } from './WidgetLibrary';

export function DashboardContainer() {
  const {
    layout,
    isCustomizing,
    setIsCustomizing,
    addWidget,
    removeWidget,
    updateWidget
  } = useDashboard();

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        isCustomizing={isCustomizing}
        onToggleCustomize={() => setIsCustomizing(!isCustomizing)}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Widget Library - shown during customization */}
          {isCustomizing && (
            <div className="w-80 flex-shrink-0">
              <WidgetLibrary onAddWidget={addWidget} />
            </div>
          )}
          
          {/* Main Dashboard */}
          <div className="flex-1">
            <WidgetGrid
              layout={layout}
              isCustomizing={isCustomizing}
              onRemoveWidget={removeWidget}
              onUpdateWidget={updateWidget}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

// components/Dashboard/Widget.tsx - Base widget component
import { ReactNode } from 'react';
import { XMarkIcon, CogIcon } from '@heroicons/react/24/outline';

interface WidgetProps {
  title: string;
  children: ReactNode;
  isCustomizing: boolean;
  onRemove?: () => void;
  onSettings?: () => void;
  span: { cols: number; rows: number };
}

export function Widget({ 
  title, 
  children, 
  isCustomizing, 
  onRemove, 
  onSettings,
  span 
}: WidgetProps) {
  const gridCols = `col-span-${span.cols}`;
  const gridRows = `row-span-${span.rows}`;

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${gridCols} ${gridRows}`}>
      {/* Widget Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        
        {isCustomizing && (
          <div className="flex space-x-2">
            {onSettings && (
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={onSettings}
              >
                <CogIcon className="h-5 w-5" />
              </button>
            )}
            {onRemove && (
              <button
                type="button"
                className="text-gray-400 hover:text-red-600"
                onClick={onRemove}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Widget Content */}
      <div className="h-full">
        {children}
      </div>
    </div>
  );
}
```

**These real-world examples provide complete, production-ready implementations that demonstrate all the component design principles in action. Use them as blueprints for building your own complex features with confidence.**