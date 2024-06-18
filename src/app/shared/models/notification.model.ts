export interface Notification {
    Type: string;
    UserLink: {
        UserID: string;
        Username: string;
    };
    PostLink: string;
    ThreadLink: {
        ThreadID: string;
        ThreadName: string;
    };
    ProductLink: {
        ProductID: string;
        ProductName: string;
    };
    PurchaseLink: {
        PurchaseID: string;
    }
    NotifDate: string;
    NotifTime: string;
    Content: string;
    Status: string;
    BanLink: {
        BanID: string;
        Reason: string;
        ExpiresOn: string;
    }
}