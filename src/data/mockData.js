// Pakistan E-Commerce Sample Data (Catalog, Orders, Customers, Analytics)

export const INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    name: "Khaadi Embroidered 3-Piece Lawn Suit",
    sku: "KHD-LWN-101",
    category: "Fashion",
    price: 6850,
    stock: 45,
    stockStatus: "in_stock",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=150&auto=format&fit=crop&q=80",
    description: "Premium stitched luxury summer lawn collection with embroidered chiffon dupatta and cotton trousers."
  },
  {
    id: "prod-2",
    name: "Handcrafted Charsadda Norozi Peshawari Chappal",
    sku: "PSH-NOR-202",
    category: "Fashion",
    price: 4950,
    stock: 28,
    stockStatus: "in_stock",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=150&auto=format&fit=crop&q=80",
    description: "Authentic double-sole tyre base Peshawari chappal hand-stitched with full-grain cowhide leather."
  },
  {
    id: "prod-3",
    name: "Royal Deluxe Copper Pedestal Room Fan",
    sku: "RYL-FAN-88",
    category: "Home & Living",
    price: 14500,
    stock: 7,
    stockStatus: "low_stock",
    image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=150&auto=format&fit=crop&q=80",
    description: "99.9% electrical steel sheet pure copper wire high-velocity pedestal fan for Pakistani summers."
  },
  {
    id: "prod-4",
    name: "Audionic Airbud 400 Pro ANC Earbuds",
    sku: "AUD-AIR-400",
    category: "Electronics",
    price: 7499,
    stock: 35,
    stockStatus: "in_stock",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=150&auto=format&fit=crop&q=80",
    description: "Quad-mic environmental noise cancellation with 35 hours battery backup and ultra-low gaming latency."
  },
  {
    id: "prod-5",
    name: "Traditional Multani Hand-Painted Blue Pottery Vase",
    sku: "MLT-CER-12",
    category: "Home & Living",
    price: 3200,
    stock: 0,
    stockStatus: "out_of_stock",
    image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=150&auto=format&fit=crop&q=80",
    description: "Authentic Multani Kashigari hand-glazed earthenware ceramic floral vase crafted by local Multan artisans."
  },
  {
    id: "prod-6",
    name: "Super Kernel Premium Aged Basmati Rice (5kg)",
    sku: "RIC-KRN-05",
    category: "Groceries",
    price: 2850,
    stock: 80,
    stockStatus: "in_stock",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=150&auto=format&fit=crop&q=80",
    description: "Naturally aged extra-long aromatic super kernel Basmati grain grown in fertile Punjab river plains."
  },
  {
    id: "prod-7",
    name: "Shan Himalayan Pink Mineral Crystal Salt (4-Pack)",
    sku: "SHN-SLT-04",
    category: "Groceries",
    price: 1250,
    stock: 5,
    stockStatus: "low_stock",
    image: "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=150&auto=format&fit=crop&q=80",
    description: "Pure natural 84+ essential mineral pink salt crystals harvested from historical Khewra salt mines."
  },
  {
    id: "prod-8",
    name: "Karachi Buffed Leather Bifold Wallet & Belt Set",
    sku: "KHI-LTH-77",
    category: "Fashion",
    price: 3850,
    stock: 22,
    stockStatus: "in_stock",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=150&auto=format&fit=crop&q=80",
    description: "Top-grain genuine Karachi artisan tanned leather wallet with RFID blocking and matching brass buckle belt."
  }
];

