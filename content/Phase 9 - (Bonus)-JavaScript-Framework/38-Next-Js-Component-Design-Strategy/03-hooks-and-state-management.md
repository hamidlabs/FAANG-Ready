# Hooks and State Management Mastery
## Complete Guide to Custom Hooks, State Architecture, and Data Flow Patterns

**Purpose**: Master when to use hooks vs state, how to design custom hooks, and build scalable state architectures. Never wonder "Should I use useState, useContext, or a custom hook?" again.

**Promise**: After mastering this system, you'll architect state management like a senior developer, creating maintainable and performant applications.

---

## 🎯 THE COMPLETE STATE MANAGEMENT MENTAL MODEL

### The State Decision Tree (Use This Every Time)

```
FOR ANY PIECE OF DATA, ASK:

1. IS IT SERVER DATA?
   ├── YES → Use SWR/React Query/Server State
   └── NO → Continue to question 2

2. IS IT SHARED BETWEEN COMPONENTS?
   ├── YES → Use Context/Global State
   └── NO → Continue to question 3

3. DOES IT PERSIST ACROSS PAGE RELOADS?
   ├── YES → Use localStorage + useState
   └── NO → Continue to question 4

4. IS IT COMPLEX LOGIC?
   ├── YES → Create custom hook
   └── NO → Use simple useState

5. IS IT JUST UI STATE?
   ├── YES → Keep in component with useState
   └── NO → Reconsider architecture
```

### State Types and Their Solutions

```
UI STATE (Component-only):
├── Modal open/closed
├── Form input values
├── Loading states for actions
└── Hover/focus states
Solution: useState in component

SHARED STATE (Cross-component):
├── User authentication
├── Shopping cart contents
├── Theme preferences
└── Language settings
Solution: Context or global state

SERVER STATE (From APIs):
├── User profile data
├── Product listings
├── Real-time notifications
└── Search results
Solution: SWR, React Query, or custom fetch hooks

DERIVED STATE (Computed):
├── Cart total from items
├── Form validation status
├── Filtered/sorted lists
└── Search result counts
Solution: useMemo or custom hooks
```

---

## 🪝 CUSTOM HOOKS PATTERNS AND TEMPLATES

### Hook Pattern 1: Data Fetching Hook

**Use when**: Multiple components need the same API data

```tsx
// useProduct.ts - Complete data fetching hook template
import { useState, useEffect, useCallback } from 'react';

interface UseProductReturn {
  product: Product | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useProduct(productId: string): UseProductReturn {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.statusText}`);
      }
      
      const productData = await response.json();
      setProduct(productData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const refetch = useCallback(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, loading, error, refetch };
}

// Usage in component:
function ProductCard({ productId }: { productId: string }) {
  const { product, loading, error, refetch } = useProduct(productId);

  if (loading) return <ProductSkeleton />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  if (!product) return <NotFound />;

  return <ProductDisplay product={product} />;
}
```

### Hook Pattern 2: Complex State Management Hook

**Use when**: Complex state logic needs to be reused

```tsx
// useShoppingCart.ts - Complex state management template
import { useState, useCallback, useMemo, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface UseShoppingCartReturn {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

export function useShoppingCart(): UseShoppingCartReturn {
  // Load initial state from localStorage
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    
    try {
      const saved = localStorage.getItem('shopping-cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage whenever items change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('shopping-cart', JSON.stringify(items));
    }
  }, [items]);

  // Add item to cart (or update quantity if exists)
  const addItem = useCallback((product: Product) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return currentItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...currentItems, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      }];
    });
  }, []);

  // Remove item completely
  const removeItem = useCallback((productId: string) => {
    setItems(currentItems => 
      currentItems.filter(item => item.id !== productId)
    );
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeItem]);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Check if product is in cart
  const isInCart = useCallback((productId: string) => {
    return items.some(item => item.id === productId);
  }, [items]);

  // Computed values (memoized for performance)
  const itemCount = useMemo(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [items]);

  const tax = useMemo(() => {
    return subtotal * 0.08; // 8% tax
  }, [subtotal]);

  const total = useMemo(() => {
    return subtotal + tax;
  }, [subtotal, tax]);

  return {
    items,
    itemCount,
    subtotal,
    tax,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart
  };
}

// Usage in components:
function Header() {
  const { itemCount } = useShoppingCart();
  return <CartIcon count={itemCount} />;
}

