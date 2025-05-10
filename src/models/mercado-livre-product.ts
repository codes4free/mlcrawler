/**
 * Comprehensive data model for Mercado Livre products
 * Designed for B2B e-commerce applications
 */

/**
 * Main product interface with complete information
 */
export interface MercadoLivreProduct {
  // Basic product information
  id: string;
  title: string;
  price: number;
  original_price: number | null;
  currency_id: string;
  permalink: string;
  
  // Condition and status
  condition: 'new' | 'used';
  listing_type_id: string;
  status: string;
  
  // Dates
  date_created: string; // ISO date string
  last_updated: string; // ISO date string
  
  // Images
  thumbnail: string;
  secure_thumbnail: string;
  pictures: {
    id: string;
    url: string;
    secure_url: string;
    size: string;
    max_size: string;
    quality: string;
  }[];
  
  // Stock and sales
  available_quantity: number;
  sold_quantity: number;
  
  // Categories and classification
  category_id: string;
  domain_id: string;
  catalog_listing: boolean;
  
  // Seller information
  seller: {
    id: number;
    nickname: string;
    car_dealer: boolean;
    real_estate_agency: boolean;
    registration_date: string;
    tags: string[];
    permalink: string;
    seller_reputation: {
      level_id: string;
      power_seller_status: string | null;
      transactions: {
        canceled: number;
        completed: number;
        period: string;
        ratings: {
          negative: number;
          neutral: number;
          positive: number;
        };
        total: number;
      };
    };
  };
  
  // Location
  seller_address: {
    city: {
      id: string;
      name: string;
    };
    state: {
      id: string;
      name: string;
    };
    country: {
      id: string;
      name: string;
    };
    latitude: number;
    longitude: number;
    address_line: string;
    zip_code: string;
  };
  
  // Shipping
  shipping: {
    free_shipping: boolean;
    mode: string;
    tags: string[];
    logistic_type: string;
    store_pick_up: boolean;
    methods: {
      id: number;
      name: string;
      display_name: string;
      cost: number;
      currency_id: string;
      estimated_delivery_time: {
        date: string;
        unit: string;
        quantity: number;
      };
    }[];
    dimensions: string | null; // Format: "10x10x10,500"
    local_pick_up: boolean;
    free_methods: {
      id: number;
      rule: {
        default: boolean;
        free_mode: string;
        free_shipping_flag: boolean;
        value: number | null;
      };
    }[];
  };
  
  // Payment methods
  accepts_mercadopago: boolean;
  payment_methods: {
    id: string;
    name: string;
    payment_type_id: string;
    default: boolean;
    installments: {
      quantity: number;
      amount: number;
      rate: number;
      currency_id: string;
    }[];
  }[];
  
  // Product Attributes (specifications)
  attributes: {
    id: string;
    name: string;
    value_id: string | null;
    value_name: string | null;
    value_struct: {
      number: number;
      unit: string;
    } | null;
    attribute_group_id: string;
    attribute_group_name: string;
    source: number;
    values: {
      id: string | null;
      name: string | null;
      struct: {
        number: number;
        unit: string;
      } | null;
      source: number;
    }[];
  }[];
  
  // Variations
  variations: {
    id: number;
    price: number;
    attribute_combinations: {
      id: string;
      name: string;
      value_id: string;
      value_name: string;
    }[];
    available_quantity: number;
    sold_quantity: number;
    picture_ids: string[];
  }[];
  
  // Warranty
  warranty: string | null;
  
  // Additional information
  video_id: string | null;
  descriptions: {
    id: string;
    text: string;
    plain_text: string;
  }[];
  
  // Reviews and ratings
  reviews: {
    rating_average: number;
    total_reviews: number;
  };
  
  // Promotions and deals
  promotions: {
    id: string;
    type: string;
    discount_percentage: number;
    start_date: string;
    end_date: string;
  }[];
}

/**
 * Simplified product model for listing and recommendations
 * Contains only essential information for display in search results
 */
export interface SimplifiedProduct {
  id: string;
  title: string;
  price: number;
  original_price: number | null;
  discount_percentage: number | null;
  permalink: string;
  thumbnail: string;
  
  condition: 'new' | 'used';
  free_shipping: boolean;
  available_quantity: number;
  
  // Main product specifications
  brand: string | null;
  model: string | null;
  color: string | null;
  
  // Seller information
  seller: {
    id: number;
    nickname: string;
    reputation_level: string;
  };
  
  // Location
  location: {
    city: string;
    state: string;
  };
}

/**
 * Interface mapping for product attributes from the attributes array
 */
