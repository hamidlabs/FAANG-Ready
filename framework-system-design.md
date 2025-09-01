# A Beginner's Guide to System Design

## Step 1: Requirement Gathering & Scope Definition

### Purpose

This is the foundation. You are figuring out the _exact_ problem you need to
solve before you write a single line of code or choose a single technology. A
perfect design that solves the wrong problem is a failure.

### Key Activities

#### 1. Define Functional Requirements (Features)

List the core actions a user can perform. Be specific.

**Example for a Twitter-like app:**

- `"User can post a tweet (text < 280 chars)"`
- `"User can view a timeline of tweets from people they follow"`
- `"User can like a tweet"`

#### 2. Define Non-Functional Requirements (The "-ilities")

This is where you define the quality of the system. These requirements _dictate_
your technology choices.

- **Availability:** How critical is uptime?
- A 99.9% ("three nines") availability allows for ~8.76 hours of downtime a
  year.
- A 99.999% ("five nines") system (like AWS/Azure) allows for only ~5 minutes of
  downtime a year. Higher availability requires more redundancy and complexity.

- **Scalability:** How many users? Now and in the future? Is the system
  **read-heavy** (like Twitter, where everyone is reading tweets) or
  **write-heavy** (like a sensor network, constantly sending data)?

- **Consistency:** Does everyone need to see the latest data immediately? When
  you like a tweet, must the count update for everyone instantly (**strong
  consistency**), or is it okay if your friend sees the updated count a few
  seconds later (**eventual consistency**)? Strong consistency is simpler but
  slower. Eventual consistency is faster and more scalable but more complex to
  reason about.

- **Latency & Performance:** How fast does it need to be? For a post, 500ms
  might be okay. For a user's keypress in a real-time game, it must be under
  50ms.
- **Durability:** Can we _ever_ lose data? A lost tweet might be acceptable to
  the business. A lost financial transaction is not.

### Key Concepts Explained

- **Read-heavy vs. Write-heavy:** This is a crucial distinction.

  - A **read-heavy** system (e.g., Twitter, Netflix) is dominated by users
    consuming data. Your design will focus heavily on:
  - **caching** - This is temporary storage of frequently accessed data in fast memory. **Redis** is an in-memory data structure store that acts as a database, cache, and message broker. It stores data in RAM (random access memory) for lightning-fast access. **Memcached** is a simpler in-memory caching system that stores key-value pairs. Both run as separate processes that your application connects to via network protocols.
  - **content delivery networks (CDNs)** - These are geographically distributed networks of proxy servers. When a user in Tokyo requests an image, instead of fetching it from your server in New York, the CDN serves it from a server in Tokyo, dramatically reducing latency.

  - A **write-heavy** system (e.g., IoT sensor networks, real-time analytics) is
    dominated by data ingestion. Your design will focus on:
  - databases that can handle high write **throughput** - **Apache Cassandra** is a NoSQL database designed for handling massive amounts of data across many servers. It uses a distributed architecture where data is spread across multiple nodes, allowing it to handle millions of writes per second.
  - **message queues** - These are communication systems that allow different parts of your application to send messages to each other asynchronously. **Apache Kafka** is a distributed streaming platform that acts like a high-performance message bus. It stores messages in categories called "topics" and allows multiple applications to produce and consume these messages independently.

- **SLO (Service Level Objective):** A measurable goal for a service. It's a
  specific, numerical target derived from the non-functional requirements.
  **Example:**
  `"The timeline API will have a latency SLO of 200ms for the 95th percentile."`

---

## Step 2: Back-of-the-Envelope Estimation (The Math)

### Purpose

This translates your abstract requirements into concrete numbers. These numbers
are what will force you to choose a scalable database over SQLite or a CDN over
a single server. It makes your design quantitative, not just qualitative.

### Key Calculations

_Let's assume we're designing for **10 Million Daily Active Users (DAU)**._

#### 1. Estimate Requests per Second (QPS)

- **QPS (Queries Per Second):** The number of requests your system must handle
  every second.
- **Calculation:**
  `QPS = (DAU * Avg. actions per user per day) / (86400 seconds in a day)`
- **Example:** `If each user performs 10 actions per day:`
  `QPS = (10,000,000 users * 10 actions) / 86400 ≈ 1,157 requests/second`
- **What this means:** A single server can handle maybe a few hundred RPS.
  **~1,200 RPS means you immediately know you need multiple application servers
  behind a Load Balancer.**

#### 2. Estimate Storage

How much data will we store? Let's estimate the "Tweets" table.

- **Assumptions:**
  `10% of users post 2 tweets/day. Each tweet is 100 bytes of text.`
- `New Tweets per day = 10,000,000 DAU * 0.1 * 2 = 2,000,000 tweets/day`
- `Storage per day = 2,000,000 tweets * 100 bytes = 200 MB/day`
- `Storage for 5 years = 200 MB/day * 365 days * 5 years ≈ 365 GB`
- **What this means:** **365 GB** is manageable for a single PostgreSQL
  database. If this number was 365 _TB_, you'd be thinking about **sharding**
  your database or using a scalable NoSQL option.

#### 3. Estimate Bandwidth

This is the data transfer rate required for your servers.

- **How to calculate:**
  `Bandwidth (in Mbps) = (QPS * Response size in bits) / 1,000,000`
- **Example:**
  `For our 1,157 RPS, if each response is a timeline with 10 tweets (10 * 100 bytes = 1KB or 8192 bits):`
  `Bandwidth = (1157 RPS * 8192 bits) / 1,000,000 ≈ 9.5 Gbps`
- **What this means:** **9.5 Gbps** is a massive amount of traffic. This number
  is a screaming signal that you **must use a CDN** to cache and serve this
  content from edge locations worldwide, drastically reducing the load and cost
  from your core servers.

---

## Step 3: System Interface Design (The API Contract)

### Purpose

You define the precise language that clients (web, mobile, other services) will
use to talk to your system. This locks down the core operations and data
structures.

### What to Do

Write down the key API endpoints. For our Twitter-like app:

- `POST /api/v1/tweet`
  - **Body:** `{user_id: string, text: string}`
  - **Returns:** `{tweet_id: string}`
- `GET /api/v1/timeline/{user_id}`
  - **Returns:** `{ tweets: [ {tweet_id, text, author_id, likes} ] }`
- `POST /api/v1/like`
  - **Body:** `{user_id: string, tweet_id: string}`
  - **Returns:** `{success: boolean}`

### Key Concepts Explained

- **REST (Representational State Transfer):** An architectural style for
  designing APIs. It uses HTTP verbs (GET, POST, PUT, DELETE) to operate on
  resources (represented as URLs, like `/tweet`). It's simple, stateless, and
  cacheable.
  - **When to use:** Perfect for CRUD-based applications (Create, Read, Update,
    Delete) and public APIs. It's your default choice.
- **GraphQL:** A query language for your API. The client sends a query
  describing exactly the data it needs, and the server returns exactly that.
  - **When to use:** Ideal for complex UIs to avoid under-fetching or
    over-fetching data. It puts more complexity on the server.
- **gRPC (gRPC Remote Procedure Calls):** A high-performance framework from
  Google. It uses HTTP/2 and Protocol Buffers (a binary format) to make remote
  calls look like local function calls.
  - **When to use:** Primarily for **internal communication between
    microservices** where performance and efficiency are critical.

---

## Step 4: Define the Data Model (The Source of Truth)

### Purpose

Here, you design the heart of your system: how data is stored, organized, and
accessed. You translate your API definitions into concrete database schemas.

