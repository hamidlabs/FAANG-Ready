# Next.js Component Design Fundamentals
## The Complete Low-Level Guide to World-Class Component Architecture

**Purpose**: Master the fundamental principles of Next.js component design from the ground up. This is your complete guide to thinking like a world-class React developer when approaching any component design challenge.

**Promise**: After mastering this system, you'll never struggle with "How should I structure this component?" or "Do I need a hook here?" again. Every design decision will be systematic and professional.

---

## 🎯 THE COMPONENT DESIGN MENTAL MODEL

### The Universal Component Design Questions (Answer These First)

**Before writing ANY component, ask yourself these 4 questions:**

```
1. RESPONSIBILITY: What is this component's single responsibility?
2. DATA: What data does it need and where does that data come from?
3. BEHAVIOR: What user interactions does it handle?
4. PRESENTATION: How does it look and how does that change?
```

**Example: Shopping Cart Button**
```
1. RESPONSIBILITY: Display cart item count and open cart
2. DATA: Cart items count from global state
3. BEHAVIOR: Click to open cart drawer
4. PRESENTATION: Icon + badge, changes color when items > 0
```

### The Component Complexity Scale

**Every component falls into one of these categories:**

```
LEVEL 1: PURE PRESENTATIONAL (No state, no logic)
├── Button, Icon, Typography, Card
├── Props in → JSX out
└── Example: <Button variant="primary">Click me</Button>

LEVEL 2: INTERACTIVE PRESENTATIONAL (Local state only)
├── Input field, Toggle, Modal
├── Manages own UI state only
└── Example: Input with validation styling

LEVEL 3: CONNECTED FUNCTIONAL (External data + logic)
├── UserProfile, ProductCard, SearchResults
├── Fetches data, manages business logic
└── Example: Component that loads user data

LEVEL 4: CONTAINER/ORCHESTRATOR (Multiple concerns)
├── ShoppingCart, Dashboard, ProductListing
├── Coordinates multiple sub-components
└── Example: Full shopping cart with items, totals, actions
```

---

## 📐 THE SINGLE RESPONSIBILITY PRINCIPLE FOR COMPONENTS

### How to Identify Component Boundaries

**Rule: If you use "AND" to describe what your component does, split it.**

#### ❌ Bad: Component doing too much
```tsx
// ShoppingCartAndCheckout component
// Handles cart items AND checkout form AND payment processing
function ShoppingCartAndCheckout() {
  // Too many responsibilities!
}
```

#### ✅ Good: Single responsibility per component
```tsx
// Each component has ONE clear job
function ShoppingCart() {
  // ONLY manages cart items display and basic actions
}

function CheckoutForm() {
  // ONLY handles checkout form data
}

function PaymentProcessor() {
  // ONLY handles payment logic
}
```

### The Component Responsibility Matrix

**Use this to determine what belongs in each component:**

```
DATA DISPLAY COMPONENTS:
├── Show information to user
├── Format data for presentation
├── Handle basic display state (show/hide)
└── Examples: ProductCard, UserAvatar, Statistics

DATA INPUT COMPONENTS:
├── Collect user input
├── Validate input format
├── Manage input state
└── Examples: LoginForm, SearchBar, Filter

ACTION COMPONENTS:
├── Trigger business operations
├── Handle side effects
├── Coordinate with external systems
└── Examples: AddToCartButton, ShareButton, DeleteButton

LAYOUT COMPONENTS:
├── Arrange other components
├── Handle responsive behavior
├── Manage visual hierarchy
└── Examples: Grid, Layout, Sidebar, Modal
```

---

## 🔄 STATE MANAGEMENT DECISION TREE

### The State Decision Framework

**For ANY piece of data, ask these questions in order:**

```
1. Is this data shared between components?
   ├── YES → Use global state (Context, Zustand, Redux)
   └── NO → Continue to question 2

2. Does this data persist across page reloads?
   ├── YES → Use localStorage + state
   └── NO → Continue to question 3

3. Does this data come from the server?
   ├── YES → Use data fetching (SWR, React Query)
   └── NO → Continue to question 4

4. Does this data control UI behavior only?
   ├── YES → Use local component state (useState)
   └── NO → Reconsider your data architecture
```

### State Management Examples

