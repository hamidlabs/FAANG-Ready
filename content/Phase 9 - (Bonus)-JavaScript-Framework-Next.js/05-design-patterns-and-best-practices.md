# Design Patterns and Best Practices
## Advanced Patterns, Performance Optimization, and Production-Ready Techniques

**Purpose**: Master advanced component design patterns, performance optimization techniques, and industry best practices for building scalable Next.js applications.

**Promise**: After mastering this guide, you'll write components that perform optimally, scale effortlessly, and follow industry standards used by senior developers at top companies.

---

## 🎯 THE COMPLETE COMPONENT DESIGN DECISION TREE

### Ultimate Component Decision Framework

```
START: I need to build a feature
│
├─ STEP 1: Analyze the Feature
│  ├─ What does it do? (Single responsibility)
│  ├─ Who uses it? (User interaction level)
│  ├─ Where is it used? (Reusability scope)
│  └─ When does it change? (Update frequency)
│
├─ STEP 2: Choose Architecture Pattern
│  ├─ Simple Display → Presentational Component
│  ├─ User Interaction → Interactive Component
│  ├─ Data Management → Container Component
│  ├─ Layout/Structure → Compound Component
│  └─ Complex Feature → Feature Module
│
├─ STEP 3: Determine State Strategy
│  ├─ UI State → useState in component
│  ├─ Form State → Custom form hook
│  ├─ Shared State → Context or global store
│  ├─ Server State → SWR/React Query
│  └─ Derived State → useMemo/computed
│
├─ STEP 4: Performance Optimization
│  ├─ Heavy Computation → useMemo
│  ├─ Expensive Functions → useCallback
│  ├─ Large Lists → React.memo + virtualization
│  ├─ Conditional Rendering → Lazy loading
│  └─ Bundle Size → Dynamic imports
│
└─ STEP 5: Testing Strategy
   ├─ Pure Components → Unit tests
   ├─ Interactive Components → Integration tests
   ├─ Data Components → Mock data tests
   └─ Feature Modules → E2E tests
```

---

## 🏗️ ADVANCED COMPONENT PATTERNS

### Pattern 1: Compound Components with Context

**Use when**: Creating reusable components with multiple related parts

```tsx
// components/Card/CardContext.tsx
import { createContext, useContext, ReactNode } from 'react';

interface CardContextValue {
  size: 'sm' | 'md' | 'lg';
  variant: 'default' | 'outlined' | 'elevated';
}

const CardContext = createContext<CardContextValue | null>(null);

export function useCardContext() {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('Card compound components must be used within Card');
  }
  return context;
}

// components/Card/Card.tsx - Main compound component
interface CardProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'elevated';
  className?: string;
}

export function Card({ 
  children, 
  size = 'md', 
  variant = 'default', 
  className = '' 
}: CardProps) {
  const baseClasses = 'rounded-lg';
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  const variantClasses = {
    default: 'bg-white',
    outlined: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-lg'
  };

  return (
    <CardContext.Provider value={{ size, variant }}>
      <div className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
        {children}
      </div>
    </CardContext.Provider>
  );
}

// Compound component parts
Card.Header = function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { size } = useCardContext();
  const sizeClasses = {
    sm: 'text-lg mb-2',
    md: 'text-xl mb-3',
    lg: 'text-2xl mb-4'
  };

  return (
    <div className={`font-semibold ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
};

Card.Body = function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`text-gray-600 ${className}`}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { size } = useCardContext();
  const marginClasses = {
    sm: 'mt-3',
    md: 'mt-4',
    lg: 'mt-6'
  };

  return (
    <div className={`${marginClasses[size]} ${className}`}>
      {children}
    </div>
  );
};

// Usage example:
function ProductCard({ product }: { product: Product }) {
  return (
    <Card size="md" variant="elevated">
      <Card.Header>
        {product.name}
      </Card.Header>
      <Card.Body>
        <p>{product.description}</p>
        <p className="text-2xl font-bold mt-2">${product.price}</p>
      </Card.Body>
      <Card.Footer>
        <Button>Add to Cart</Button>
      </Card.Footer>
    </Card>
  );
}
```

### Pattern 2: Render Props Pattern

**Use when**: Sharing logic while giving consumers control over rendering

```tsx
// components/DataFetcher/DataFetcher.tsx
import { ReactNode } from 'react';
import { useSWR } from 'swr';

interface DataFetcherProps<T> {
  url: string;
  children: (data: {
    data: T | undefined;
    loading: boolean;
    error: Error | undefined;
    refetch: () => void;
  }) => ReactNode;
}