### What to Do

1.  Identify the core entities (nouns) in your system: `User`, `Tweet`, `Like`,
    `Follow`.
2.  Define the attributes (columns) for each entity.
3.  Define the relationships between them.

**Example Schema for our Twitter-like app:**

```sql
-- Using SQL-like syntax for clarity
Users Table (id: string, username: string, email: string, created_at: timestamp)
Tweets Table (id: string, user_id: string [Foreign Key to Users], content: string, created_at: timestamp)
Likes Table (id: string, user_id: string [FK to Users], tweet_id: string [FK to Tweets], created_at: timestamp)
Follows Table (id: string, follower_id: string [FK to Users], followee_id: string [FK to Users], created_at: timestamp)
```

### Key Concepts Explained

- **ACID (Atomicity, Consistency, Isolation, Durability):** A set of properties
  that guarantee database transactions are processed reliably.

  - **Atomicity:** A transaction is all-or-nothing.
  - **Consistency:** Every transaction brings the database from one valid state
    to another.
  - **Isolation:** Concurrent transactions don't interfere with each other.
  - **Durability:** Once a transaction is committed, it remains so, even after a
    power loss.
  - **When to use:** **Always prefer ACID** for anything involving money, core
    user data, or where correctness is critical. This is why you'd start with
    **PostgreSQL**.

- **Sharding (Horizontal Partitioning):** This is how you scale a database
  _horizontally_ (by adding more machines).

  - **What it is:** You split a large table into smaller pieces called
    **shards**, and distribute them across different database servers.
  - **How it works:** You choose a **shard key** (e.g., `user_id`).
  - **The Trade-off:** It adds immense complexity. Operations that need to read
    across all shards become very slow.
  - **When to use:** Only when a single database server can no longer handle the
    **write load** or the **storage size**.

- **NoSQL (MongoDB, Cassandra, DynamoDB):** A category of databases that often
  relaxes ACID rules to achieve greater scalability and flexibility.
  - **Types:**
    - **Document Stores (MongoDB):** Store data in JSON-like documents. Great
      for nested, semi-structured data.
    - **Wide-Column Stores (Cassandra, DynamoDB):** Optimized for massive scale
      and high write throughput.
  - **When to use NoSQL:**
    1.  **You need massive scale (millions of writes/second)** and can tolerate
        eventual consistency.
    2.  **Your data schema is unpredictable and changes constantly.**
    3.  **You are storing large, nested, denormalized documents.**

---

## Step 4.5: Complete Request Flow - From Next.js to Database

### Purpose

Before diving into the high-level design, let's trace exactly how a user request travels through every single component in a real full-stack application. This shows WHERE each piece sits and HOW they connect.

### Real-World Example: User Views Their Timeline

**1. Frontend (Next.js Client)**
```javascript
// pages/timeline.js - Next.js React component
import { useEffect, useState } from 'react';

function Timeline() {
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTimeline();
    }, []);

    async function fetchTimeline() {
        try {
            // This request starts our journey through the system
            const response = await fetch('/api/timeline', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch timeline');
            
            const data = await response.json();
            setTimeline(data.tweets);
        } catch (error) {
            console.error('Timeline fetch error:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            {loading ? (
                <p>Loading timeline...</p>
            ) : (
                timeline.map(tweet => (
                    <div key={tweet.id}>
                        <h4>{tweet.username}</h4>
                        <p>{tweet.content}</p>
                    </div>
                ))
            )}
        </div>
    );
}
```

**2. Network Journey**
- Browser resolves `yourapp.com` via DNS to IP address (e.g., 203.0.113.1)
- HTTP request travels over internet to your server
- Request hits your **CDN** first (Cloudflare/AWS CloudFront) - checks if response is cached
- CDN forwards request to your **Load Balancer** (NGINX)

**3. Load Balancer (NGINX) Processing**
```nginx
# Request arrives at NGINX server (203.0.113.1:80)
location /api/ {
    # NGINX selects one of your backend API servers
    proxy_pass http://api_servers;  # Forwards to 10.0.1.10:3000
    
    # Adds headers to help backend identify original client
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

**4. API Server (Node.js/Express) Processing**
```javascript
// server.js - Your API server running on port 3000
const express = require('express');
const redis = require('redis');
const { Pool } = require('pg');

const app = express();
const redisClient = redis.createClient({ host: 'redis-server', port: 6379 });
const dbPool = new Pool({
    host: 'postgres-server',
    port: 5432,
    database: 'twitter_db',
    user: 'api_user',
    password: 'secure_password',
    max: 20  // Maximum 20 database connections in pool
});

// Middleware stack - runs for every request
app.use(express.json());
app.use(authMiddleware);    // Verify JWT token
app.use(rateLimitMiddleware); // Check rate limits in Redis

// Timeline endpoint
app.get('/api/timeline', async (req, res) => {
    const userId = req.user.id; // From JWT token
    
    try {
        // Check Redis cache first
        const cacheKey = `timeline:${userId}`;
        const cached = await redisClient.get(cacheKey);
        
        if (cached) {
            console.log('Returning cached timeline');
            return res.json({ tweets: JSON.parse(cached) });
        }
        
        // Cache miss - query database
        console.log('Cache miss - querying database');
        const result = await dbPool.query(`
            SELECT 
                t.id, t.content, t.created_at,
                u.username, u.avatar_url
            FROM tweets t
            JOIN users u ON t.user_id = u.id
            WHERE t.user_id IN (
                SELECT followee_id 
                FROM follows 
                WHERE follower_id = $1
            )
            ORDER BY t.created_at DESC
            LIMIT 50
        `, [userId]);
        
        const timeline = result.rows;
        
        // Cache the result for 5 minutes
        await redisClient.setex(cacheKey, 300, JSON.stringify(timeline));
        
        res.json({ tweets: timeline });
        
    } catch (error) {
        console.error('Timeline error:', error);
        res.status(500).json({ error: 'Failed to fetch timeline' });
    }
});