#### Local Component State (useState)
```tsx
// Use for: UI-only state that doesn't need sharing
function Modal({ isOpen, onClose, children }) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  // isAnimating is purely for this modal's animation
  // No other component needs to know about it
}
```

#### Global State (Context)
```tsx
// Use for: Data shared across multiple components
const CartContext = createContext();

function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  
  // Multiple components need cart data:
  // - Header (item count)
  // - Cart drawer (item list)
  // - Product pages (add to cart)
}
```

#### Server State (SWR/React Query)
```tsx
// Use for: Data from APIs
function ProductList() {
  const { data, error, loading } = useSWR('/api/products', fetcher);
  
  // Server state handles:
  // - Loading states
  // - Error handling
  // - Caching
  // - Revalidation
}
```

---

## 🪝 HOOKS DECISION FRAMEWORK

### When to Create a Custom Hook

**Create a custom hook when you have ANY of these:**

```
1. REPEATED LOGIC: Same useState/useEffect pattern in multiple components
2. COMPLEX STATE: Multiple related state variables that change together
3. SIDE EFFECTS: API calls, subscriptions, or external integrations
4. COMPUTED VALUES: Derived state that needs memoization
5. CLEANUP LOGIC: useEffect with cleanup functions
```

### Hook Design Patterns

#### Pattern 1: Data Fetching Hook
```tsx
// Use when: Multiple components need same API data
function useProduct(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;
    
    setLoading(true);
    fetchProduct(productId)
      .then(setProduct)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [productId]);

  return { product, loading, error };
}
```

#### Pattern 2: State Management Hook
```tsx
// Use when: Complex state logic needs reuse
function useShoppingCart() {
  const [items, setItems] = useState([]);

  const addItem = useCallback((product) => {
    setItems(current => {
      const existing = current.find(item => item.id === product.id);
      if (existing) {
        return current.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems(current => current.filter(item => item.id !== productId));
  }, []);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [items]);

  return { items, addItem, removeItem, total };
}
```

#### Pattern 3: Effect Hook
```tsx
// Use when: Side effects need to be reused
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}
```

---

## 🎨 COMPONENT COMPOSITION PATTERNS

### Container/Presentational Pattern

**Split logic from presentation for maximum reusability:**

#### Container Component (Smart)
```tsx
// Handles: Data fetching, business logic, state management
function ProductListContainer() {
  const { products, loading, error } = useProducts();
  const { addToCart } = useShoppingCart();

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success('Added to cart!');
  };

  if (loading) return <ProductListSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <ProductListPresentation
      products={products}
      onAddToCart={handleAddToCart}
    />
  );
}
```

#### Presentational Component (Dumb)
```tsx
// Handles: Only rendering, no business logic
function ProductListPresentation({ products, onAddToCart }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={() => onAddToCart(product)}
        />
      ))}
    </div>
  );
}
```

### Compound Component Pattern

**Use for components with multiple related parts:**

```tsx
// Perfect for: Modals, Cards, Forms with sections
function Card({ children, className = '' }) {
  return (
    <div className={`bg-white shadow-md rounded-lg ${className}`}>
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 border-b ${className}`}>
      {children}
    </div>
  );
};

