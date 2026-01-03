-- Users table (minimal - Clerk handles auth)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  name TEXT,
  plan TEXT DEFAULT 'free' CHECK(plan IN ('free', 'pro')),
  custom_domain TEXT,
  stripe_customer_id TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Products table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  price TEXT NOT NULL,
  currency TEXT DEFAULT 'VNĐ' CHECK(currency IN ('VNĐ', 'USD')),
  description TEXT,
  contact_method TEXT NOT NULL CHECK(contact_method IN ('zalo', 'whatsapp', 'phone')),
  contact_value TEXT NOT NULL,
  video_url TEXT,
  status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'active')),
  view_count INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, slug)
);

-- Product highlights (bullet points)
CREATE TABLE product_highlights (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  text TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Product images
CREATE TABLE product_images (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  cdn_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Analytics events
CREATE TABLE analytics_events (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK(event_type IN ('view', 'click_contact')),
  user_agent TEXT,
  ip_address TEXT,
  timestamp INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_analytics_product_id ON analytics_events(product_id);
CREATE INDEX idx_analytics_timestamp ON analytics_events(timestamp);
