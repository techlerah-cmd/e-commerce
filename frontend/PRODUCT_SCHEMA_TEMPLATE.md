# Product Schema Template for LèRah

This template shows how to add structured data (Schema.org) to your product pages for better SEO and rich search results.

---

## 📦 Product Schema (JSON-LD)

Add this script to the `<head>` section of each product page. Replace the placeholder values with actual product data.

### Basic Product Schema

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "Beige & Blush Handcrafted Silk Saree",
    "description": "Exquisite handcrafted silk saree in beige and blush tones. Featuring intricate traditional weaving by master artisans. Perfect for weddings and special occasions.",
    "image": [
      "https://www.lerah.com/images/products/saree-001-main.jpg",
      "https://www.lerah.com/images/products/saree-001-detail.jpg",
      "https://www.lerah.com/images/products/saree-001-drape.jpg"
    ],
    "brand": {
      "@type": "Brand",
      "name": "LèRah Royal Elegance"
    },
    "sku": "LERAH-SAREE-001",
    "mpn": "SAREE-001",
    "offers": {
      "@type": "Offer",
      "url": "https://www.lerah.com/product/beige-blush-silk-saree",
      "priceCurrency": "INR",
      "price": "15000",
      "priceValidUntil": "2025-12-31",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "LèRah Royal Elegance"
      }
    }
  }
</script>
```

---

## 🌟 Product Schema with Reviews

If you have customer reviews, use this enhanced version:

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "Beige & Blush Handcrafted Silk Saree",
    "description": "Exquisite handcrafted silk saree in beige and blush tones. Featuring intricate traditional weaving by master artisans. Perfect for weddings and special occasions.",
    "image": [
      "https://www.lerah.com/images/products/saree-001-main.jpg",
      "https://www.lerah.com/images/products/saree-001-detail.jpg",
      "https://www.lerah.com/images/products/saree-001-drape.jpg"
    ],
    "brand": {
      "@type": "Brand",
      "name": "LèRah Royal Elegance"
    },
    "sku": "LERAH-SAREE-001",
    "mpn": "SAREE-001",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "24",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Priya Sharma"
        },
        "datePublished": "2025-01-10",
        "reviewBody": "Absolutely stunning saree! The quality is exceptional and the colors are even more beautiful in person. Received so many compliments at my sister's wedding.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Anjali Mehta"
        },
        "datePublished": "2025-01-05",
        "reviewBody": "Beautiful craftsmanship. The silk is soft and drapes perfectly. Worth every rupee!",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5",
          "worstRating": "1"
        }
      }
    ],
    "offers": {
      "@type": "Offer",
      "url": "https://www.lerah.com/product/beige-blush-silk-saree",
      "priceCurrency": "INR",
      "price": "15000",
      "priceValidUntil": "2025-12-31",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "INR"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "IN"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 2,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 3,
            "maxValue": 7,
            "unitCode": "DAY"
          }
        }
      },
      "seller": {
        "@type": "Organization",
        "name": "LèRah Royal Elegance"
      }
    }
  }
</script>
```

---

## 🎨 Product Schema with Additional Details

