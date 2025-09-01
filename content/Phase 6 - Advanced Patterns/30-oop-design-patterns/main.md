# OOP Design Patterns - Master Guide

## From Zero to FAANG Ready

### What are Design Patterns and Why They're Your Interview Superpower?

Imagine you're a chef. Instead of inventing new recipes from scratch every time, you follow proven patterns like "stir-fry method" or "braising technique." Design patterns are exactly that for programmers - **proven solutions** to common coding problems.

Design patterns appear in **80% of senior developer interviews** at FAANG companies. They show you can think architecturally and write maintainable, scalable code.

### Core Concept: Reusable Solutions to Common Problems

Design patterns are NOT about memorizing code. They're about recognizing problems and applying the right solution pattern.

**Three categories you MUST know:**
1. **Creational** - How to create objects
2. **Structural** - How to compose objects  
3. **Behavioral** - How objects interact

## The Essential FAANG Design Patterns

### 1. Singleton Pattern (Creational) ⭐️⭐️⭐️⭐️⭐️

**Problem:** Ensure only ONE instance of a class exists globally.
**Use Cases:** Database connections, logging, caching, thread pools

**Real-World Example:** Your app should have only ONE database connection manager.

```javascript
class DatabaseManager {
    constructor() {
        if (DatabaseManager.instance) {
            return DatabaseManager.instance;
        }
        
        this.connection = null;
        this.isConnected = false;
        DatabaseManager.instance = this;
        
        return this;
    }
    
    connect() {
        if (!this.isConnected) {
            console.log("Creating new database connection...");
            this.connection = "DB_CONNECTION_OBJECT";
            this.isConnected = true;
        }
        return this.connection;
    }
    
    disconnect() {
        if (this.isConnected) {
            console.log("Closing database connection...");
            this.connection = null;
            this.isConnected = false;
        }
    }
}

// Usage - Both instances are the SAME object
const db1 = new DatabaseManager();
const db2 = new DatabaseManager();
console.log(db1 === db2); // true!

// Interview Example: Logger class
class Logger {
    constructor() {
        if (Logger.instance) return Logger.instance;
        this.logs = [];
        Logger.instance = this;
        return this;
    }
    
    log(message) {
        const timestamp = new Date().toISOString();
        this.logs.push(`${timestamp}: ${message}`);
        console.log(`${timestamp}: ${message}`);
    }
    
    getLogs() {
        return this.logs;
    }
}
```

**Interview Question:** "Design a cache that can only have one instance."

### 2. Factory Pattern (Creational) ⭐️⭐️⭐️⭐️

**Problem:** Create objects without specifying exact classes.
**Use Cases:** Creating different types of objects based on input

```javascript
// Product classes
class Car {
    constructor(make, model) {
        this.make = make;
        this.model = model;
        this.type = 'car';
    }
    
    start() {
        console.log(`Starting ${this.make} ${this.model} car`);
    }
}

class Motorcycle {
    constructor(make, model) {
        this.make = make;
        this.model = model;
        this.type = 'motorcycle';
    }
    
    start() {
        console.log(`Starting ${this.make} ${this.model} motorcycle`);
    }
}

class Truck {
    constructor(make, model) {
        this.make = make;
        this.model = model;
        this.type = 'truck';
    }
    
    start() {
        console.log(`Starting ${this.make} ${this.model} truck`);
    }
}

// Factory class
class VehicleFactory {
    static createVehicle(type, make, model) {
        switch(type.toLowerCase()) {
            case 'car':
                return new Car(make, model);
            case 'motorcycle':
                return new Motorcycle(make, model);
            case 'truck':
                return new Truck(make, model);
            default:
                throw new Error(`Vehicle type ${type} is not supported`);
        }
    }
}

// Usage
const myCar = VehicleFactory.createVehicle('car', 'Toyota', 'Camry');
const myBike = VehicleFactory.createVehicle('motorcycle', 'Harley', 'Davidson');
myCar.start(); // Starting Toyota Camry car
myBike.start(); // Starting Harley Davidson motorcycle

// FAANG Example: User Creation Factory
class BasicUser {
    constructor(name, email) {
        this.name = name;
        this.email = email;
        this.permissions = ['read'];
    }
}

class AdminUser {
    constructor(name, email) {
        this.name = name;
        this.email = email;
        this.permissions = ['read', 'write', 'delete', 'admin'];
    }
}

class UserFactory {
    static createUser(type, name, email) {
        if (type === 'admin') return new AdminUser(name, email);
        return new BasicUser(name, email);
    }
}
```

