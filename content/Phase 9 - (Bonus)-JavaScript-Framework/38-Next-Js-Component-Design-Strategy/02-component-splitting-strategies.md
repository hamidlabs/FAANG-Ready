# Component Splitting Strategies
## Master the Art of Breaking Down Complex UIs into Perfect Component Hierarchies

**Purpose**: Learn the systematic approach to splitting any UI into the optimal component structure. Never wonder "Should this be one component or many?" again.

**Promise**: After mastering this system, you'll automatically see the component boundaries in any design and build maintainable, reusable component architectures.

---

## 🎯 THE COMPONENT SPLITTING METHODOLOGY

### The SPLIT Framework

**Use this 5-step process for any UI:**

```
S - SINGLE RESPONSIBILITY: Each component has ONE clear job
P - PARENT-CHILD RELATIONSHIPS: Clear data flow hierarchy
L - LOGIC SEPARATION: Business logic vs presentation logic
I - INTERFACE BOUNDARIES: Clear props interface between components
T - TESTABILITY: Each component can be tested independently
```

### The Visual Component Boundary Method

**Look for these visual and logical boundaries:**

```
1. REPEATED PATTERNS → Extract to reusable components
2. DISTINCT SECTIONS → Separate containers
3. DIFFERENT DATA SOURCES → Different components
4. INDEPENDENT INTERACTIONS → Separate interactive components
5. CONDITIONAL RENDERING → Separate conditional components
```

---

## 🛒 REAL-WORLD EXAMPLE: SHOPPING CART BREAKDOWN

### Complete Shopping Cart Analysis

**Let's break down a full shopping cart feature systematically:**

```
SHOPPING CART FEATURE REQUIREMENTS:
├── Display cart items with product info
├── Show quantity controls (+/- buttons)
├── Display individual item totals
├── Show cart summary (subtotal, tax, total)
├── Apply discount codes
├── Remove items from cart
├── Proceed to checkout
└── Show empty cart state
```

### Step 1: Identify Major Sections

```
VISUAL SECTIONS:
├── Cart Header (title, item count)
├── Cart Items List (scrollable area)
├── Cart Summary (totals, discounts)
└── Cart Actions (clear cart, checkout)
```

### Step 2: Component Hierarchy Design

```
ShoppingCart (Container)
├── CartHeader
├── CartItemsList
│   ├── CartItem (repeated)
│   │   ├── ProductImage
│   │   ├── ProductInfo
│   │   ├── QuantityControls
│   │   └── RemoveButton
│   └── EmptyCartMessage
├── DiscountSection
│   ├── DiscountInput
│   └── AppliedDiscounts
├── CartSummary
│   ├── SummaryLine (repeated)
│   └── TotalLine
└── CartActions
    ├── ClearCartButton
    └── CheckoutButton
```

### Step 3: Component Implementation

#### Container Component (Smart)
```tsx
// ShoppingCart.tsx - Orchestrates everything
'use client';

import { useShoppingCart } from '@/hooks/useShoppingCart';
import { CartHeader } from './CartHeader';
import { CartItemsList } from './CartItemsList';
import { CartSummary } from './CartSummary';
import { CartActions } from './CartActions';

export function ShoppingCart() {
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    tax,
    total,
    itemCount
  } = useShoppingCart();

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-md">
      <CartHeader itemCount={itemCount} />
      
      <CartItemsList 
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
      
      <CartSummary 
        subtotal={subtotal}
        tax={tax}
        total={total}
      />
      
      <CartActions 
        onClearCart={clearCart}
        onCheckout={() => console.log('Checkout')}
        disabled={items.length === 0}
      />
    </div>
  );
}
```

#### Presentational Components (Dumb)