Card.Body = function CardBody({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 border-t bg-gray-50 ${className}`}>
      {children}
    </div>
  );
};

// Usage:
<Card>
  <Card.Header>
    <h3>Product Name</h3>
  </Card.Header>
  <Card.Body>
    <p>Product description...</p>
  </Card.Body>
  <Card.Footer>
    <Button>Add to Cart</Button>
  </Card.Footer>
</Card>
```

---

## 🏗️ COMPONENT FILE STRUCTURE

### The Standard Component Architecture

**Every component should follow this structure:**

```
components/
├── ProductCard/
│   ├── index.ts                 // Export barrel
│   ├── ProductCard.tsx          // Main component
│   ├── ProductCard.test.tsx     // Unit tests
│   ├── ProductCard.stories.tsx  // Storybook stories
│   ├── ProductCard.module.css   // Styles (if using CSS modules)
│   └── hooks/                   // Component-specific hooks
│       └── useProductCard.ts
```

#### Component Template Structure
```tsx
// ProductCard.tsx
import React from 'react';
import { ProductCardProps } from './types';
import { useProductCard } from './hooks/useProductCard';
import styles from './ProductCard.module.css';

/**
 * ProductCard displays product information with add to cart functionality
 * 
 * @param product - Product data to display
 * @param onAddToCart - Callback when add to cart is clicked
 */
export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const {
    isLoading,
    handleAddToCart,
    isInCart
  } = useProductCard(product, onAddToCart);

  return (
    <div className={styles.card}>
      {/* Component JSX */}
    </div>
  );
}

// Types
export interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

// Export barrel (index.ts)
export { ProductCard } from './ProductCard';
export type { ProductCardProps } from './ProductCard';
```

---

## 🎯 NEXT.JS SPECIFIC PATTERNS

### Server vs Client Components Decision Tree

**Choose Server Components when:**
```
✅ Component only displays data
✅ No user interactions needed
✅ Data comes from database/API
✅ Better SEO is important
✅ Faster initial page load desired

Examples: ProductDisplay, BlogPost, UserProfile (read-only)
```

**Choose Client Components when:**
```
✅ User interactions required
✅ Browser APIs needed
✅ State management required
✅ Real-time updates needed
✅ Third-party interactive libraries

Examples: SearchBar, ShoppingCart, Modal, Form
```

### Server Component Example
```tsx
// app/products/[id]/ProductDisplay.tsx
// This is a Server Component (default in app directory)

import { getProduct } from '@/lib/api';

interface ProductDisplayProps {
  productId: string;
}

export default async function ProductDisplay({ productId }: ProductDisplayProps) {
  // This runs on the server
  const product = await getProduct(productId);

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <img src={product.image} alt={product.name} />
      {/* No interactivity, perfect for server component */}
    </div>
  );
}
```

### Client Component Example
```tsx
// components/AddToCartButton.tsx
'use client'; // This makes it a Client Component

import { useState } from 'react';
import { useShoppingCart } from '@/hooks/useShoppingCart';

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useShoppingCart();

  const handleClick = async () => {
    setIsLoading(true);
    await addItem(product);
    setIsLoading(false);
  };

  return (
    <button 
      onClick={handleClick}
      disabled={isLoading}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

---

## 📋 COMPONENT DESIGN CHECKLIST

### Before Writing Any Component

- [ ] **Single Responsibility**: Component has one clear job
- [ ] **Name is Clear**: Component name explains its purpose
- [ ] **Props are Minimal**: Only necessary data is passed down
- [ ] **State Location Decided**: Local vs global state choice made
- [ ] **Server vs Client**: Chosen based on interactivity needs

### During Development

- [ ] **TypeScript Types**: All props and state properly typed
- [ ] **Error Boundaries**: Error handling strategy in place
- [ ] **Loading States**: Loading and error states handled
- [ ] **Accessibility**: Proper ARIA labels and keyboard navigation
- [ ] **Performance**: Memoization where needed, no unnecessary re-renders

### Before Shipping

- [ ] **Tests Written**: Unit tests cover main functionality
- [ ] **Storybook Story**: Component documented in Storybook
- [ ] **Mobile Responsive**: Works on all screen sizes
- [ ] **Performance Tested**: No performance bottlenecks
- [ ] **Code Review**: Another developer has reviewed the code

---

## 🚀 QUICK START DECISION FLOWCHART

```
START: I need to build a component
├─ What does it do?
│  ├─ Shows data only → Server Component
│  ├─ Handles user input → Client Component
│  └─ Coordinates other components → Container Pattern
│
├─ What data does it need?
│  ├─ Props from parent → Simple component
│  ├─ API data → Add data fetching hook
│  ├─ Global state → Connect to context/store
│  └─ Local UI state → Add useState
│
├─ How complex is the logic?
│  ├─ Simple → Keep in component
│  ├─ Reusable → Extract to custom hook
│  └─ Complex → Split into smaller components
│
└─ How will it be tested?
   ├─ Pure function → Easy unit tests
   ├─ With hooks → Test with React Testing Library
   └─ Integration → Add integration tests
```

**Master this foundation, and you'll approach every component design with confidence and systematic thinking. The next guide will show you how to apply these principles to real-world examples like shopping carts, dashboards, and complex forms.**