app.listen(3000, () => {
    console.log('API server running on port 3000');
});
```

**5. Authentication Middleware**
```javascript
async function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    try {
        // Verify JWT token (could also check Redis for session)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}
```

**6. Rate Limiting Middleware**
```javascript
async function rateLimitMiddleware(req, res, next) {
    const userId = req.user?.id || req.ip;
    const key = `ratelimit:${userId}`;
    
    // Check current request count in Redis
    const current = await redisClient.get(key);
    
    if (current && parseInt(current) >= 100) { // 100 requests per hour
        return res.status(429).json({ error: 'Too many requests' });
    }
    
    // Increment counter
    await redisClient.multi()
        .incr(key)
        .expire(key, 3600) // Reset after 1 hour
        .exec();
    
    next();
}
```

**7. Redis Cache Check**
- API server connects to Redis via TCP (redis-server:6379)
- Redis stores data in RAM as key-value pairs
- If timeline cached: Returns immediately (1-2ms response)
- If not cached: Continues to database query

**8. PostgreSQL Database Query**
- API server gets connection from pool (reuses existing TCP connections)
- Database executes SQL query with JOIN operations
- Database uses indexes on `user_id` and `created_at` columns for fast lookup
- Query typically takes 50-200ms depending on data size and indexes

**9. Response Journey Back**
- Database results → API server → Redis (cache for next time) → NGINX → CDN → Client
- Total response time: 50-200ms for cache miss, 1-5ms for cache hit
- Client updates React state and renders timeline

**Network Protocols Used:**
- **HTTP/HTTPS**: Browser ↔ CDN ↔ Load Balancer ↔ API Server
- **TCP**: API Server ↔ Redis (port 6379), API Server ↔ Database (port 5432)
- **DNS**: Domain name resolution to IP addresses

---

## Step 5: High-Level Design (The Blueprint)

### Purpose

You create the "boxes and arrows" diagram. You place all the components onto
your mental model to visualize how data and requests flow through your system.

### The Diagram & Flow

Let's use the Twitter example. The key is to show how a user's request to view
their timeline is handled.

```mermaid
flowchart TD
    A[Client Mobile App] --> B[DNS<br>e.g., Amazon Route 53]
    B --> C[Load Balancer<br>e.g., AWS ALB, NGINX]
    C --> D[Web Server 1]
    C --> E[Web Server 2]
    D --> F{Cache<br>e.g., Redis}
    F -- Cache Hit --> H[Return Timeline]
    F -- Cache Miss --> G[SQL Database<br>e.g., PostgreSQL]
    G --> F
    G --> H

    I[User posts a tweet] --> J[Message Queue<br>e.g., Apache Kafka, SQS]
    J --> K[Worker Service]
    K --> F
```

### Component Breakdown

1.  **Client (Web/Mobile App):** The user's device.
2.  **DNS (Domain Name System):** Translates a domain name into an IP address.
3.  **Load Balancer:** Distributes incoming requests across multiple identical
    **Web Servers**.

### Real-World Load Balancer Implementation

**What NGINX actually is:**
NGINX is a web server software (like Apache) that can handle thousands of concurrent connections efficiently. It acts as a **reverse proxy** - meaning it sits in front of your backend servers and forwards client requests to them, while hiding the backend server details from clients.

**Where NGINX sits in your architecture:**
- Runs on a server with a public IP address (e.g., 203.0.113.1)
- Listens on ports 80 (HTTP) and 443 (HTTPS)
- Your domain name (e.g., twitter.com) points to this IP address via DNS
- Behind NGINX, you have multiple API servers running on private IP addresses

**NGINX Configuration Example:**
```nginx
# /etc/nginx/sites-available/twitter-api
upstream api_servers {
    # Define your backend API servers (private IP addresses)
    server 10.0.1.10:3000 weight=3;  # Server 1 - gets 3x traffic
    server 10.0.1.11:3000 weight=2;  # Server 2 - gets 2x traffic  
    server 10.0.1.12:3000 weight=1;  # Server 3 - gets 1x traffic
    
    # Health checks - NGINX removes failed servers automatically
    server 10.0.1.13:3000 backup;    # Backup server - only used if others fail
}

server {
    listen 80;
    server_name api.twitter.com;
    
    # Route all API requests to backend servers
    location /api/ {
        proxy_pass http://api_servers;
        
        # Forward original client information
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # Connection settings
        proxy_connect_timeout 5s;
        proxy_send_timeout 10s;
        proxy_read_timeout 10s;
    }
    
    # Serve static files directly from NGINX (faster than backend)
    location /static/ {
        root /var/www/twitter/;
        expires 1y;  # Cache static files for 1 year
    }
}
```

**How NGINX distributes traffic:**
1. Client sends request to `api.twitter.com/api/timeline`
2. DNS resolves to NGINX server IP (203.0.113.1)
3. NGINX receives request on port 80
4. NGINX uses **round-robin algorithm** to select next backend server
5. NGINX forwards request to selected server (e.g., 10.0.1.10:3000)
6. Backend server processes request and sends response to NGINX
7. NGINX forwards response back to client

**NGINX Internal Architecture:**
- **Master Process**: Manages worker processes, reads configuration, handles signals
- **Worker Processes**: Handle actual client connections (typically 1 per CPU core)
- **Event-driven**: Each worker can handle thousands of connections simultaneously using **epoll** (Linux) or **kqueue** (BSD) - these are efficient I/O event notification mechanisms
- **Memory**: Uses shared memory between processes for statistics and caching
4.  **Web/API Servers:** Stateless application servers that contain the business
    logic.
5.  **Cache (Redis/Memcached):** The speed booster. The app server first checks
    the **cache** for pre-computed data.

### Real-World Caching Implementation

**What happens when a user requests their timeline:**

```javascript
// In your Node.js API server
async function getTimeline(userId) {
    const cacheKey = `timeline:${userId}`;
    
    // Step 1: Check Redis cache first
    let timeline = await redis.get(cacheKey);
    
    if (timeline) {
        // CACHE HIT: Data found in Redis (typical response time: 1-2ms)
        console.log('Cache hit - returning cached timeline');
        return JSON.parse(timeline);
    }
    
    // CACHE MISS: Data not in cache, must fetch from database
    console.log('Cache miss - fetching from database');
    
    // Step 2: Query PostgreSQL database (typical response time: 50-200ms)
    const dbResult = await db.query(`
        SELECT t.content, t.created_at, u.username 
        FROM tweets t 
        JOIN users u ON t.user_id = u.id 
        WHERE t.user_id IN (
            SELECT followee_id FROM follows WHERE follower_id = $1
        ) 
        ORDER BY t.created_at DESC 
        LIMIT 50
    `, [userId]);
    
    // Step 3: Store result in Redis for future requests
    await redis.setex(cacheKey, 300, JSON.stringify(dbResult)); // Expires in 5 minutes
    
    return dbResult;
}
```

**How Redis connects to your application:**
- Your Node.js server connects to Redis via TCP on port 6379
- Connection string: `redis://localhost:6379` or `redis://redis-server:6379` in Docker
- Redis runs as a separate process/container from your API server

**Cache invalidation (when to remove cached data):**
```javascript
// When user posts a new tweet, invalidate their followers' cached timelines
async function postTweet(userId, content) {
    // Save tweet to database
    await db.query('INSERT INTO tweets (user_id, content) VALUES ($1, $2)', [userId, content]);
    
    // Find all followers
    const followers = await db.query('SELECT follower_id FROM follows WHERE followee_id = $1', [userId]);
    
    // Invalidate each follower's cached timeline
    for (const follower of followers) {
        await redis.del(`timeline:${follower.follower_id}`);
    }
}
```
6.  **SQL Database (PostgreSQL):** The source of truth. For complex queries.

### Real-World Database Implementation

**What PostgreSQL actually is:**
PostgreSQL is a **relational database management system (RDBMS)** - a software that stores, organizes, and retrieves data. It runs as a separate process (typically on port 5432) that your applications connect to over a network. It stores data in **tables** (like Excel spreadsheets) with **rows** (records) and **columns** (fields).

**Database Schema for Twitter-like App:**
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tweets table  
CREATE TABLE tweets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (char_length(content) <= 280),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Follows table (many-to-many relationship)
CREATE TABLE follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    followee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(follower_id, followee_id) -- Prevent duplicate follows
);

-- Likes table
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tweet_id UUID NOT NULL REFERENCES tweets(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, tweet_id) -- Prevent duplicate likes
);
```

**Database Indexes (Speed up queries):**
```sql
-- Indexes are data structures that create shortcuts for fast lookups
-- Without indexes, database must scan every row (slow)
-- With indexes, database can jump directly to relevant rows (fast)

-- Speed up timeline queries (most important!)
CREATE INDEX idx_tweets_user_id_created_at ON tweets(user_id, created_at DESC);

-- Speed up follow lookups
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_followee_id ON follows(followee_id);

-- Speed up like counts
CREATE INDEX idx_likes_tweet_id ON likes(tweet_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);