export const INITIAL_ORDERS = [
  {
    id: "ORD-PK-9101",
    customerName: "Fatima Zahra",
    customerEmail: "fatima.zahra@gmail.com",
    customerAddress: "House 82, Sector Y, Phase 3, DHA, Lahore",
    date: "2026-09-06",
    items: [
      {
        productId: "prod-1",
        productName: "Khaadi Embroidered 3-Piece Lawn Suit",
        quantity: 2,
        price: 6850
      },
      {
        productId: "prod-5",
        productName: "Traditional Multani Hand-Painted Blue Pottery Vase",
        quantity: 1,
        price: 3200
      }
    ],
    subtotal: 16900,
    tax: 845,
    shipping: 0,
    total: 17745,
    paymentMethod: "JazzCash",
    status: "Delivered"
  },
  {
    id: "ORD-PK-9102",
    customerName: "Muhammad Bilal Khan",
    customerEmail: "bilal.khan@peshawartrade.pk",
    customerAddress: "Bungalow 17, University Town, Peshawar",
    date: "2026-09-06",
    items: [
      {
        productId: "prod-4",
        productName: "Audionic Airbud 400 Pro ANC Earbuds",
        quantity: 1,
        price: 7499
      }
    ],
    subtotal: 7499,
    tax: 375,
    shipping: 0,
    total: 7874,
    paymentMethod: "Cash on Delivery (COD)",
    status: "Shipped"
  },
  {
    id: "ORD-PK-9103",
    customerName: "Ayesha Tariq",
    customerEmail: "ayesha.tariq@horizon.com.pk",
    customerAddress: "Apartment 402, Beverly Centre, Blue Area, Islamabad",
    date: "2026-09-05",
    items: [
      {
        productId: "prod-3",
        productName: "Royal Deluxe Copper Pedestal Room Fan",
        quantity: 1,
        price: 14500
      }
    ],
    subtotal: 14500,
    tax: 725,
    shipping: 0,
    total: 15225,
    paymentMethod: "EasyPaisa",
    status: "Pending"
  },
  {
    id: "ORD-PK-9104",
    customerName: "Usman Ghani",
    customerEmail: "usman.ghani@faisallogistics.com",
    customerAddress: "Plot 55, D-Ground, Peoples Colony No. 1, Faisalabad",
    date: "2026-09-04",
    items: [
      {
        productId: "prod-2",
        productName: "Handcrafted Charsadda Norozi Peshawari Chappal",
        quantity: 2,
        price: 4950
      },
      {
        productId: "prod-6",
        productName: "Super Kernel Premium Aged Basmati Rice (5kg)",
        quantity: 2,
        price: 2850
      }
    ],
    subtotal: 15600,
    tax: 780,
    shipping: 0,
    total: 16380,
    paymentMethod: "Raast / Bank Transfer",
    status: "Delivered"
  },
  {
    id: "ORD-PK-9105",
    customerName: "Zainab Ali",
    customerEmail: "zainab.ali@multantech.pk",
    customerAddress: "House 12-A, Bosan Road, Gulgasht Colony, Multan",
    date: "2026-09-03",
    items: [
      {
        productId: "prod-7",
        productName: "Shan Himalayan Pink Mineral Crystal Salt (4-Pack)",
        quantity: 2,
        price: 1250
      }
    ],
    subtotal: 2500,
    tax: 125,
    shipping: 250,
    total: 2875,
    paymentMethod: "Cash on Delivery (COD)",
    status: "Delivered"
  },
  {
    id: "ORD-PK-9106",
    customerName: "Hamza Sheikh",
    customerEmail: "hamza.sheikh@rawalpindi.org",
    customerAddress: "Street 5, Chaklala Scheme III, Rawalpindi",
    date: "2026-09-02",
    items: [
      {
        productId: "prod-8",
        productName: "Karachi Buffed Leather Bifold Wallet & Belt Set",
        quantity: 1,
        price: 3850
      }
    ],
    subtotal: 3850,
    tax: 192,
    shipping: 250,
    total: 4292,
    paymentMethod: "Cash on Delivery (COD)",
    status: "Cancelled"
  }
];

export const INITIAL_USERS = [
  {
    id: "usr-1",
    name: "Wahaj Ahmed",
    email: "wahajwahaj200@gmail.com",
    role: "Admin",
    joinedDate: "2025-01-10",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: "usr-2",
    name: "Fatima Zahra",
    email: "fatima.zahra@gmail.com",
    role: "Customer",
    joinedDate: "2025-03-15",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: "usr-3",
    name: "Muhammad Bilal Khan",
    email: "bilal.khan@peshawartrade.pk",
    role: "Customer",
    joinedDate: "2025-04-20",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: "usr-4",
    name: "Ayesha Tariq",
    email: "ayesha.tariq@horizon.com.pk",
    role: "Customer",
    joinedDate: "2025-06-08",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: "usr-5",
    name: "Usman Ghani",
    email: "usman.ghani@faisallogistics.com",
    role: "Customer",
    joinedDate: "2025-07-22",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: "usr-6",
    name: "Zainab Ali",
    email: "zainab.ali@multantech.pk",
    role: "Customer",
    joinedDate: "2025-09-14",
    status: "Suspended",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: "usr-7",
    name: "Hamza Sheikh",
    email: "hamza.sheikh@rawalpindi.org",
    role: "Customer",
    joinedDate: "2025-10-05",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80"
  }
];

export const MONTHLY_SALES_DATA = [
  { month: "Jan", revenue: 450000, orders: 110 },
  { month: "Feb", revenue: 580000, orders: 135 },
  { month: "Mar", revenue: 720000, orders: 165 },
  { month: "Apr", revenue: 690000, orders: 150 },
  { month: "May", revenue: 880000, orders: 195 },
  { month: "Jun", revenue: 950000, orders: 215 },
  { month: "Jul", revenue: 910000, orders: 205 },
  { month: "Aug", revenue: 1140000, orders: 250 },
  { month: "Sep", revenue: 1285000, orders: 280 }
];

export const CATEGORY_BREAKDOWN_DATA = [
  { name: "Fashion", value: 36, color: "#4F46E5" },
  { name: "Home & Living", value: 24, color: "#0EA5E9" },
  { name: "Electronics", value: 20, color: "#10B981" },
  { name: "Groceries", value: 20, color: "#F59E0B" }
];
