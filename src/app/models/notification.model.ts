export interface Notification {
    Status: string;
    Type: string;
    Content: string;
    Header: string;
    NotifDate: any;
    NotifTime: any;
    UserLink: {
        UserID: string;
        Username: string;
    };
    PostLink: string;
    ThreadLink: {
        ThreadID: string;
        ThreadName: string;
    };
}