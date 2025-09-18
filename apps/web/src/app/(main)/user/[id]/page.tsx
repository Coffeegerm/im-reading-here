import { UserProfileContent } from "./user-profile-content";

interface UserPageProps {
  params: {
    id: string;
  };
}

export default function UserPage({ params }: UserPageProps) {
  const { id } = params;

  return <UserProfileContent userId={id} />;
}