-- Speed up user lookups
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
```

**Connection Pooling (How your app connects to database):**
```javascript
// Database connection pool configuration
const { Pool } = require('pg');

const dbPool = new Pool({
    host: 'postgres-server',     // Database server hostname
    port: 5432,                  // PostgreSQL default port
    database: 'twitter_db',      // Database name
    user: 'api_user',            // Database username
    password: 'secure_password', // Database password
    
    // Pool settings - reuse connections for efficiency
    max: 20,          // Maximum 20 connections in pool
    min: 5,           // Keep minimum 5 connections open
    idleTimeoutMillis: 30000,  // Close idle connections after 30 seconds
    connectionTimeoutMillis: 10000, // Wait max 10 seconds for connection
    
    // SSL for production
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Example: Complex timeline query with JOINs
async function getTimelineFromDB(userId, limit = 50, offset = 0) {
    const query = `
        SELECT 
            t.id,
            t.content,
            t.created_at,
            u.username,
            u.avatar_url,
            -- Count likes for each tweet (subquery)
            (SELECT COUNT(*) FROM likes l WHERE l.tweet_id = t.id) as like_count,
            -- Check if current user liked this tweet
            (SELECT COUNT(*) > 0 FROM likes l WHERE l.tweet_id = t.id AND l.user_id = $1) as user_liked
        FROM tweets t
        JOIN users u ON t.user_id = u.id
        WHERE t.user_id IN (
            -- Get all users that current user follows
            SELECT f.followee_id 
            FROM follows f 
            WHERE f.follower_id = $1
        )
        OR t.user_id = $1  -- Include user's own tweets
        ORDER BY t.created_at DESC
        LIMIT $2 OFFSET $3
    `;
    
    try {
        const result = await dbPool.query(query, [userId, limit, offset]);
        return result.rows;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}
```

**Database Performance Optimization:**
```sql
-- EXPLAIN ANALYZE shows exactly how PostgreSQL executes your query
EXPLAIN ANALYZE 
SELECT t.content, u.username 
FROM tweets t 
JOIN users u ON t.user_id = u.id 
WHERE t.user_id IN (
    SELECT followee_id FROM follows WHERE follower_id = '123e4567-e89b-12d3-a456-426614174000'
)
ORDER BY t.created_at DESC 
LIMIT 50;

-- Example output shows:
-- Nested Loop (cost=0.43..1234.56 rows=50 width=64) (actual time=0.123..5.678 rows=50 loops=1)
-- -> Index Scan on follows (cost=0.29..45.67 rows=100 width=16) (actual time=0.012..0.234 rows=100 loops=1)
-- -> Index Scan on tweets (cost=0.14..11.89 rows=1 width=48) (actual time=0.001..0.002 rows=1 loops=100)
```

**Database Deployment & Configuration:**
- PostgreSQL runs in a Docker container or on a dedicated server
- Data is stored on persistent disk (SSDs for better performance)  
- PostgreSQL configuration file (`postgresql.conf`) tuned for your workload:
  - `shared_buffers` = 25% of RAM (cache frequently accessed data)
  - `work_mem` = RAM/(max_connections*2) (memory for sorting/joining)
  - `max_connections` = number of concurrent database connections allowed
7.  **Message Queue (Apache Kafka / Amazon SQS):** The async coordinator. Allows
    slow tasks to be handled in the background.

### Real-World Message Queue Implementation

**What Apache Kafka actually is:**
Kafka is a **distributed streaming platform** - think of it as a high-performance message bus that can handle millions of messages per second. It stores messages in categories called **topics** (like "tweet-published", "user-registered"). Multiple applications can **produce** (send) messages to topics and **consume** (receive) messages from topics independently.

**Kafka Architecture:**
- **Brokers**: Kafka server processes that store and serve messages (typically 3-5 brokers for redundancy)
- **Topics**: Categories of messages (like "tweet-published", "email-notifications")  
- **Partitions**: Topics are divided into partitions for parallel processing and scaling
- **Producers**: Applications that send messages to Kafka
- **Consumers**: Applications that read messages from Kafka
- **Consumer Groups**: Multiple consumer instances working together to process messages

**How Kafka connects to your system:**
```javascript
// Producer (API Server) - sends messages when events happen
const kafka = require('kafkajs');

const kafkaClient = kafka({
    clientId: 'twitter-api',
    brokers: ['kafka-broker-1:9092', 'kafka-broker-2:9092', 'kafka-broker-3:9092']
});

const producer = kafkaClient.producer();

// When user posts a tweet, send message to Kafka
async function publishTweet(userId, tweetData) {
    // Save tweet to database first
    const tweet = await db.query('INSERT INTO tweets (user_id, content) VALUES ($1, $2) RETURNING *', 
                                 [userId, tweetData.content]);
    
    // Send message to Kafka for background processing
    await producer.send({
        topic: 'tweet-published',
        messages: [{
            key: userId,  // Messages with same key go to same partition
            value: JSON.stringify({
                userId: userId,
                tweetId: tweet.id,
                content: tweet.content,
                createdAt: tweet.created_at,
                timestamp: Date.now()
            }),
            headers: {
                'event-type': 'tweet-published',
                'version': '1.0'
            }
        }]
    });
    
    console.log('Tweet saved and message sent to Kafka');
}
```

**Consumer (Worker) - processes messages:**
```javascript
// Worker process that listens for tweet messages
const consumer = kafkaClient.consumer({ 
    groupId: 'timeline-update-workers',  // Consumer group for load balancing
    maxWaitTimeInMs: 100,               // How long to wait for messages
    sessionTimeout: 30000               // Heartbeat timeout
});

async function startWorker() {
    await consumer.connect();
    
    // Subscribe to topics
    await consumer.subscribe({ 
        topics: ['tweet-published', 'user-followed'] 
    });
    
    // Process messages
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const data = JSON.parse(message.value.toString());
            
            console.log(`Processing message from topic: ${topic}, partition: ${partition}`);
            
            try {
                switch (topic) {
                    case 'tweet-published':
                        await handleTweetPublished(data);
                        break;
                    case 'user-followed':
                        await handleUserFollowed(data);
                        break;
                }
            } catch (error) {
                console.error('Error processing message:', error);
                // In production, you'd send failed messages to a "dead letter queue"
            }
        },
    });
}

async function handleTweetPublished(tweetData) {
    // Heavy work: Update all followers' cached timelines
    const followers = await db.query('SELECT follower_id FROM follows WHERE followee_id = $1', 
                                     [tweetData.userId]);
    
    // This could take 10+ seconds for users with many followers
    for (const follower of followers) {
        const cacheKey = `timeline:${follower.follower_id}`;
        
        // Add new tweet to follower's cached timeline  
        await redis.lpush(cacheKey, JSON.stringify(tweetData));
        await redis.ltrim(cacheKey, 0, 49); // Keep only latest 50 tweets
        await redis.expire(cacheKey, 300);  // Reset expiration
    }
    
    console.log(`Updated timelines for ${followers.length} followers`);
}
```

**Kafka Topic Configuration:**
```bash
# Create topics with specific configurations
kafka-topics.sh --create \
  --bootstrap-server kafka-broker-1:9092 \
  --topic tweet-published \
  --partitions 6 \        # 6 partitions for parallel processing
  --replication-factor 3  # Data replicated across 3 brokers