export function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const { data, error, isLoading, mutate } = useSWR<T>(url);

  return (
    <>
      {children({
        data,
        loading: isLoading,
        error,
        refetch: mutate
      })}
    </>
  );
}

// Usage examples:
function UserProfile({ userId }: { userId: string }) {
  return (
    <DataFetcher<User> url={`/api/users/${userId}`}>
      {({ data: user, loading, error, refetch }) => {
        if (loading) return <UserSkeleton />;
        if (error) return <ErrorMessage error={error} onRetry={refetch} />;
        if (!user) return <NotFound />;

        return (
          <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            <img src={user.avatar} alt={user.name} />
          </div>
        );
      }}
    </DataFetcher>
  );
}

function ProductList({ category }: { category: string }) {
  return (
    <DataFetcher<Product[]> url={`/api/products?category=${category}`}>
      {({ data: products, loading, error }) => (
        <div>
          {loading && <ProductGridSkeleton />}
          {error && <ErrorBanner error={error} />}
          {products && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}
    </DataFetcher>
  );
}
```

### Pattern 3: Higher-Order Component (HOC) Pattern

**Use when**: Adding common functionality to multiple components

```tsx
// hocs/withAuth.tsx
import { ComponentType, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface WithAuthOptions {
  redirectTo?: string;
  requireAuth?: boolean;
}

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const { redirectTo = '/login', requireAuth = true } = options;

  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (requireAuth && !user) {
          router.push(redirectTo);
        } else if (!requireAuth && user) {
          router.push('/dashboard');
        }
      }
    }, [user, loading, router]);

    // Show loading while checking authentication
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
        </div>
      );
    }

    // Don't render if auth requirements aren't met
    if (requireAuth && !user) {
      return null;
    }

    if (!requireAuth && user) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

// Usage:
const ProtectedDashboard = withAuth(Dashboard, { requireAuth: true });
const PublicLogin = withAuth(LoginPage, { requireAuth: false, redirectTo: '/dashboard' });
```

### Pattern 4: Custom Hook with Component Pattern

**Use when**: Complex logic needs both hook and component interfaces

```tsx
// hooks/useModal.ts
import { useState, useCallback } from 'react';

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);

  const openModal = useCallback((modalContent: React.ReactNode) => {
    setContent(modalContent);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setContent(null), 150); // Allow animation to complete
  }, []);

  const toggleModal = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    isOpen,
    content,
    openModal,
    closeModal,
    toggleModal
  };
}

// components/Modal/ModalProvider.tsx
import { createContext, useContext, ReactNode } from 'react';
import { useModal } from '@/hooks/useModal';
import { Modal } from './Modal';

interface ModalContextValue {
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
  isOpen: boolean;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const modal = useModal();

  return (
    <ModalContext.Provider value={modal}>
      {children}
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
      >
        {modal.content}
      </Modal>
    </ModalContext.Provider>
  );
}

export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within ModalProvider');
  }
  return context;
}

// Usage in components:
function ProductCard({ product }: { product: Product }) {
  const { openModal } = useModalContext();

  const handleQuickView = () => {
    openModal(
      <ProductQuickView 
        product={product} 
        onAddToCart={(product) => {
          addToCart(product);
          closeModal();
        }}
      />
    );
  };

  return (
    <div>
      {/* Product display */}
      <button onClick={handleQuickView}>Quick View</button>
    </div>
  );
}
```

---

## ⚡ PERFORMANCE OPTIMIZATION PATTERNS

### React.memo and Memoization Strategy

```tsx
// components/ProductCard/ProductCard.tsx
import { memo } from 'react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isInCart: boolean;
}

// Memoize the component to prevent unnecessary re-renders
export const ProductCard = memo(function ProductCard({ 
  product, 
  onAddToCart, 
  isInCart 
}: ProductCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button 
        onClick={() => onAddToCart(product)}
        disabled={isInCart}
      >
        {isInCart ? 'In Cart' : 'Add to Cart'}
      </button>
    </div>
  );
});

// Parent component with optimized callbacks
function ProductList({ products }: { products: Product[] }) {
  const { addItem, isInCart } = useShoppingCart();

  // Memoize the callback to prevent ProductCard re-renders
  const handleAddToCart = useCallback((product: Product) => {
    addItem(product);
  }, [addItem]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
          isInCart={isInCart(product.id)}
        />
      ))}
    </div>
  );
}
```

### Virtualization for Large Lists

```tsx
// components/VirtualizedList/VirtualizedProductList.tsx
import { FixedSizeList as List } from 'react-window';
import { memo } from 'react';

interface VirtualizedProductListProps {
  products: Product[];
  height: number;
  itemHeight: number;
}

