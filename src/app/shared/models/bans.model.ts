
export interface Ban {
    BanID: string;
    BannedBy: {
        Username: string;
        _id: string;
      };
    BannedFrom: {
        Title: string;
        _id: string;
      };
    BannedForPost: {
        Content: string;
        _id: string;
      };
    Reason: string;
    IssuedOn: Date;
    ExpiresOn: Date;
    IsActive: boolean;
    BannedUser: {
        Username: string;
        _id: string;
      };
    PostBan: boolean;
    formattedExpiresOn: string;
}