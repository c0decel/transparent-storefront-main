export interface User {
    _id: string;
    Username: string;
    Email: string;
    hasBroom: boolean;
    isSponsor: boolean;
    JoinDate: string;
    Cart: [];
    Wishlist: [];
    Purchases: [
      {
        _id: string,
        ProductID: string,
        PurchaseDate: string,
        Name: string,
        Image: string,
        Price: number
      }
    ];
    Posts: [];
    Threads: [];
    canPost: boolean;
    Threadbans: [];
    Bio: string;
    Status: string;
  }