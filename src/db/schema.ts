import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
  varchar,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: text("name").notNull(),
  shortDescription: text("short_description"),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  comparePrice: numeric("compare_price", { precision: 10, scale: 2 }),
  imageUrl: text("image_url"),
  images: jsonb("images").$type<string[]>().default([]),
  category: varchar("category", { length: 100 }),
  brand: varchar("brand", { length: 100 }),
  weight: varchar("weight", { length: 50 }),
  inStock: boolean("in_stock").default(true),
  featured: boolean("featured").default(false),
  badge: varchar("badge", { length: 50 }),
  ingredients: text("ingredients"),
  benefits: jsonb("benefits").$type<string[]>().default([]),
  nutritionalFacts: jsonb("nutritional_facts")
    .$type<{ label: string; value: string; per100g?: string }[]>()
    .default([]),
  certifications: jsonb("certifications").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  postalCode: varchar("postal_code", { length: 20 }),
  items: jsonb("items")
    .$type<
      {
        productId: number;
        name: string;
        price: number;
        quantity: number;
        imageUrl: string;
      }[]
    >()
    .notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingFee: numeric("shipping_fee", { precision: 10, scale: 2 }).default(
    "0"
  ),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  paymentStatus: varchar("payment_status", { length: 50 }).default("pending"),
  orderStatus: varchar("order_status", { length: 50 }).default("processing"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  customerName: text("customer_name").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
