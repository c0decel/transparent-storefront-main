export interface Ban {
    BannedBy: string;
    BannedFrom: string;
    Reason: string;
    IssuedOn: Date;
    ExpiresOn: Date;
    BannedUser: string;
    BannedUserName: string;
    BannedForPost: string;
    PostBan: boolean;
  }