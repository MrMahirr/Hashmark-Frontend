import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import { getUserProfile } from "../api/user.api";
import type { UserProfileResponse } from "../api/user.types";

export function useUserProfile() {
  return useQuery<UserProfileResponse, Error>({
    queryKey: queryKeys.user.me,
    queryFn: getUserProfile,
  });
}
