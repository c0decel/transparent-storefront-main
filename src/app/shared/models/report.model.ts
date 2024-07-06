export interface Report {
    _id: string;
    UserID: {
        Username: string;
        _id: string;
    };
    PostID: {
        Content: string;
        _id: string;
    };
    ThreadID: {
        Title: string;
        _id: string;
    };
    ModID: {
        Username: string;
        _id: string;
    }
    ReportedAtDate: string;
    ReportedAtTime: string;
    ReportStatus: string;
    ModResponse: string;
    ReportReason: string;
}