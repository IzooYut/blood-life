import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

export function UserInfo({ user, showEmail = false }: { user: User; showEmail?: boolean }) {
  const getInitials = useInitials();

  return (
    <>
      <Avatar className="h-8 w-8 overflow-hidden rounded-full border border-white/10 bg-white/10">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white font-semibold text-xs">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium text-white">{user.name}</span>
        {showEmail && <span className="text-white/60 truncate text-xs">{user.email}</span>}
      </div>
    </>
  );
}