# Each partition can be processed by different worker instances
# More partitions = more parallelism = faster processing
```

**Why use Kafka instead of direct database updates:**
1. **Asynchronous Processing**: API responds immediately, heavy work happens in background
2. **Fault Tolerance**: If worker crashes, messages are not lost
3. **Scalability**: Add more worker instances to process messages faster
4. **Decoupling**: API server doesn't need to know about all downstream effects

**Message Flow Example:**
1. User posts tweet → API server saves to database (fast: 50ms)
2. API server sends message to Kafka → Returns success to user immediately  
3. Worker processes consume message from Kafka → Updates follower timelines (slow: 5-10 seconds)
4. Users see new tweet in timeline when they refresh (timeline already pre-computed)
8.  **Workers:** Background processes that listen to the message queue and do
    the heavy lifting.

### Real-World Worker Implementation

**What workers actually are:**
Workers are separate processes (or containers) that run independently from your main API server. They continuously monitor message queues for tasks to process. Think of them like background employees who handle time-consuming jobs so your main API can respond quickly to users.

**How workers connect to the system:**
```javascript
// Worker process (runs separately from your API server)
const kafka = require('kafkajs');

const consumer = kafka.consumer({ groupId: 'timeline-workers' });

async function startWorker() {
    await consumer.connect();
    await consumer.subscribe({ topic: 'tweet-published' });
    
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const tweetData = JSON.parse(message.value.toString());
            
            // Heavy work: Update all followers' cached timelines
            await updateFollowerTimelines(tweetData.userId, tweetData.tweet);
        },
    });
}

async function updateFollowerTimelines(userId, tweet) {
    // This could take 5-10 seconds for a user with many followers
    const followers = await db.query('SELECT follower_id FROM follows WHERE followee_id = $1', [userId]);
    
    for (const follower of followers) {
        // Add new tweet to each follower's cached timeline
        const cacheKey = `timeline:${follower.follower_id}`;
        await redis.lpush(cacheKey, JSON.stringify(tweet));
        await redis.ltrim(cacheKey, 0, 49); // Keep only latest 50 tweets
    }
}

startWorker();
```

**Worker deployment:**
- Workers run as separate processes/containers from your API server
- You can run multiple worker instances for parallel processing
- Workers connect to the same Kafka cluster and database as your API server
- Each worker instance joins a "consumer group" to share the workload

---

## Step 6: Detailed Deep Dive & Trade-offs

### Purpose

You zoom in on the trickiest part of the system and explain the different ways
to solve it, along with the trade-offs of each approach.

### Deep Dive: The "Timeline" Problem

How do we generate the feed?

**Option 1: Fan-out-on-write (Push Model)**

- **What it is:** When a user posts a tweet, we immediately "push" it into the
  cache of every single one of their followers.
- **Pros:** **Extremely fast reads.**
- **Cons:** **Very slow writes.** (e.g., a celebrity with 50M followers).
- **When to use:** Best for systems where users have a small number of
  followers.

**Option 2: Fan-out-on-read (Pull Model)**

- **What it is:** When a user wants their timeline, the system dynamically
  fetches the latest tweets from everyone they follow.
- **Pros:** **Fast writes.**
- **Cons:** **Very slow reads.** (e.g., a user who follows thousands of people).
- **When to use:** Best for systems where writes are more frequent than reads.

**The Hybrid Model (The Smart Choice):**

- For most users: Use the **Push model.**
- For celebrities: Use the **Pull model.**
- **The Trade-off:** You accept **engineering complexity** to achieve the
  optimal balance of performance and scalability.

---

## Step 7: Identifying & Mitigating Bottlenecks (Failure Planning)

### Purpose

You actively try to break your own design. You ask "what if?" to find single
points of failure and weak spots.

### Potential Bottlenecks & Solutions

- **Problem: Single Point of Failure (SPOF)**

  - **The Load Balancer** is a SPOF.
  - **Mitigation:** Use a fleet of load balancers in an active-active setup.
  - **The primary SQL Database** is a SPOF.
  - **Mitigation:** Set up **Database Replication** (Primary-Replica
    architecture).

- **Problem: Caching Breakdown**

  - **The Redis cache** fails and restarts, causing a **thundering herd** of
    requests to the database.
  - **Mitigation 1:** Use a **Redis Cluster**.
  - **Mitigation 2:** Implement a **cache warm-up** strategy.

- **Problem: Security & Abuse**
  - A malicious user scripts a bot to create millions of accounts (**bot
    attacks**).
  - **Mitigation:** Implement **Rate Limiting** at the **API Gateway** or use a
    service like **Cloudflare**.

### Real-World API Gateway & Rate Limiting Implementation

**What an API Gateway actually is:**
An API Gateway is a server that sits between your clients and backend services. It acts as a **single entry point** for all client requests and handles cross-cutting concerns like authentication, rate limiting, logging, and request routing. Think of it as a smart proxy that can make decisions about requests before they reach your backend.

**Where API Gateway sits:**
Client → CDN → Load Balancer → **API Gateway** → Backend Services (API servers)

**API Gateway Implementation with Express.js:**
```javascript
// api-gateway.js - Runs on port 3000, in front of your business logic
const express = require('express');
const redis = require('redis');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const app = express();
const redisClient = redis.createClient({ host: 'redis-server', port: 6379 });

// Rate limiting middleware using Redis
const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Maximum 100 requests per window per IP
    
    // Custom store using Redis for distributed rate limiting
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
    }),
    
    // Custom key generator - rate limit per user, not just IP
    keyGenerator: (req) => {
        return req.user?.id || req.ip; // Use user ID if authenticated, otherwise IP
    },
    
    // Custom response when rate limit exceeded
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many requests',
            retryAfter: Math.round(req.rateLimit.resetTime / 1000),
            limit: req.rateLimit.limit,
            remaining: req.rateLimit.remaining
        });
    }
});

// Authentication middleware
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    
    try {
        // Verify JWT token
        const user = jwt.verify(token, process.env.JWT_SECRET);
        
        // Optional: Check if token is blacklisted in Redis
        const isBlacklisted = await redisClient.get(`blacklist:${token}`);
        if (isBlacklisted) {
            return res.status(401).json({ error: 'Token has been revoked' });
        }
        
        req.user = user;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid or expired token' });
    }
}

// Request logging middleware
function requestLogger(req, res, next) {
    const start = Date.now();
    
    // Log request details
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - IP: ${req.ip} - User: ${req.user?.id || 'anonymous'}`);
    
    // Log response details when request finishes
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] Response: ${res.statusCode} - Duration: ${duration}ms`);
    });
    
    next();
}

// Apply middlewares globally
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(requestLogger);                   // Log all requests
app.use(rateLimiter);                     // Rate limit all requests

// Public routes (no authentication required)
app.post('/auth/login', handleLogin);
app.post('/auth/register', handleRegister);

// Protected routes (authentication required)
app.use(authenticateToken); // All routes below require authentication

app.get('/api/timeline', handleTimeline);
app.post('/api/tweets', handleCreateTweet);
app.post('/api/tweets/:id/like', handleLikeTweet);

app.listen(3000, () => {
    console.log('API Gateway running on port 3000');
});
```

**Advanced Rate Limiting Strategies:**
```javascript
// Different rate limits for different endpoints
const timelineRateLimit = rateLimit({
    windowMs: 1 * 60 * 1000,  // 1 minute
    max: 60,                   // 60 requests per minute for timeline (read-heavy)
    message: 'Timeline rate limit exceeded'
});

const tweetRateLimit = rateLimit({
    windowMs: 1 * 60 * 1000,  // 1 minute  
    max: 5,                    // Only 5 tweets per minute (write-heavy, more expensive)
    message: 'Tweet posting rate limit exceeded'
});

const loginRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,                    // Only 5 login attempts per 15 minutes (prevent brute force)
    skipSuccessfulRequests: true, // Don't count successful logins
    message: 'Too many login attempts'
});

// Apply specific rate limits
app.get('/api/timeline', timelineRateLimit, handleTimeline);
app.post('/api/tweets', tweetRateLimit, handleCreateTweet);
app.post('/auth/login', loginRateLimit, handleLogin);
```

**Token Bucket Algorithm (Advanced Rate Limiting):**
```javascript
// Implements token bucket - allows bursts but maintains average rate
class TokenBucket {
    constructor(capacity, refillRate, refillPeriod) {
        this.capacity = capacity;      // Maximum tokens
        this.tokens = capacity;        // Current tokens
        this.refillRate = refillRate;  // Tokens added per period
        this.refillPeriod = refillPeriod; // Time period in ms
        this.lastRefill = Date.now();
    }
    
    async consume(tokensRequested = 1) {
        await this.refill();
        
        if (this.tokens >= tokensRequested) {
            this.tokens -= tokensRequested;
            return true; // Request allowed
        }
        return false; // Request denied
    }
    
    async refill() {
        const now = Date.now();
        const timePassed = now - this.lastRefill;
        const tokensToAdd = Math.floor((timePassed / this.refillPeriod) * this.refillRate);
        
        this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
        this.lastRefill = now;
    }
}

// Usage in Redis-backed rate limiter
async function advancedRateLimit(userId, endpoint) {
    const key = `bucket:${userId}:${endpoint}`;
    
    // Get current bucket state from Redis
    const bucketData = await redisClient.get(key);
    const bucket = bucketData ? 
        JSON.parse(bucketData) : 
        new TokenBucket(100, 10, 1000); // 100 capacity, 10 tokens/second
    
    const allowed = await bucket.consume(1);
    
    // Save bucket state back to Redis
    await redisClient.setex(key, 3600, JSON.stringify(bucket));
    
    return allowed;
}
```

**API Gateway Benefits:**
1. **Centralized Authentication**: Single place to verify tokens
2. **Rate Limiting**: Prevent abuse and ensure fair usage
3. **Request Routing**: Route requests to appropriate backend services
4. **Monitoring**: Single place to log and monitor all API traffic
5. **API Versioning**: Handle multiple API versions (v1, v2) transparently
6. **Request/Response Transformation**: Modify requests/responses if needed

---

## Step 7.5: Real-World Deployment & Infrastructure

### Purpose

This section shows you exactly HOW and WHERE all these components actually run in production. We'll cover containerization, orchestration, cloud services, and the physical infrastructure that powers your application.

### Docker Containerization

**What Docker actually is:**
Docker is a **containerization platform** that packages your application with all its dependencies (code, runtime, libraries, system tools) into a lightweight, portable **container**. Think of containers as lightweight virtual machines that share the host OS kernel but have isolated filesystems, networking, and processes.

**Complete Docker Setup for Twitter-like App:**

```dockerfile
# Dockerfile for API Server
FROM node:18-alpine
WORKDIR /app

# Copy package files first (Docker layer caching optimization)
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000
CMD ["node", "server.js"]
```

```dockerfile
# Dockerfile for Worker Process  
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

CMD ["node", "worker.js"]
```

```yaml
# docker-compose.yml - Complete development environment
version: '3.8'

services:
  # NGINX Load Balancer
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/ssl:ro  # SSL certificates
    depends_on:
      - api-1
      - api-2
    networks:
      - frontend
      - backend

  # API Server Instances (multiple for load balancing)
  api-1:
    build: .
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://api_user:secure_password@postgres:5432/twitter_db
      - REDIS_URL=redis://redis:6379
      - KAFKA_BROKERS=kafka-1:9092,kafka-2:9092,kafka-3:9092
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis
      - kafka-1
    networks:
      - backend
    restart: unless-stopped
    
  api-2:
    build: .
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://api_user:secure_password@postgres:5432/twitter_db
      - REDIS_URL=redis://redis:6379
      - KAFKA_BROKERS=kafka-1:9092,kafka-2:9092,kafka-3:9092
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis
      - kafka-1
    networks:
      - backend
    restart: unless-stopped

  # Worker Processes  
  worker-1:
    build:
      context: .
      dockerfile: Dockerfile.worker
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://api_user:secure_password@postgres:5432/twitter_db
      - REDIS_URL=redis://redis:6379
      - KAFKA_BROKERS=kafka-1:9092,kafka-2:9092,kafka-3:9092
    depends_on:
      - postgres
      - redis
      - kafka-1
    networks:
      - backend
    restart: unless-stopped

  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=twitter_db
      - POSTGRES_USER=api_user
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    ports:
      - "5432:5432"
    networks:
      - backend
    restart: unless-stopped

  # Redis Cache
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --maxmemory 512mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - backend
    restart: unless-stopped

  # Kafka Cluster (3 brokers for high availability)
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    networks:
      - backend

  kafka-1:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka-1:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 3
    networks:
      - backend

  kafka-2:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper
    environment:
      KAFKA_BROKER_ID: 2
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka-2:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 3
    networks:
      - backend

  kafka-3:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper
    environment:
      KAFKA_BROKER_ID: 3
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka-3:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 3
    networks:
      - backend

volumes:
  postgres_data:
  redis_data:

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
```

### Kubernetes Deployment (Production Orchestration)

**What Kubernetes actually is:**
Kubernetes (K8s) is a **container orchestration platform** that manages containerized applications across a cluster of machines. It handles deployment, scaling, networking, service discovery, health checks, and automatic recovery of your containers.

**Key Kubernetes Concepts:**
- **Pod**: Smallest deployable unit (contains one or more containers)
- **Service**: Network endpoint that provides stable IP/DNS for pods
- **Deployment**: Manages multiple pod replicas and rolling updates
- **ConfigMap**: Configuration data stored separately from container images
- **Secret**: Sensitive data (passwords, tokens) encrypted at rest
- **Ingress**: HTTP/HTTPS routing rules for external traffic

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: twitter-app
---
# k8s/api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
  namespace: twitter-app
spec:
  replicas: 3  # Run 3 instances of API server
  selector:
    matchLabels:
      app: api-server
  template:
    metadata:
      labels:
        app: api-server
    spec:
      containers:
      - name: api
        image: twitter-api:v1.0.0
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        - name: REDIS_URL
          value: "redis://redis-service:6379"
        - name: KAFKA_BROKERS
          value: "kafka-service:9092"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
# k8s/api-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: api-service
  namespace: twitter-app
spec:
  selector:
    app: api-server
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP  # Internal service
---
# k8s/worker-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: worker
  namespace: twitter-app
spec:
  replicas: 2  # 2 worker instances for processing messages
  selector:
    matchLabels:
      app: worker
  template:
    metadata:
      labels:
        app: worker
    spec:
      containers:
      - name: worker
        image: twitter-worker:v1.0.0
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        - name: REDIS_URL
          value: "redis://redis-service:6379"
        - name: KAFKA_BROKERS
          value: "kafka-service:9092"
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
---
# k8s/ingress.yaml - Route external traffic
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
  namespace: twitter-app
  annotations:
    nginx.ingress.kubernetes.io/rate-limit: "100"  # Rate limit
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - api.yourapp.com
    secretName: api-tls
  rules:
  - host: api.yourapp.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80
```

### Cloud Infrastructure (AWS Example)