### 3. Observer Pattern (Behavioral) ⭐️⭐️⭐️⭐️⭐️

**Problem:** Notify multiple objects when one object changes state.
**Use Cases:** Event handling, model-view architectures, real-time updates

```javascript
// Subject (the thing being observed)
class NewsAgency {
    constructor() {
        this.news = '';
        this.observers = [];
    }
    
    // Add observer
    subscribe(observer) {
        this.observers.push(observer);
    }
    
    // Remove observer
    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }
    
    // Notify all observers
    notifyObservers() {
        this.observers.forEach(observer => observer.update(this.news));
    }
    
    // Change state and notify
    setNews(news) {
        this.news = news;
        this.notifyObservers();
    }
}

// Observers (the things that react to changes)
class NewsChannel {
    constructor(name) {
        this.name = name;
    }
    
    update(news) {
        console.log(`${this.name} received breaking news: ${news}`);
    }
}

class EmailSubscriber {
    constructor(email) {
        this.email = email;
    }
    
    update(news) {
        console.log(`Sending email to ${this.email}: ${news}`);
    }
}

// Usage
const agency = new NewsAgency();
const cnn = new NewsChannel('CNN');
const bbc = new NewsChannel('BBC');
const john = new EmailSubscriber('john@example.com');

agency.subscribe(cnn);
agency.subscribe(bbc);
agency.subscribe(john);

agency.setNews('Breaking: New technology breakthrough!');
// Output:
// CNN received breaking news: Breaking: New technology breakthrough!
// BBC received breaking news: Breaking: New technology breakthrough!
// Sending email to john@example.com: Breaking: New technology breakthrough!

// FAANG Example: Stock Price Tracker
class StockPrice {
    constructor(symbol) {
        this.symbol = symbol;
        this.price = 0;
        this.investors = [];
    }
    
    addInvestor(investor) {
        this.investors.push(investor);
    }
    
    removeInvestor(investor) {
        this.investors = this.investors.filter(inv => inv !== investor);
    }
    
    setPrice(newPrice) {
        this.price = newPrice;
        this.notifyInvestors();
    }
    
    notifyInvestors() {
        this.investors.forEach(investor => 
            investor.priceChanged(this.symbol, this.price)
        );
    }
}

class Investor {
    constructor(name) {
        this.name = name;
    }
    
    priceChanged(symbol, price) {
        console.log(`${this.name} notified: ${symbol} is now $${price}`);
        // Could trigger buy/sell logic here
    }
}
```

### 4. Strategy Pattern (Behavioral) ⭐️⭐️⭐️⭐️

**Problem:** Choose algorithm at runtime from a family of algorithms.
**Use Cases:** Payment processing, sorting algorithms, compression algorithms

```javascript
// Strategy interface (different ways to do the same thing)
class PaymentStrategy {
    pay(amount) {
        throw new Error("pay() method must be implemented");
    }
}

// Concrete strategies
class CreditCardPayment extends PaymentStrategy {
    constructor(cardNumber, expiryDate, cvv) {
        super();
        this.cardNumber = cardNumber;
        this.expiryDate = expiryDate;
        this.cvv = cvv;
    }
    
    pay(amount) {
        console.log(`Paid $${amount} using Credit Card ending in ${this.cardNumber.slice(-4)}`);
        // Credit card processing logic here
        return {
            method: 'credit_card',
            amount: amount,
            status: 'success'
        };
    }
}

class PayPalPayment extends PaymentStrategy {
    constructor(email) {
        super();
        this.email = email;
    }
    
    pay(amount) {
        console.log(`Paid $${amount} using PayPal account ${this.email}`);
        // PayPal API integration here
        return {
            method: 'paypal',
            amount: amount,
            status: 'success'
        };
    }
}

class CryptoPayment extends PaymentStrategy {
    constructor(walletAddress, currency) {
        super();
        this.walletAddress = walletAddress;
        this.currency = currency;
    }
    
    pay(amount) {
        console.log(`Paid $${amount} using ${this.currency} from wallet ${this.walletAddress.slice(0, 8)}...`);
        // Crypto transaction logic here
        return {
            method: 'crypto',
            amount: amount,
            status: 'pending'
        };
    }
}

// Context class
class ShoppingCart {
    constructor() {
        this.items = [];
        this.paymentStrategy = null;
    }
    
    addItem(item, price) {
        this.items.push({ item, price });
    }
    
    setPaymentStrategy(strategy) {
        this.paymentStrategy = strategy;
    }
    
    calculateTotal() {
        return this.items.reduce((total, item) => total + item.price, 0);
    }
    
    checkout() {
        if (!this.paymentStrategy) {
            throw new Error("No payment method selected");
        }
        
        const total = this.calculateTotal();
        return this.paymentStrategy.pay(total);
    }
}

// Usage
const cart = new ShoppingCart();
cart.addItem('Laptop', 999.99);
cart.addItem('Mouse', 29.99);

// Can switch payment method at runtime!
cart.setPaymentStrategy(new CreditCardPayment('1234-5678-9012-3456', '12/25', '123'));
cart.checkout(); // Paid $1029.98 using Credit Card ending in 3456

// Switch to different payment method
cart.setPaymentStrategy(new PayPalPayment('user@example.com'));
cart.checkout(); // Paid $1029.98 using PayPal account user@example.com
```

