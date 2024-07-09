export interface Product {
    _id: string;
    Name: string;
    Price: number;
    Description: string;
    ProductImages: [];
    Sales: number;
    Stock: number;
    Reviews: [];
    isFeatured: boolean;
    Tags: [];
    Supplies: [];
    Upcharge: number;
  }