**Real AWS Architecture Components:**

```yaml
# terraform/main.tf - Infrastructure as Code
provider "aws" {
  region = "us-west-2"
}

# VPC (Virtual Private Cloud) - Your private network in AWS
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = "twitter-app-vpc"
  }
}

# Subnets - Network segments within VPC
resource "aws_subnet" "public" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 1}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
  
  tags = {
    Name = "Public Subnet ${count.index + 1}"
  }
}

resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 10}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]
  
  tags = {
    Name = "Private Subnet ${count.index + 1}"
  }
}

# EKS Cluster - Managed Kubernetes
resource "aws_eks_cluster" "main" {
  name     = "twitter-app-cluster"
  role_arn = aws_iam_role.cluster.arn
  version  = "1.27"

  vpc_config {
    subnet_ids = concat(aws_subnet.public[*].id, aws_subnet.private[*].id)
  }
}

# EKS Node Group - Worker machines for your pods
resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "main-nodes"
  node_role_arn   = aws_iam_role.node.arn
  subnet_ids      = aws_subnet.private[*].id
  instance_types  = ["t3.medium"]

  scaling_config {
    desired_size = 3
    max_size     = 6
    min_size     = 2
  }
}

# RDS PostgreSQL - Managed database
resource "aws_db_instance" "main" {
  identifier     = "twitter-app-db"
  engine         = "postgres"
  engine_version = "15.3"
  instance_class = "db.t3.micro"
  
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type          = "gp3"
  storage_encrypted     = true
  
  db_name  = "twitter_db"
  username = "api_user"
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = false
  final_snapshot_identifier = "twitter-app-final-snapshot"
}

# ElastiCache Redis - Managed cache
resource "aws_elasticache_cluster" "main" {
  cluster_id           = "twitter-app-cache"
  engine              = "redis"
  node_type           = "cache.t3.micro"
  num_cache_nodes     = 1
  parameter_group_name = "default.redis7"
  port                = 6379
  subnet_group_name   = aws_elasticache_subnet_group.main.name
  security_group_ids  = [aws_security_group.redis.id]
}

# Application Load Balancer - Distributes traffic to EKS pods
resource "aws_lb" "main" {
  name               = "twitter-app-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id
}
```

**Monitoring and Logging Setup:**
```yaml
# k8s/monitoring.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: twitter-app
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
    scrape_configs:
    - job_name: 'api-servers'
      kubernetes_sd_configs:
      - role: pod
      relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app]
        action: keep
        regex: api-server
    - job_name: 'redis'
      static_configs:
      - targets: ['redis-service:6379']
    - job_name: 'postgres'
      static_configs:
      - targets: ['postgres-service:5432']
---
# Grafana dashboard for visualization
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-dashboard
data:
  dashboard.json: |
    {
      "dashboard": {
        "title": "Twitter App Metrics",
        "panels": [
          {
            "title": "API Response Time",
            "type": "graph",
            "targets": [
              {
                "expr": "histogram_quantile(0.95, http_request_duration_seconds_bucket{job=\"api-servers\"})",
                "legendFormat": "95th percentile"
              }
            ]
          },
          {
            "title": "Redis Hit Rate", 
            "type": "stat",
            "targets": [
              {
                "expr": "redis_keyspace_hits_total / (redis_keyspace_hits_total + redis_keyspace_misses_total)",
                "legendFormat": "Hit Rate"
              }
            ]
          }
        ]
      }
    }
```

### Deployment Process

**CI/CD Pipeline (GitHub Actions):**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm ci
    - run: npm test
    - run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Build and push Docker image
      run: |
        docker build -t twitter-api:$GITHUB_SHA .
        echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
        docker push twitter-api:$GITHUB_SHA

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
    - name: Deploy to Kubernetes
      run: |
        aws eks get-token --cluster-name twitter-app-cluster | kubectl apply -f k8s/
        kubectl set image deployment/api-server api=twitter-api:$GITHUB_SHA
        kubectl rollout status deployment/api-server
```

**Where everything runs in production:**
- **EKS Cluster**: Your application pods run on EC2 instances managed by Kubernetes
- **RDS**: PostgreSQL database runs on AWS-managed infrastructure
- **ElastiCache**: Redis runs on AWS-managed infrastructure  
- **ALB**: Application Load Balancer distributes traffic across EKS pods
- **Route 53**: DNS service resolves your domain to ALB IP address
- **CloudWatch**: Collects logs and metrics from all services
- **S3**: Stores Docker images, backups, and static assets

### Monitoring and Observability Implementation

**What monitoring actually involves:**
Monitoring is about collecting, storing, and visualizing data about your system's health and performance. **Observability** goes deeper - it's about understanding WHY something happened, not just WHAT happened. You need three types of data:

1. **Logs**: Text records of events ("User 123 logged in", "Database query failed")
2. **Metrics**: Numerical measurements over time (CPU usage, response times, request counts)
3. **Traces**: Request paths through your distributed system (timeline of request → API → cache → database)

**Complete Monitoring Stack Implementation:**

```javascript
// Add monitoring to your API server
const express = require('express');
const prometheus = require('prom-client');

const app = express();

// Create custom metrics
const httpRequestDuration = new prometheus.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const httpRequestTotal = new prometheus.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
});

const activeUsers = new prometheus.Gauge({
    name: 'active_users_total',
    help: 'Number of currently active users'
});

const cacheHitRate = new prometheus.Gauge({
    name: 'cache_hit_rate',
    help: 'Cache hit rate percentage'
});

// Middleware to collect metrics
function metricsMiddleware(req, res, next) {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        const route = req.route?.path || req.path;
        
        httpRequestDuration
            .labels(req.method, route, res.statusCode.toString())
            .observe(duration);
            
        httpRequestTotal
            .labels(req.method, route, res.statusCode.toString())
            .inc();
    });
    
    next();
}

// Structured logging with correlation IDs
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.Console()
    ]
});

// Middleware to add correlation ID to every request
function correlationMiddleware(req, res, next) {
    req.correlationId = req.headers['x-correlation-id'] || 
                       require('uuid').v4();
    res.set('x-correlation-id', req.correlationId);
    next();
}