### 5. Decorator Pattern (Structural) ⭐️⭐️⭐️

**Problem:** Add new functionality to objects dynamically without altering their structure.
**Use Cases:** Adding features to classes, middleware systems, UI components

```javascript
// Base component
class Coffee {
    cost() {
        return 5;
    }
    
    description() {
        return "Simple coffee";
    }
}

// Decorator base class
class CoffeeDecorator {
    constructor(coffee) {
        this.coffee = coffee;
    }
    
    cost() {
        return this.coffee.cost();
    }
    
    description() {
        return this.coffee.description();
    }
}

// Concrete decorators
class MilkDecorator extends CoffeeDecorator {
    cost() {
        return this.coffee.cost() + 2;
    }
    
    description() {
        return this.coffee.description() + ", milk";
    }
}

class SugarDecorator extends CoffeeDecorator {
    cost() {
        return this.coffee.cost() + 1;
    }
    
    description() {
        return this.coffee.description() + ", sugar";
    }
}

class VanillaDecorator extends CoffeeDecorator {
    cost() {
        return this.coffee.cost() + 3;
    }
    
    description() {
        return this.coffee.description() + ", vanilla";
    }
}

// Usage - can combine decorators!
let myCoffee = new Coffee();
console.log(`${myCoffee.description()}: $${myCoffee.cost()}`);
// Simple coffee: $5

myCoffee = new MilkDecorator(myCoffee);
myCoffee = new SugarDecorator(myCoffee);
myCoffee = new VanillaDecorator(myCoffee);

console.log(`${myCoffee.description()}: $${myCoffee.cost()}`);
// Simple coffee, milk, sugar, vanilla: $11

// FAANG Example: Text Processing Pipeline
class TextProcessor {
    process(text) {
        return text;
    }
}

class UpperCaseDecorator extends TextProcessor {
    constructor(processor) {
        super();
        this.processor = processor;
    }
    
    process(text) {
        return this.processor.process(text).toUpperCase();
    }
}

class TrimDecorator extends TextProcessor {
    constructor(processor) {
        super();
        this.processor = processor;
    }
    
    process(text) {
        return this.processor.process(text).trim();
    }
}

class EncryptDecorator extends TextProcessor {
    constructor(processor) {
        super();
        this.processor = processor;
    }
    
    process(text) {
        // Simple Caesar cipher for demo
        return this.processor.process(text)
            .split('')
            .map(char => String.fromCharCode(char.charCodeAt(0) + 1))
            .join('');
    }
}

// Build processing pipeline
let processor = new TextProcessor();
processor = new TrimDecorator(processor);
processor = new UpperCaseDecorator(processor);
processor = new EncryptDecorator(processor);

console.log(processor.process("  hello world  "));
// Each decorator adds its functionality to the pipeline
```

## Real FAANG Interview Problems

### Problem 1: Design a Notification System (Facebook/Google)

**Requirements:**
- Send notifications via email, SMS, push notification
- Users can choose their preferred methods
- Easy to add new notification methods