```tsx
// CartHeader.tsx - Simple display component
interface CartHeaderProps {
  itemCount: number;
}

export function CartHeader({ itemCount }: CartHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold">Shopping Cart</h2>
      <span className="text-sm text-gray-500">
        {itemCount} {itemCount === 1 ? 'item' : 'items'}
      </span>
    </div>
  );
}

// CartItemsList.tsx - Handles list rendering
interface CartItemsListProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export function CartItemsList({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem 
}: CartItemsListProps) {
  if (items.length === 0) {
    return <EmptyCartMessage />;
  }

  return (
    <div className="space-y-3 max-h-64 overflow-y-auto">
      {items.map(item => (
        <CartItem
          key={item.id}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemoveItem}
        />
      ))}
    </div>
  );
}

// CartItem.tsx - Individual item component
interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center space-x-3 p-3 border rounded">
      <ProductImage 
        src={item.image} 
        alt={item.name}
        size="small"
      />
      
      <ProductInfo 
        name={item.name}
        price={item.price}
        quantity={item.quantity}
      />
      
      <QuantityControls
        quantity={item.quantity}
        onIncrease={() => onUpdateQuantity(item.id, item.quantity + 1)}
        onDecrease={() => onUpdateQuantity(item.id, item.quantity - 1)}
        min={1}
      />
      
      <RemoveButton 
        onClick={() => onRemove(item.id)}
        ariaLabel={`Remove ${item.name} from cart`}
      />
    </div>
  );
}
```

---

## 🏗️ COMPONENT SPLITTING PATTERNS

### Pattern 1: List with Items

**When you have: A list of similar items**

```
BEFORE (Monolithic):
├── ProductList (renders everything)

AFTER (Split):
├── ProductListContainer (data + logic)
├── ProductList (rendering)
└── ProductCard (individual items)

WHY: Easier testing, item reusability, performance optimization
```

#### Implementation:
```tsx
// Container handles data
function ProductListContainer({ category }) {
  const { products, loading, error } = useProducts(category);
  
  return (
    <ProductList 
      products={products}
      loading={loading}
      error={error}
    />
  );
}

// List handles rendering
function ProductList({ products, loading, error }) {
  if (loading) return <ProductListSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// Item is reusable
function ProductCard({ product }) {
  return (
    <div className="border rounded p-4">
      {/* Product display */}
    </div>
  );
}
```

### Pattern 2: Form with Sections

**When you have: Complex forms with multiple sections**

```
BEFORE (Monolithic):
├── CheckoutForm (handles everything)

AFTER (Split):
├── CheckoutFormContainer (validation + submission)
├── PersonalInfoSection
├── ShippingAddressSection
├── PaymentSection
└── OrderSummarySection

WHY: Section reusability, focused testing, easier maintenance
```

#### Implementation:
```tsx
// Container handles form logic
function CheckoutFormContainer() {
  const { formData, errors, handleSubmit, updateField } = useCheckoutForm();
  
  return (
    <form onSubmit={handleSubmit}>
      <PersonalInfoSection 
        data={formData.personal}
        errors={errors.personal}
        onChange={(field, value) => updateField('personal', field, value)}
      />
      
      <ShippingAddressSection 
        data={formData.shipping}
        errors={errors.shipping}
        onChange={(field, value) => updateField('shipping', field, value)}
      />
      
      <PaymentSection 
        data={formData.payment}
        errors={errors.payment}
        onChange={(field, value) => updateField('payment', field, value)}
      />
      
      <OrderSummarySection 
        orderData={formData}
      />
    </form>
  );
}

// Each section is focused and testable
function PersonalInfoSection({ data, errors, onChange }) {
  return (
    <fieldset className="border p-4 mb-4">
      <legend>Personal Information</legend>
      
      <InputField
        label="First Name"
        value={data.firstName}
        error={errors.firstName}
        onChange={(value) => onChange('firstName', value)}
      />
      
      <InputField
        label="Email"
        type="email"
        value={data.email}
        error={errors.email}
        onChange={(value) => onChange('email', value)}
      />
    </fieldset>
  );
}
```

### Pattern 3: Modal with Content

**When you have: Modal dialogs with different content types**

```
BEFORE (Monolithic):
├── ProductModal (handles modal + content)

AFTER (Split):
├── Modal (reusable modal shell)
├── ProductModalContent (specific content)
└── ModalActions (reusable actions)

WHY: Modal reusability, content flexibility, easier testing
```

#### Implementation:
```tsx
// Reusable modal shell
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <ModalHeader title={title} onClose={onClose} />
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// Specific content component
function ProductModalContent({ product }) {
  return (
    <div>
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p className="font-bold">${product.price}</p>
    </div>
  );
}

// Usage - compose them together
function ProductModal({ product, isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product?.name}>
      {product && (
        <>
          <ProductModalContent product={product} />
          <ModalActions>
            <Button onClick={() => addToCart(product)}>
              Add to Cart
            </Button>
          </ModalActions>
        </>
      )}
    </Modal>
  );
}
```

---

## 📊 COMPLEX EXAMPLE: DASHBOARD BREAKDOWN

