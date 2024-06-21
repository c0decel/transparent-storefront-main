export interface User {
    _id: string;
    Username: string;
    ProfileImage: string;
    Email: string;
    Birthday: string;
    JoinDate: string;
    JoinTime: string;
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
    Reviews: [];
    Posts: string[];
    ProfileComments: [];
    PostCount: number;
    Threads: [];
    ThreadCount: number;
    hasBroom: boolean;
    isSponsor: boolean;
    canPost: boolean;
    Threadbans: [];
    Status: string;
    Bio: string;
    Notifications: [];
    SavedPosts: [];
  }