export interface ProductAttributes {
  brand: string | null;
  model: string | null;
  color: string | null;
  size: string | null;
  material: string | null;
  weight: {
    value: number | null;
    unit: string | null;
  };
  dimensions: {
    length: number | null;
    width: number | null;
    height: number | null;
    unit: string | null;
  };
  voltage: string | null;
  warranty_time: {
    value: number | null;
    unit: string | null;
  };
  gender: string | null;
  [key: string]: any; // For other dynamic attributes
}

/**
 * Helper function to extract attribute value by attribute ID
 */
export function extractAttribute(product: MercadoLivreProduct, attributeId: string): string | null {
  if (!product.attributes) return null;
  
  const attribute = product.attributes.find(attr => attr.id === attributeId);
  return attribute?.value_name || null;
}

/**
 * Function to convert a MercadoLivreProduct to a SimplifiedProduct
 */
export function toSimplifiedProduct(product: MercadoLivreProduct): SimplifiedProduct {
  // Calculate discount percentage if both prices are available
  let discountPercentage: number | null = null;
  if (product.original_price && product.price) {
    discountPercentage = Math.round(((product.original_price - product.price) / product.original_price) * 100);
  }
  
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    original_price: product.original_price,
    discount_percentage: discountPercentage,
    permalink: product.permalink,
    thumbnail: product.thumbnail,
    
    condition: product.condition,
    free_shipping: product.shipping?.free_shipping || false,
    available_quantity: product.available_quantity,
    
    // Extract important attributes
    brand: extractAttribute(product, 'BRAND'),
    model: extractAttribute(product, 'MODEL'),
    color: extractAttribute(product, 'COLOR'),
    
    seller: {
      id: product.seller?.id,
      nickname: product.seller?.nickname || '',
      reputation_level: product.seller?.seller_reputation?.level_id || '',
    },
    
    location: {
      city: product.seller_address?.city?.name || '',
      state: product.seller_address?.state?.name || '',
    },
  };
}

/**
 * Function to extract structured product attributes
 */
export function extractProductAttributes(product: MercadoLivreProduct): ProductAttributes {
  const attributes: ProductAttributes = {
    brand: null,
    model: null,
    color: null,
    size: null,
    material: null,
    weight: {
      value: null,
      unit: null,
    },
    dimensions: {
      length: null,
      width: null,
      height: null,
      unit: null,
    },
    voltage: null,
    warranty_time: {
      value: null,
      unit: null,
    },
    gender: null,
  };
  
  if (!product.attributes) return attributes;
  
  // Process each attribute
  product.attributes.forEach(attr => {
    switch (attr.id) {
      case 'BRAND':
        attributes.brand = attr.value_name;
        break;
      case 'MODEL':
        attributes.model = attr.value_name;
        break;
      case 'COLOR':
        attributes.color = attr.value_name;
        break;
      case 'SIZE':
        attributes.size = attr.value_name;
        break;
      case 'MATERIAL':
        attributes.material = attr.value_name;
        break;
      case 'WEIGHT':
        if (attr.value_struct) {
          attributes.weight = {
            value: attr.value_struct.number,
            unit: attr.value_struct.unit,
          };
        }
        break;
      case 'LENGTH':
        if (attr.value_struct) {
          attributes.dimensions.length = attr.value_struct.number;
          attributes.dimensions.unit = attr.value_struct.unit;
        }
        break;
      case 'WIDTH':
        if (attr.value_struct) {
          attributes.dimensions.width = attr.value_struct.number;
          attributes.dimensions.unit = attr.value_struct.unit;
        }
        break;
      case 'HEIGHT':
        if (attr.value_struct) {
          attributes.dimensions.height = attr.value_struct.number;
          attributes.dimensions.unit = attr.value_struct.unit;
        }
        break;
      case 'VOLTAGE':
        attributes.voltage = attr.value_name;
        break;
      case 'WARRANTY_TIME':
        if (attr.value_struct) {
          attributes.warranty_time = {
            value: attr.value_struct.number,
            unit: attr.value_struct.unit,
          };
        } else if (attr.value_name) {
          attributes.warranty_time = {
            value: parseInt(attr.value_name),
            unit: 'days',
          };
        }
        break;
      case 'GENDER':
        attributes.gender = attr.value_name;
        break;
      default:
        // Store other attributes dynamically
        if (attr.value_name) {
          attributes[attr.id.toLowerCase()] = attr.value_name;
        }
    }
  });
  
  return attributes;
}

/**
 * Sample usage of the model:
 * 
 * // Fetch product from API
 * const productData = await fetchProductById('MLB1234567');
 * 
 * // Use the full model for detailed product view
 * const fullProduct: MercadoLivreProduct = productData;
 * 
 * // Create a simplified version for listings
 * const simplifiedProduct = toSimplifiedProduct(fullProduct);
 * 
 * // Extract structured attributes
 * const productSpecs = extractProductAttributes(fullProduct);
 * 
 * // Display brand and model
 * console.log(`${productSpecs.brand} ${productSpecs.model}`);
 */ 