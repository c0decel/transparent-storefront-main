export interface Product {
    _id: string;
    Name: string;
    Price: number;
    Description: string;
    Image: string;
    Sales: number;
    Stock: number;
    Reviews: [];
    isFeatured: boolean;
    Tags: [];
    Supplies: [];
    Upcharge: number;
  }