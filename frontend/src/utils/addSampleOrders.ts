import { createOrder, type Order } from "@/lib/adminStore";

export function addSampleOrders() {
  // Sample Order 1 - Payment Pending
  createOrder({
    status: "payment_pending",
    items: [
      {
        productId: 1,
        code: "RPSS001",
        name: "Royal Purple Silk Saree",
        price: 24999,
        quantity: 1,
        image:
          "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5652-scaled.jpeg?fit=600%2C899&ssl=1",
      },
    ],
    subtotal: 24999,
    shipping: 0,
    discount: 0,
    total: 24999,
    tax: 0,
    customer: {
      name: "Priya Sharma",
      email: "priya.sharma@email.com",
      phone: "+91 9876543210",
      address: {
        fullName: "Priya Sharma",
        phone: "+91 9876543210",
        street: "123 MG Road, Koramangala",
        city: "Bangalore",
        state: "Karnataka",
        country: "India",
        postcode: "560034",
        landmark: "Near Forum Mall",
      },
    },
    transaction: {
      transactionId: "TXN123456789",
      paymentMethod: "UPI",
      amount: 24999,
      status: "pending",
    },
  });

  // Sample Order 2 - Payment Paid
  createOrder({
    status: "payment_paid",
    items: [
      {
        productId: 2,
        code: "EGB002",
        name: "Emerald Green Banarasi",
        price: 18999,
        quantity: 1,
        image:
          "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5693-scaled.jpeg?fit=600%2C899&ssl=1",
      },
      {
        productId: 3,
        code: "GBS003",
        name: "Golden Border Silk",
        price: 15999,
        quantity: 1,
        image:
          "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5652-scaled.jpeg?fit=600%2C899&ssl=1",
      },
    ],
    subtotal: 34998,
    shipping: 500,
    discount: 1500,
    total: 33998,
    tax: 0,
    couponCode: "WELCOME15",
    customer: {
      name: "Anita Desai",
      email: "anita.desai@email.com",
      phone: "+91 9123456789",
      address: {
        fullName: "Anita Desai",
        phone: "+91 9123456789",
        street: "456 Park Street, Salt Lake",
        city: "Kolkata",
        state: "West Bengal",
        country: "India",
        postcode: "700091",
        landmark: "Opposite City Centre Mall",
      },
    },
    transaction: {
      transactionId: "TXN987654321",
      paymentMethod: "Credit Card",
      amount: 33998,
      status: "completed",
    },
  });

  // Sample Order 3 - Shipped
  createOrder({
    status: "shipped",
    items: [
      {
        productId: 4,
        code: "MKS004",
        name: "Maroon Kanjivaram Silk",
        price: 32999,
        quantity: 1,
        image:
          "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5652-scaled.jpeg?fit=600%2C899&ssl=1",
      },
    ],
    subtotal: 32999,
    shipping: 0,
    discount: 3000,
    total: 29999,
    tax: 0,
    couponCode: "FESTIVE10",
    deliveryPartner: "Blue Dart",
    deliveryTrackingId: "BD123456789",
    customer: {
      name: "Meera Patel",
      email: "meera.patel@email.com",
      phone: "+91 9988776655",
      address: {
        fullName: "Meera Patel",
        phone: "+91 9988776655",
        street: "789 SG Highway, Bodakdev",
        city: "Ahmedabad",
        state: "Gujarat",
        country: "India",
        postcode: "380054",
        landmark: "Near Himalaya Mall",
      },
    },
    transaction: {
      transactionId: "TXN456789123",
      paymentMethod: "Net Banking",
      amount: 29999,
      status: "completed",
    },
  });

  // Sample Order 4 - Payment Cancelled
  createOrder({
    status: "payment_cancelled",
    items: [
      {
        productId: 5,
        code: "NBDS005",
        name: "Navy Blue Designer Saree",
        price: 21999,
        quantity: 1,
        image:
          "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5693-scaled.jpeg?fit=600%2C899&ssl=1",
      },
    ],
    subtotal: 21999,
    shipping: 300,
    discount: 0,
    total: 22299,
    tax: 0,
    customer: {
      name: "Kavya Reddy",
      email: "kavya.reddy@email.com",
      phone: "+91 9876543211",
    },
    transaction: {
      transactionId: "TXN789123456",
      paymentMethod: "Debit Card",
      amount: 22299,
      status: "failed",
    },
  });

  // Sample Order 5 - Recent Payment Paid with multiple items
  createOrder({
    status: "payment_paid",
    items: [
      {
        productId: 6,
        code: "PGS006",
        name: "Pink Georgette Saree",
        price: 12999,
        quantity: 2,
        image:
          "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5652-scaled.jpeg?fit=600%2C899&ssl=1",
      },
      {
        productId: 7,
        code: "BCS007",
        name: "Black Chiffon Saree",
        price: 8999,
        quantity: 1,
        image:
          "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5693-scaled.jpeg?fit=600%2C899&ssl=1",
      },
    ],
    subtotal: 34997,
    shipping: 0,
    discount: 2000,
    total: 32997,
    tax: 0,
    couponCode: "BULK20",
    customer: {
      name: "Sunita Agarwal",
      email: "sunita.agarwal@email.com",
      phone: "+91 9123456780",
      address: {
        fullName: "Sunita Agarwal",
        phone: "+91 9123456780",
        street: "321 Civil Lines, Model Town",
        city: "Delhi",
        state: "Delhi",
        country: "India",
        postcode: "110009",
        landmark: "Near Metro Station",
      },
    },
    transaction: {
      transactionId: "TXN321654987",
      paymentMethod: "Wallet",
      amount: 32997,
      status: "completed",
    },
  });

  console.log("Sample orders added successfully!");
}
