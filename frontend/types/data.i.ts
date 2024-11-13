interface ProposalData {
  id: number;
  author: {
    id: number,
    email: string,
    profile: {
      first_name: string,
      last_name: string,
    }
  };
  tags: {
    id: number;
    name: string;
    category: number;
  }[];
  created_at: string;
  proposal_file: string;
  video_file?: string;
  proposal_imgs_files: string[];
}

interface UserData {
  id: number;
  email: string;
  profile?: {
    first_name: string;
    last_name: string;
    address: string;
    zip_code: string;
    user_goal_type: number;
  };
}

interface MatchData {
  id: number;
  proposal: ProposalData;
  user: UserData;
  status: number;
}