function ProductCard({ product }: { product: Product }) {
  const { addItem, isInCart } = useShoppingCart();
  
  return (
    <div>
      {/* Product display */}
      <button 
        onClick={() => addItem(product)}
        disabled={isInCart(product.id)}
      >
        {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
      </button>
    </div>
  );
}
```

### Hook Pattern 3: Form Management Hook

**Use when**: Complex forms with validation and submission

```tsx
// useForm.ts - Generic form management template
import { useState, useCallback, useMemo } from 'react';

type ValidationRule<T> = (value: T) => string | null;

interface UseFormConfig<T> {
  initialValues: T;
  validationRules?: Partial<Record<keyof T, ValidationRule<T[keyof T]>>>;
  onSubmit: (values: T) => Promise<void> | void;
}

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  setValue: (field: keyof T, value: T[keyof T]) => void;
  setFieldTouched: (field: keyof T) => void;
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit
}: UseFormConfig<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate individual field
  const validateField = useCallback((field: keyof T, value: T[keyof T]) => {
    const rule = validationRules[field];
    return rule ? rule(value) : null;
  }, [validationRules]);

  // Get current errors
  const errors = useMemo(() => {
    const currentErrors: Partial<Record<keyof T, string>> = {};
    
    Object.keys(values).forEach(key => {
      const field = key as keyof T;
      const error = validateField(field, values[field]);
      if (error) {
        currentErrors[field] = error;
      }
    });
    
    return currentErrors;
  }, [values, validateField]);

  // Check if form is valid
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  // Set field value
  const setValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setValues(current => ({
      ...current,
      [field]: value
    }));
  }, []);

  // Mark field as touched
  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched(current => ({
      ...current,
      [field]: true
    }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) {
      // Mark all fields as touched to show errors
      const allTouched: Partial<Record<keyof T, boolean>> = {};
      Object.keys(values).forEach(key => {
        allTouched[key as keyof T] = true;
      });
      setTouched(allTouched);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, isValid, onSubmit]);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    setValue,
    setFieldTouched,
    handleSubmit,
    resetForm
  };
}

// Usage example:
interface LoginFormData {
  email: string;
  password: string;
}