```javascript
// Strategy Pattern + Observer Pattern
class NotificationStrategy {
    send(message, recipient) {
        throw new Error("Must implement send method");
    }
}

class EmailNotification extends NotificationStrategy {
    send(message, recipient) {
        console.log(`📧 Email to ${recipient}: ${message}`);
        // Email sending logic
    }
}

class SMSNotification extends NotificationStrategy {
    send(message, recipient) {
        console.log(`📱 SMS to ${recipient}: ${message}`);
        // SMS API integration
    }
}

class PushNotification extends NotificationStrategy {
    send(message, recipient) {
        console.log(`🔔 Push to ${recipient}: ${message}`);
        // Push notification service
    }
}

class User {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.preferences = [];
    }
    
    addPreference(strategy) {
        this.preferences.push(strategy);
    }
    
    notify(message) {
        this.preferences.forEach(strategy => {
            strategy.send(message, this.name);
        });
    }
}

// Usage
const user = new User(1, "john@example.com");
user.addPreference(new EmailNotification());
user.addPreference(new PushNotification());

user.notify("Your order has been shipped!");
// 📧 Email to john@example.com: Your order has been shipped!
// 🔔 Push to john@example.com: Your order has been shipped!
```

### Problem 2: Design a Logging System (Amazon/Microsoft)

**Requirements:**
- Different log levels (DEBUG, INFO, WARN, ERROR)
- Multiple output destinations (console, file, database)
- Singleton for global access

```javascript
// Singleton + Strategy Pattern
class Logger {
    constructor() {
        if (Logger.instance) return Logger.instance;
        
        this.strategies = [];
        this.level = 'INFO';
        Logger.instance = this;
        return this;
    }
    
    addDestination(strategy) {
        this.strategies.push(strategy);
    }
    
    setLevel(level) {
        this.level = level;
    }
    
    log(level, message) {
        const levels = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
        const currentLevelIndex = levels.indexOf(this.level);
        const messageLevelIndex = levels.indexOf(level);
        
        if (messageLevelIndex >= currentLevelIndex) {
            this.strategies.forEach(strategy => {
                strategy.write(level, message);
            });
        }
    }
    
    debug(message) { this.log('DEBUG', message); }
    info(message) { this.log('INFO', message); }
    warn(message) { this.log('WARN', message); }
    error(message) { this.log('ERROR', message); }
}

class ConsoleLogStrategy {
    write(level, message) {
        console.log(`[${new Date().toISOString()}] ${level}: ${message}`);
    }
}

class FileLogStrategy {
    write(level, message) {
        // Simulate file writing
        console.log(`Writing to file: [${level}] ${message}`);
    }
}

// Usage
const logger = new Logger();
logger.addDestination(new ConsoleLogStrategy());
logger.addDestination(new FileLogStrategy());

logger.info("Application started");
logger.error("Database connection failed");
```

## Quick Pattern Recognition Guide

| **Problem Type** | **Pattern** | **Key Indicator** |
|---|---|---|
| "Only one instance" | Singleton | Global access, shared resource |
| "Create different types" | Factory | Switch on type, object creation |
| "Notify multiple objects" | Observer | Event handling, state changes |
| "Choose algorithm at runtime" | Strategy | Multiple ways to do same thing |
| "Add features dynamically" | Decorator | Wrapping, enhancing objects |

## Your 30-Day Design Pattern Mastery

### Week 1: Creational Patterns (Days 1-7)
- **Day 1-2:** Singleton Pattern
- **Day 3-4:** Factory Pattern  
- **Day 5-7:** Builder Pattern (bonus)

### Week 2: Behavioral Patterns (Days 8-14)
- **Day 8-10:** Observer Pattern
- **Day 11-14:** Strategy Pattern

### Week 3: Structural Patterns (Days 15-21)
- **Day 15-17:** Decorator Pattern
- **Day 18-21:** Adapter Pattern (bonus)

### Week 4: FAANG Interview Ready (Days 22-30)
- **Day 22-25:** Combine patterns in complex systems
- **Day 26-30:** Mock system design interviews

**Success Metric:** Design any system using appropriate patterns in < 30 minutes

## Common Interview Mistakes

❌ **Mistake 1:** Overengineering simple problems
✅ **Fix:** Use patterns only when they solve real problems

❌ **Mistake 2:** Memorizing code instead of understanding concepts
✅ **Fix:** Focus on the problem each pattern solves

❌ **Mistake 3:** Not explaining the benefits
✅ **Fix:** Always explain WHY you chose this pattern

## Next Steps

After mastering design patterns:
1. **System Design** - Apply patterns to large-scale systems
2. **SOLID Principles** - Design principles that guide pattern usage
3. **Architecture Patterns** - MVC, MVP, MVVM

**Remember:** Design patterns are tools in your toolbox. Choose the right tool for the job!

**Your mantra:** "Identify the problem, choose the pattern, implement the solution."