export interface Ban {
    BanID: string;
    BannedBy: string;
    BannedFrom: string;
    BannedForPost: string;
    Reason: string;
    IssuedOn: Date;
    ExpiresOn: Date;
    IsActive: boolean;
    BannedUser: string;
    PostBan: boolean;
  }