const ProductItem = memo(function ProductItem({ 
  index, 
  style, 
  data 
}: {
  index: number;
  style: React.CSSProperties;
  data: Product[];
}) {
  const product = data[index];

  return (
    <div style={style}>
      <ProductCard product={product} />
    </div>
  );
});

export function VirtualizedProductList({ 
  products, 
  height, 
  itemHeight 
}: VirtualizedProductListProps) {
  return (
    <List
      height={height}
      itemCount={products.length}
      itemSize={itemHeight}
      itemData={products}
    >
      {ProductItem}
    </List>
  );
}

// Usage:
function ProductCatalog() {
  const { data: products } = useProducts();

  if (!products) return <ProductListSkeleton />;

  // For large product lists (>100 items), use virtualization
  if (products.length > 100) {
    return (
      <VirtualizedProductList
        products={products}
        height={600}
        itemHeight={200}
      />
    );
  }

  // For smaller lists, use regular rendering
  return <ProductGrid products={products} />;
}
```

### Lazy Loading and Code Splitting

```tsx
// components/LazyComponents.ts
import dynamic from 'next/dynamic';

// Lazy load heavy components
export const LazyChart = dynamic(() => import('./Chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false // Disable SSR for client-only components
});

export const LazyDataTable = dynamic(() => import('./DataTable'), {
  loading: () => <TableSkeleton />
});

export const LazyModal = dynamic(() => import('./Modal'), {
  loading: () => null
});

// Feature-based code splitting
export const LazyShoppingCart = dynamic(
  () => import('../ShoppingCart/ShoppingCartDrawer'),
  { loading: () => <div>Loading cart...</div> }
);

// Usage in components:
function Dashboard() {
  const [showChart, setShowChart] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowChart(true)}>
        Show Analytics
      </button>
      
      {/* Only load chart component when needed */}
      {showChart && (
        <LazyChart data={analyticsData} />
      )}
    </div>
  );
}
```

---

## 🧪 TESTING BEST PRACTICES

### Component Testing Strategy

```tsx
// __tests__/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../ProductCard';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  image: '/test-image.jpg'
};

describe('ProductCard', () => {
  // Test 1: Render test
  it('renders product information correctly', () => {
    render(
      <ProductCard 
        product={mockProduct} 
        onAddToCart={jest.fn()} 
        isInCart={false} 
      />
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Test Product');
  });

  // Test 2: Interaction test
  it('calls onAddToCart when button is clicked', () => {
    const mockAddToCart = jest.fn();
    
    render(
      <ProductCard 
        product={mockProduct} 
        onAddToCart={mockAddToCart} 
        isInCart={false} 
      />
    );

    fireEvent.click(screen.getByText('Add to Cart'));
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  // Test 3: State-dependent rendering
  it('shows "In Cart" when product is in cart', () => {
    render(
      <ProductCard 
        product={mockProduct} 
        onAddToCart={jest.fn()} 
        isInCart={true} 
      />
    );

    expect(screen.getByText('In Cart')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Integration Testing with Hooks

```tsx
// __tests__/useShoppingCart.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useShoppingCart } from '../hooks/useShoppingCart';

describe('useShoppingCart', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with empty cart', () => {
    const { result } = renderHook(() => useShoppingCart());

    expect(result.current.items).toEqual([]);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.total).toBe(0);
  });

  it('adds items to cart correctly', () => {
    const { result } = renderHook(() => useShoppingCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.itemCount).toBe(1);
    expect(result.current.isInCart(mockProduct.id)).toBe(true);
  });

  it('persists cart in localStorage', () => {
    const { result } = renderHook(() => useShoppingCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    const savedCart = JSON.parse(localStorage.getItem('shopping-cart') || '[]');
    expect(savedCart).toHaveLength(1);
    expect(savedCart[0].id).toBe(mockProduct.id);
  });
});
```

---

## 📋 PRODUCTION-READY BEST PRACTICES

### Error Boundaries

```tsx
// components/ErrorBoundary.tsx
'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            We're sorry, but something unexpected happened.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage:
function App() {
  return (
    <ErrorBoundary>
      <ShoppingCartProvider>
        <Layout>
          <Routes />
        </Layout>
      </ShoppingCartProvider>
    </ErrorBoundary>
  );
}
```

### Accessibility Best Practices

```tsx
// components/Button/Button.tsx
import { forwardRef, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, disabled, children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
    
    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    };
    
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        <span className={isLoading ? 'sr-only' : ''}>
          {children}
        </span>
        {isLoading && (
          <span aria-live="polite" className="sr-only">
            Loading...
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

**Master these advanced patterns and best practices, and you'll build Next.js applications with professional-grade architecture, optimal performance, and industry-standard code quality.**