For premium products with more details:

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "Royal Heritage Banarasi Silk Saree",
    "description": "Luxurious Banarasi silk saree handwoven by master artisans in Varanasi. Features intricate gold zari work and traditional motifs. A timeless piece for weddings and grand celebrations.",
    "image": [
      "https://www.lerah.com/images/products/saree-premium-001-main.jpg",
      "https://www.lerah.com/images/products/saree-premium-001-detail.jpg",
      "https://www.lerah.com/images/products/saree-premium-001-drape.jpg",
      "https://www.lerah.com/images/products/saree-premium-001-border.jpg"
    ],
    "brand": {
      "@type": "Brand",
      "name": "LèRah Royal Elegance"
    },
    "sku": "LERAH-PREMIUM-001",
    "mpn": "PREMIUM-001",
    "gtin": "1234567890123",
    "category": "Apparel & Accessories > Clothing > Traditional & Ceremonial Clothing > Sarees",
    "color": "Royal Blue with Gold",
    "material": "Pure Banarasi Silk",
    "pattern": "Traditional Zari Work",
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Fabric",
        "value": "Pure Banarasi Silk"
      },
      {
        "@type": "PropertyValue",
        "name": "Work Type",
        "value": "Handwoven Zari"
      },
      {
        "@type": "PropertyValue",
        "name": "Length",
        "value": "6.5 meters"
      },
      {
        "@type": "PropertyValue",
        "name": "Blouse Piece",
        "value": "Included (0.8 meters)"
      },
      {
        "@type": "PropertyValue",
        "name": "Occasion",
        "value": "Wedding, Festival, Celebration"
      },
      {
        "@type": "PropertyValue",
        "name": "Care Instructions",
        "value": "Dry Clean Only"
      },
      {
        "@type": "PropertyValue",
        "name": "Origin",
        "value": "Varanasi, India"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "47",
      "bestRating": "5",
      "worstRating": "1"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://www.lerah.com/product/royal-heritage-banarasi-silk-saree",
      "priceCurrency": "INR",
      "price": "85000",
      "priceValidUntil": "2025-12-31",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "INR"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "IN"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 2,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 3,
            "maxValue": 7,
            "unitCode": "DAY"
          }
        }
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 7,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn"
      },
      "seller": {
        "@type": "Organization",
        "name": "LèRah Royal Elegance"
      }
    }
  }
</script>
```

---

## 📋 Field Descriptions

### Required Fields

- **@context**: Always `"https://schema.org/"`
- **@type**: Always `"Product"`
- **name**: Product name (keep under 70 characters)
- **image**: Array of product images (at least 1, recommended 3-5)
- **description**: Detailed product description (150-300 words)
- **offers**: Pricing and availability information

### Recommended Fields

- **brand**: Your brand name
- **sku**: Stock Keeping Unit (internal product ID)
- **aggregateRating**: Overall rating (if you have reviews)
- **review**: Individual customer reviews

### Optional but Beneficial

- **mpn**: Manufacturer Part Number
- **gtin**: Global Trade Item Number (barcode)
- **category**: Product category
- **color**: Product color
- **material**: Fabric/material type
- **additionalProperty**: Custom properties (fabric, length, etc.)

---

## 🎯 Availability Values

Use these standard values for `availability`:

```javascript
"https://schema.org/InStock"; // Product is available
"https://schema.org/OutOfStock"; // Product is sold out
"https://schema.org/PreOrder"; // Product available for pre-order
"https://schema.org/Discontinued"; // Product no longer available
"https://schema.org/LimitedAvailability"; // Limited stock
```

---

## 💰 Price Guidelines

### Price Format

- Use numbers only (no currency symbols)
- Use decimal point for paise (e.g., "15000.00")
- Always include `priceCurrency` as "INR"

### Price Valid Until

- Set a future date (e.g., end of year)
- Update regularly to avoid "price expired" warnings

### Example:

```json
"offers": {
  "@type": "Offer",
  "price": "15000",
  "priceCurrency": "INR",
  "priceValidUntil": "2025-12-31"
}
```

---

## ⭐ Review Guidelines

### Aggregate Rating

- **ratingValue**: Average rating (e.g., "4.8")
- **reviewCount**: Total number of reviews
- **bestRating**: Maximum rating (usually "5")
- **worstRating**: Minimum rating (usually "1")

### Individual Reviews

- Include 2-5 most helpful reviews
- Use real customer names (with permission)
- Include review date
- Include rating value

### Example:

```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.8",
  "reviewCount": "24",
  "bestRating": "5",
  "worstRating": "1"
}
```

---

## 🖼️ Image Guidelines

### Image Requirements

- **Format**: JPG, PNG, or WebP
- **Size**: At least 800x800 pixels (recommended: 1200x1200)
- **Aspect Ratio**: 1:1 (square) or 4:3
- **File Size**: Under 500KB (optimized)

### Image Types

1. **Main Image**: Full saree view
2. **Detail Image**: Close-up of fabric/work
3. **Drape Image**: Model wearing the saree
4. **Border Image**: Close-up of border design

### Example:

```json
"image": [
  "https://www.lerah.com/images/products/saree-001-main.jpg",
  "https://www.lerah.com/images/products/saree-001-detail.jpg",
  "https://www.lerah.com/images/products/saree-001-drape.jpg"
]
```

---

## 🧪 Testing Your Schema

### 1. Rich Results Test

1. Go to [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Enter your product page URL
3. Check for errors and warnings
4. Fix any issues found

### 2. Schema Markup Validator

1. Go to [Schema.org Validator](https://validator.schema.org/)
2. Paste your JSON-LD code
3. Verify it's valid Schema.org markup

### 3. Google Search Console

1. After deployment, check "Enhancements" section
2. Look for "Products" report
3. Monitor for errors and warnings

---

## 📱 React/TypeScript Implementation

### Example Component

```typescript
// ProductSchema.tsx
interface ProductSchemaProps {
  name: string;
  description: string;
  images: string[];
  price: number;
  sku: string;
  availability: "InStock" | "OutOfStock" | "PreOrder";
  rating?: {
    value: number;
    count: number;
  };
}

