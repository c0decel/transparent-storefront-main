export interface Post {
    _id: string;
    Thread: string;
    User: {
      Username: string;
      ProfileImage: string;
      _id: string;
    };
    ProfileImage: string;
    Username: string;
    Content: string;
    ReplyNumber: number;
    PostedAtDate: string;
    PostedAtTime: string;
    Highlighted: boolean;
    Reactions: {
      Username: string;
      Type: string;
    }[];
    ReactionScore: number;
    PostBan: boolean;
    ReplyingTo: {
      UserID: string;
      Username: string;
    }
    MostRecentReactions: {
      Username: string;
      Type: string;
      Icon: string;
    }[];
  }