### Dashboard Component Analysis

**Let's break down a complex dashboard:**

```
DASHBOARD REQUIREMENTS:
├── Header with user info and notifications
├── Navigation sidebar
├── Main content area with widgets
├── Widget types: Charts, Tables, KPIs, Lists
├── Responsive layout
├── Real-time data updates
└── Customizable widget arrangement
```

### Component Hierarchy:

```
Dashboard (Layout Container)
├── DashboardHeader
│   ├── UserProfile
│   ├── NotificationBell
│   └── SearchBar
├── DashboardSidebar
│   ├── Navigation
│   └── QuickActions
├── DashboardContent
│   ├── WidgetGrid (manages layout)
│   │   ├── ChartWidget
│   │   ├── TableWidget
│   │   ├── KPIWidget
│   │   └── ListWidget
│   └── WidgetCustomizer (drag & drop)
└── DashboardFooter
```

#### Implementation Strategy:

```tsx
// Dashboard.tsx - Layout orchestrator
function Dashboard() {
  const { user } = useAuth();
  const { widgets, updateLayout } = useDashboardLayout();
  
  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader user={user} />
      
      <div className="flex">
        <DashboardSidebar />
        
        <main className="flex-1 p-6">
          <WidgetGrid 
            widgets={widgets}
            onLayoutChange={updateLayout}
          />
        </main>
      </div>
    </div>
  );
}

// WidgetGrid.tsx - Handles widget layout
function WidgetGrid({ widgets, onLayoutChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {widgets.map(widget => (
        <WidgetContainer key={widget.id} widget={widget}>
          {renderWidget(widget)}
        </WidgetContainer>
      ))}
    </div>
  );
}

// WidgetContainer.tsx - Common widget wrapper
function WidgetContainer({ widget, children }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <WidgetHeader 
        title={widget.title}
        onSettings={() => openSettings(widget.id)}
      />
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
}

// Specific widget implementations
function ChartWidget({ data, config }) {
  const chartData = useChartData(data);
  
  return (
    <Chart 
      type={config.chartType}
      data={chartData}
      options={config.options}
    />
  );
}
```

---

## 🧠 COMPONENT SPLITTING DECISION MATRIX

### When to Split vs Keep Together

| **Criteria** | **Split into Separate Components** | **Keep in Same Component** |
|--------------|-----------------------------------|---------------------------|
| **Size** | >150 lines of code | <100 lines of code |
| **Responsibility** | Multiple clear responsibilities | Single responsibility |
| **Reusability** | Used in multiple places | Used only here |
| **Testing** | Complex logic to test | Simple display logic |
| **State** | Multiple unrelated state pieces | Single state concern |
| **Dependencies** | Different data sources | Same data source |
| **Team Work** | Different developers work on parts | One developer owns it |

### The "Extract Component" Refactoring Checklist

**When refactoring, extract a component if:**

- [ ] **Repeated JSX**: Same JSX structure appears multiple times
- [ ] **Logical Group**: Set of elements that always appear together
- [ ] **Independent State**: Has its own state that doesn't affect parent
- [ ] **Clear Props Interface**: Can define clear props for the component
- [ ] **Testable Unit**: Would be easier to test as separate component
- [ ] **Team Boundaries**: Different team members could work on it
- [ ] **Performance Benefits**: Could be optimized independently

---

## 🚀 SPLITTING STRATEGY QUICK REFERENCE

### The 30-Second Component Split Test

**Ask these questions quickly:**

```
1. Does this section do ONE thing? → If NO, split it
2. Would I reuse this elsewhere? → If YES, extract it
3. Can I test this independently? → If would be easier, split it
4. Does this have its own data needs? → If YES, consider splitting
5. Is this more than 100 lines? → If YES, look for split opportunities
```

### Component Extraction Priority Order

```
HIGH PRIORITY (Extract First):
├── Repeated UI patterns
├── Independent interactive elements
├── Complex forms sections
└── Data display with logic

MEDIUM PRIORITY (Extract When Growing):
├── List items
├── Modal content
├── Card components
└── Layout sections

LOW PRIORITY (Extract Only If Needed):
├── Simple display components
├── One-off UI elements
├── Tightly coupled sections
└── Very small components (<20 lines)
```

**Master these splitting strategies, and you'll build component architectures that are maintainable, testable, and scalable. The next guide will dive deep into custom hooks and state management patterns.**