export const ProductSchema: React.FC<ProductSchemaProps> = ({
  name,
  description,
  images,
  price,
  sku,
  availability,
  rating,
}) => {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name,
    description,
    image: images,
    brand: {
      "@type": "Brand",
      name: "LèRah Royal Elegance",
    },
    sku,
    ...(rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating.value.toString(),
        reviewCount: rating.count.toString(),
        bestRating: "5",
        worstRating: "1",
      },
    }),
    offers: {
      "@type": "Offer",
      url: window.location.href,
      priceCurrency: "INR",
      price: price.toString(),
      priceValidUntil: "2025-12-31",
      availability: `https://schema.org/${availability}`,
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "LèRah Royal Elegance",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

// Usage in ProductDetail.tsx
<ProductSchema
  name="Beige & Blush Handcrafted Silk Saree"
  description="Exquisite handcrafted silk saree..."
  images={[
    "https://www.lerah.com/images/products/saree-001-main.jpg",
    "https://www.lerah.com/images/products/saree-001-detail.jpg",
  ]}
  price={15000}
  sku="LERAH-SAREE-001"
  availability="InStock"
  rating={{ value: 4.8, count: 24 }}
/>;
```

---

## 🎨 Breadcrumb Schema (For Product Pages)

Add this along with product schema:

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.lerah.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Collections",
        "item": "https://www.lerah.com/collections"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Silk Sarees",
        "item": "https://www.lerah.com/collections/silk-sarees"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Beige & Blush Silk Saree",
        "item": "https://www.lerah.com/product/beige-blush-silk-saree"
      }
    ]
  }
</script>
```

---

## ✅ Checklist for Each Product

- [ ] Product name is descriptive and under 70 characters
- [ ] Description is detailed (150-300 words)
- [ ] At least 3 high-quality images included
- [ ] Price is accurate and up-to-date
- [ ] SKU is unique for each product
- [ ] Availability status is correct
- [ ] Brand name is "LèRah Royal Elegance"
- [ ] Schema tested with Rich Results Test
- [ ] No errors in Schema Validator
- [ ] Images are optimized (under 500KB each)
- [ ] Alt text added to all images

---

## 🚀 Expected Benefits

### Rich Search Results

- ⭐ Star ratings in search results
- 💰 Price display
- ✅ Availability status
- 🖼️ Product images in results

### Better Rankings

- Improved relevance for product searches
- Better click-through rates
- Enhanced user experience
- Increased trust signals

### Shopping Features

- Eligible for Google Shopping
- Product carousel in search
- Image search optimization
- Voice search compatibility

---

## 📞 Support Resources

- [Google Product Schema Guide](https://developers.google.com/search/docs/appearance/structured-data/product)
- [Schema.org Product Documentation](https://schema.org/Product)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)

---

**Last Updated**: January 2025  
**Version**: 1.0  
**For**: LèRah Royal Elegance Product Pages
