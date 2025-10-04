export type Product = {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  additionalImages?: string[];
  description?: string;
  active?: boolean;
  featured?: boolean;
  code?: string;
  metadata?: { key: string; value: string }[];
  work?: string;
  occasion?: string;
  careInstructions?: string;
  isNew?: boolean;
  specifications?: {
    blouse: string;
    sareeLength: string;
    blouseLength: string;
    work: string;
  };
};

export const allProducts: Product[] = [
  { 
    id: 1, 
    name: "Royal Purple Silk", 
    price: 24999, 
    originalPrice: 29999, 
    image: "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5652-scaled.jpeg?fit=600%2C899&ssl=1", 
    code: "RP001",
    isNew: true,
    description: "An exquisite royal purple silk saree that embodies elegance and sophistication. Crafted with premium silk fabric and adorned with intricate golden threadwork, this saree is perfect for special occasions and celebrations.",
    work: "Golden Thread Embroidery",
    occasion: "Wedding, Festival, Special Events",
    careInstructions: "Dry clean only. Store in a cool, dry place away from direct sunlight.",
    additionalImages: [
      "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5652-scaled.jpeg?fit=600%2C899&ssl=1",
      "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5693-scaled.jpeg?fit=600%2C899&ssl=1"
    ],
    specifications: {
      blouse: "Included (Unstitched)",
      sareeLength: "5.5 meters",
      blouseLength: "0.8 meters",
      work: "Golden Thread Embroidery"
    }
  },
  { 
    id: 2, 
    name: "Golden Heritage", 
    price: 32999, 
    originalPrice: 37999, 
    image: "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5693-scaled.jpeg?fit=600%2C899&ssl=1",
    code: "GH002",
    description: "A stunning golden heritage saree that captures the essence of traditional Indian craftsmanship. Features intricate zari work and luxurious silk fabric that drapes beautifully.",
    work: "Zari Work",
    occasion: "Wedding, Reception, Traditional Events",
    careInstructions: "Dry clean only. Handle with care to preserve the zari work.",
    additionalImages: [
      "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5693-scaled.jpeg?fit=600%2C899&ssl=1"
    ],
    specifications: {
      blouse: "Included (Unstitched)",
      sareeLength: "5.5 meters",
      blouseLength: "0.8 meters",
      work: "Zari Work"
    }
  },
  { 
    id: 3, 
    name: "Emerald Dreams", 
    price: 19999, 
    originalPrice: 23999, 
    image: "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5656-scaled.jpeg?fit=600%2C899&ssl=1", 
    code: "ED003",
    isNew: true,
    description: "A mesmerizing emerald green saree that brings out your natural beauty. The rich color combined with delicate embellishments makes it perfect for any special occasion.",
    work: "Sequin and Bead Work",
    occasion: "Party, Cocktail, Evening Events",
    careInstructions: "Dry clean recommended. Store carefully to avoid snagging of embellishments.",
    additionalImages: [
      "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5656-scaled.jpeg?fit=600%2C899&ssl=1"
    ],
    specifications: {
      blouse: "Included (Unstitched)",
      sareeLength: "5.5 meters",
      blouseLength: "0.8 meters",
      work: "Sequin and Bead Work"
    }
  },
  { 
    id: 4, 
    name: "Classic Elegance", 
    price: 27999, 
    originalPrice: 31999, 
    image: "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5639-scaled.jpeg?fit=600%2C899&ssl=1",
    description: "Timeless elegance meets contemporary style in this classic saree. Perfect for the modern woman who appreciates traditional craftsmanship with a contemporary twist.",
    work: "Embroidered Border",
    occasion: "Office Party, Formal Events, Cultural Functions",
    careInstructions: "Dry clean only. Iron on low heat if needed.",
    additionalImages: [
      "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5639-scaled.jpeg?fit=600%2C899&ssl=1"
    ],
    specifications: {
      blouse: "Included (Unstitched)",
      sareeLength: "5.5 meters",
      blouseLength: "0.8 meters",
      work: "Embroidered Border"
    }
  },
  { 
    id: 5, 
    name: "Crimson Royale", 
    price: 21999, 
    originalPrice: 26999, 
    image: "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5647-scaled.jpeg?fit=600%2C899&ssl=1",
    description: "A bold and beautiful crimson saree that makes a statement. The rich red color symbolizes prosperity and joy, making it perfect for auspicious occasions.",
    work: "Traditional Print",
    occasion: "Festival, Puja, Traditional Ceremonies",
    careInstructions: "Hand wash or dry clean. Avoid direct sunlight while drying.",
    additionalImages: [
      "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5647-scaled.jpeg?fit=600%2C899&ssl=1"
    ],
    specifications: {
      blouse: "Included (Unstitched)",
      sareeLength: "5.5 meters",
      blouseLength: "0.8 meters",
      work: "Traditional Print"
    }
  },
  { 
    id: 6, 
    name: "Ivory Grace", 
    price: 30999, 
    originalPrice: 34999, 
    image: "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5661-scaled.jpeg?fit=600%2C899&ssl=1",
    description: "Pure elegance in ivory, this saree represents grace and sophistication. The subtle color palette makes it versatile for various occasions while maintaining its luxurious appeal.",
    work: "Pearl and Crystal Work",
    occasion: "Wedding, Engagement, Formal Events",
    careInstructions: "Dry clean only. Handle delicately to preserve embellishments.",
    additionalImages: [
      "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5661-scaled.jpeg?fit=600%2C899&ssl=1"
    ],
    specifications: {
      blouse: "Included (Unstitched)",
      sareeLength: "5.5 meters",
      blouseLength: "0.8 meters",
      work: "Pearl and Crystal Work"
    }
  },
  { 
    id: 7, 
    name: "Sapphire Bloom", 
    price: 28999, 
    originalPrice: 33999, 
    image: "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5681-scaled.jpeg?fit=600%2C899&ssl=1",
    description: "Like a blooming sapphire, this saree captures the beauty of nature in its design. The intricate floral patterns and rich blue color create a mesmerizing effect.",
    work: "Floral Embroidery",
    occasion: "Garden Party, Day Events, Cultural Programs",
    careInstructions: "Dry clean recommended. Store flat to maintain the organza texture.",
    additionalImages: [
      "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5681-scaled.jpeg?fit=600%2C899&ssl=1"
    ],
    specifications: {
      blouse: "Included (Unstitched)",
      sareeLength: "5.5 meters",
      blouseLength: "0.8 meters",
      work: "Floral Embroidery"
    }
  },
  { 
    id: 8, 
    name: "Opulent Bronze", 
    price: 25999, 
    originalPrice: 30999, 
    image: "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5674-scaled.jpeg?fit=600%2C899&ssl=1",
    description: "Rich bronze tones create an opulent look that's both modern and timeless. This saree is perfect for the woman who wants to make a sophisticated statement.",
    work: "Metallic Thread Work",
    occasion: "Corporate Events, Evening Functions, Art Exhibitions",
    careInstructions: "Dry clean only. Avoid contact with perfumes and deodorants.",
    additionalImages: [
      "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5674-scaled.jpeg?fit=600%2C899&ssl=1"
    ],
    specifications: {
      blouse: "Included (Unstitched)",
      sareeLength: "5.5 meters",
      blouseLength: "0.8 meters",
      work: "Metallic Thread Work"
    }
  },
];

export const formatPrice = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export const getProductById = (id: number): Product | undefined => {
  return allProducts.find(product => product.id === id);
};