// Enhanced logging in your API endpoints
app.get('/api/timeline', correlationMiddleware, metricsMiddleware, async (req, res) => {
    const startTime = Date.now();
    
    logger.info('Timeline request started', {
        correlationId: req.correlationId,
        userId: req.user.id,
        endpoint: '/api/timeline'
    });
    
    try {
        const timeline = await getTimeline(req.user.id);
        
        logger.info('Timeline request completed', {
            correlationId: req.correlationId,
            userId: req.user.id,
            responseTime: Date.now() - startTime,
            timelineSize: timeline.length
        });
        
        res.json({ tweets: timeline });
    } catch (error) {
        logger.error('Timeline request failed', {
            correlationId: req.correlationId,
            userId: req.user.id,
            error: error.message,
            stack: error.stack
        });
        
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Metrics endpoint for Prometheus to scrape
app.get('/metrics', async (req, res) => {
    // Update custom metrics before exposing
    const activeUsersCount = await redis.get('active_users_count') || 0;
    activeUsers.set(parseInt(activeUsersCount));
    
    const cacheStats = await redis.info('stats');
    const hitRate = calculateHitRate(cacheStats);
    cacheHitRate.set(hitRate);
    
    res.set('Content-Type', prometheus.register.contentType);
    res.end(await prometheus.register.metrics());
});
```

**Distributed Tracing Implementation:**
```javascript
// Add tracing to track requests across services
const opentelemetry = require('@opentelemetry/api');
const { NodeSDK } = require('@opentelemetry/auto-instrumentations-node');

// Configure tracing
const sdk = new NodeSDK({
    serviceName: 'twitter-api',
    instrumentations: [
        // Auto-instrument HTTP, Redis, PostgreSQL
    ]
});

sdk.start();

// Manual span creation for custom operations
async function getTimeline(userId) {
    const tracer = opentelemetry.trace.getTracer('twitter-api');
    
    return tracer.startActiveSpan('get_timeline', async (span) => {
        span.setAttributes({
            'user.id': userId,
            'operation': 'timeline_fetch'
        });
        
        try {
            // Check cache
            const cached = await tracer.startActiveSpan('cache_check', async (cacheSpan) => {
                const result = await redis.get(`timeline:${userId}`);
                cacheSpan.setAttributes({
                    'cache.hit': !!result,
                    'cache.key': `timeline:${userId}`
                });
                return result;
            });
            
            if (cached) {
                span.setAttributes({ 'cache.hit': true });
                return JSON.parse(cached);
            }
            
            // Database query
            const dbResult = await tracer.startActiveSpan('db_query', async (dbSpan) => {
                dbSpan.setAttributes({
                    'db.operation': 'select',
                    'db.table': 'tweets'
                });
                
                const result = await db.query(`SELECT ... FROM tweets WHERE ...`, [userId]);
                
                dbSpan.setAttributes({
                    'db.rows_affected': result.rows.length
                });
                
                return result.rows;
            });
            
            // Cache the result
            await redis.setex(`timeline:${userId}`, 300, JSON.stringify(dbResult));
            
            span.setAttributes({ 
                'timeline.size': dbResult.length,
                'cache.stored': true 
            });
            
            return dbResult;
        } catch (error) {
            span.recordException(error);
            span.setStatus({ code: opentelemetry.SpanStatusCode.ERROR });
            throw error;
        } finally {
            span.end();
        }
    });
}
```

**Alerting Configuration:**
```yaml
# alertmanager.yml - Alert routing and notifications
global:
  smtp_smarthost: 'smtp.gmail.com:587'
  smtp_from: 'alerts@yourapp.com'

route:
  group_by: ['alertname', 'severity']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 12h
  receiver: 'default'
  routes:
  - match:
      severity: critical
    receiver: 'critical-alerts'
  - match:
      severity: warning  
    receiver: 'warning-alerts'

receivers:
- name: 'default'
  email_configs:
  - to: 'team@yourapp.com'
    subject: '[ALERT] {{ .GroupLabels.alertname }}'
    body: |
      {{ range .Alerts }}
      Alert: {{ .Annotations.summary }}
      Description: {{ .Annotations.description }}
      {{ end }}

- name: 'critical-alerts'
  email_configs:
  - to: 'oncall@yourapp.com'
    subject: '[CRITICAL] {{ .GroupLabels.alertname }}'
  slack_configs:
  - api_url: 'YOUR_SLACK_WEBHOOK'
    channel: '#alerts'
    title: 'Critical Alert'
    text: '{{ .CommonAnnotations.summary }}'
```

```yaml
# prometheus-alerts.yml - Define when to trigger alerts
groups:
- name: api-alerts
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status_code=~"5.."}[5m]) > 0.1
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "High error rate detected"
      description: "Error rate is above 10% for 2 minutes"
      
  - alert: HighLatency
    expr: histogram_quantile(0.95, http_request_duration_seconds_bucket) > 1
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High latency detected"
      description: "95th percentile latency is above 1 second"
      
  - alert: DatabaseConnectionsHigh
    expr: pg_stat_database_numbackends > 80
    for: 1m
    labels:
      severity: warning
    annotations:
      summary: "High database connection usage"
      description: "Database connections are above 80% capacity"
      
  - alert: RedisMemoryHigh
    expr: redis_memory_used_bytes / redis_memory_max_bytes > 0.9
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "Redis memory usage critical"
      description: "Redis memory usage is above 90%"
```

**Log Analysis and Monitoring:**
```bash
# ELK Stack for log aggregation and analysis

# Elasticsearch configuration for storing logs
# elasticsearch.yml
cluster.name: "twitter-logs"
node.name: "node-1"
network.host: 0.0.0.0
discovery.type: single-node

# Logstash pipeline for processing logs
# logstash.conf
input {
  beats {
    port => 5044
  }
}

filter {
  if [fields][service] == "api-server" {
    json {
      source => "message"
    }
    
    # Extract response time from logs
    if [responseTime] {
      mutate {
        convert => { "responseTime" => "integer" }
      }
    }
    
    # Add tags based on log level
    if [level] == "error" {
      mutate {
        add_tag => [ "error", "needs_attention" ]
      }
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "twitter-logs-%{+YYYY.MM.dd}"
  }
}

# Kibana dashboard queries
# Find all errors in the last hour:
level:error AND @timestamp:[now-1h TO now]

# Find slow requests (>1 second):
responseTime:>1000 AND @timestamp:[now-1h TO now]

# Find requests by correlation ID to trace user journey:
correlationId:"abc-123-def"
```

**Health Checks and Circuit Breakers:**
```javascript
// Health check endpoints
app.get('/health', async (req, res) => {
    const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {}
    };
    
    try {
        // Check database
        await db.query('SELECT 1');
        health.services.database = 'healthy';
    } catch (error) {
        health.services.database = 'unhealthy';
        health.status = 'unhealthy';
    }
    
    try {
        // Check Redis
        await redis.ping();
        health.services.redis = 'healthy';
    } catch (error) {
        health.services.redis = 'unhealthy';
        health.status = 'unhealthy';
    }
    
    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
});

// Circuit breaker for external services
const CircuitBreaker = require('opossum');

const dbCircuitBreaker = new CircuitBreaker(async (query, params) => {
    return await db.query(query, params);
}, {
    timeout: 5000,          // 5 second timeout
    errorThresholdPercentage: 50,  // Open circuit at 50% error rate
    resetTimeout: 30000     // Try again after 30 seconds
});

// Use circuit breaker in your code
async function getTimeline(userId) {
    try {
        const result = await dbCircuitBreaker.fire(
            'SELECT * FROM tweets WHERE user_id = $1', 
            [userId]
        );
        return result.rows;
    } catch (error) {
        if (error.message === 'Circuit breaker is open') {
            // Return cached data or fallback response
            logger.warn('Database circuit breaker open, returning cached data');
            return await getCachedTimeline(userId) || [];
        }
        throw error;
    }
}
```

This monitoring setup gives you complete visibility into your system's health, performance, and user behavior - essential for running a production application.

---

## Step 8: The Final Summary & Next Steps

### Purpose

Conclude by succinctly summarizing your design and showing you have a vision for
the future.

### What to Do

1.  **Reiterate:** "To summarize, we designed a system to handle 10M DAU by
    using a load-balanced, microservice architecture. We chose a hybrid
    push/pull model for the timeline to balance read and write performance.
    We've mitigated SPOFs through database replication and Redis clustering."
2.  **Discuss Next Steps & Scaling:**
    - "For further scaling, we might consider sharding the `Tweets` table by
      `user_id`."
    - "We can improve personalization by adding a machine learning service to
      rank the timeline."
    - "Areas for further research include a detailed disaster recovery plan."

---

## Step 9: The Most Important Step

> ### Practice. Practice. Practice.
>
> Theory is useless without application. Design systems on paper every day.