function LoginForm() {
  const {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    setValue,
    setFieldTouched,
    handleSubmit
  } = useForm<LoginFormData>({
    initialValues: {
      email: '',
      password: ''
    },
    validationRules: {
      email: (value) => {
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
        return null;
      },
      password: (value) => {
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return null;
      }
    },
    onSubmit: async (data) => {
      // Submit logic
      await loginUser(data);
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          value={values.email}
          onChange={(e) => setValue('email', e.target.value)}
          onBlur={() => setFieldTouched('email')}
          placeholder="Email"
        />
        {touched.email && errors.email && (
          <span className="error">{errors.email}</span>
        )}
      </div>
      
      <div>
        <input
          type="password"
          value={values.password}
          onChange={(e) => setValue('password', e.target.value)}
          onBlur={() => setFieldTouched('password')}
          placeholder="Password"
        />
        {touched.password && errors.password && (
          <span className="error">{errors.password}</span>
        )}
      </div>
      
      <button 
        type="submit" 
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

---

## 🌐 GLOBAL STATE MANAGEMENT PATTERNS

### Context Pattern: Theme and User State

**Use when**: Data needed across many components, changes infrequently

```tsx
// contexts/AppContext.tsx - Complete context setup
import { createContext, useContext, useReducer, ReactNode } from 'react';

// State shape
interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  language: 'en' | 'es' | 'fr';
  notifications: Notification[];
}

// Actions
type AppAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'es' | 'fr' }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string };

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [...state.notifications, action.payload] 
      };
    
    case 'REMOVE_NOTIFICATION':
      return { 
        ...state, 
        notifications: state.notifications.filter(n => n.id !== action.payload) 
      };
    
    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Convenience methods
  setUser: (user: User | null) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'en' | 'es' | 'fr') => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, {
    user: null,
    theme: 'light',
    language: 'en',
    notifications: []
  });

  // Convenience methods
  const setUser = (user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const setTheme = (theme: 'light' | 'dark') => {
    dispatch({ type: 'SET_THEME', payload: theme });
    localStorage.setItem('theme', theme);
  };

  const setLanguage = (language: 'en' | 'es' | 'fr') => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
    localStorage.setItem('language', language);
  };

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const fullNotification = {
      ...notification,
      id: Date.now().toString()
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: fullNotification });
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const value = {
    state,
    dispatch,
    setUser,
    setTheme,
    setLanguage,
    addNotification,
    removeNotification
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use context
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}

// Specific hooks for common use cases
export function useUser() {
  const { state, setUser } = useAppContext();
  return { user: state.user, setUser };
}

export function useTheme() {
  const { state, setTheme } = useAppContext();
  return { theme: state.theme, setTheme };
}

// Usage in components:
function Header() {
  const { user } = useUser();
  const { theme, setTheme } = useTheme();
  
  return (
    <header className={`header ${theme}`}>
      {user && <span>Welcome, {user.name}</span>}
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </header>
  );
}
```

---

## 📊 SERVER STATE MANAGEMENT WITH SWR

### SWR Pattern: API Data Management

**Use when**: Data comes from APIs and needs caching/revalidation

```tsx
// hooks/useProducts.ts - SWR with custom logic
import useSWR from 'swr';
import { useState, useMemo } from 'react';

interface UseProductsOptions {
  category?: string;
  search?: string;
  sortBy?: 'name' | 'price' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export function useProducts(options: UseProductsOptions = {}) {
  const { category, search, sortBy = 'name', sortOrder = 'asc' } = options;
  
  // Build query string
  const queryParams = new URLSearchParams();
  if (category) queryParams.set('category', category);
  if (search) queryParams.set('search', search);
  queryParams.set('sortBy', sortBy);
  queryParams.set('sortOrder', sortOrder);
  
  const queryString = queryParams.toString();
  const key = queryString ? `/api/products?${queryString}` : '/api/products';
  
  // SWR hook
  const { data, error, isLoading, mutate } = useSWR(
    key,
    async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Local filtering state (for instant feedback)
  const [localFilters, setLocalFilters] = useState({
    minPrice: 0,
    maxPrice: Infinity,
    inStock: false
  });

  // Apply local filters to server data
  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];
    
    return data.products.filter(product => {
      if (product.price < localFilters.minPrice) return false;
      if (product.price > localFilters.maxPrice) return false;
      if (localFilters.inStock && product.stock <= 0) return false;
      return true;
    });
  }, [data?.products, localFilters]);

  return {
    products: filteredProducts,
    totalCount: data?.totalCount || 0,
    loading: isLoading,
    error,
    refetch: mutate,
    localFilters,
    setLocalFilters
  };
}

// Usage in components:
function ProductListPage() {
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    sortBy: 'name' as const,
    sortOrder: 'asc' as const
  });

  const {
    products,
    totalCount,
    loading,
    error,
    localFilters,
    setLocalFilters
  } = useProducts(filters);

  if (loading) return <ProductsSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <ProductFilters 
        filters={filters}
        onFiltersChange={setFilters}
        localFilters={localFilters}
        onLocalFiltersChange={setLocalFilters}
      />
      
      <ProductGrid products={products} />
      
      <div>Showing {products.length} of {totalCount} products</div>
    </div>
  );
}
```

---

## 🎯 STATE MANAGEMENT DECISION GUIDE

### Quick Decision Matrix

| **Data Type** | **Sharing Scope** | **Frequency** | **Solution** |
|---------------|-------------------|---------------|--------------|
| UI State | Component only | High | `useState` |
| Form Data | Form only | Medium | `useForm` hook |
| Shopping Cart | App-wide | Medium | Context + localStorage |
| User Auth | App-wide | Low | Context |
| API Data | Multiple components | Variable | SWR/React Query |
| Theme/Settings | App-wide | Low | Context + localStorage |

### Performance Optimization Guidelines

```tsx
// ❌ Don't: Put everything in one context
const AppContext = createContext({
  user,
  theme, 
  cart,
  products,
  notifications,
  // ... everything
});

// ✅ Do: Split contexts by concern
const UserContext = createContext(userState);
const ThemeContext = createContext(themeState);
const CartContext = createContext(cartState);

// ❌ Don't: Context for frequently changing data
const MousePositionContext = createContext({ x: 0, y: 0 });

// ✅ Do: Local state for frequently changing data
function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  // Handle mouse movement
  return position;
}
```

**Master these state management patterns, and you'll architect applications with clean data flow, optimal performance, and maintainable code. The next guide will show you complete real-world examples and advanced optimization techniques.**