import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { fetchProjects } from '@/store/slices/projectsSlice';
import { fetchUnassignedContributions } from '@/store/slices/contributionsSlice';
import useAuth from '@/hooks/use-auth';

/**
 * Component that fetches data when user is authenticated
 */
export function DataFetcher() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Fetch both projects and contributions when user is logged in
      dispatch(fetchProjects());
      dispatch(fetchUnassignedContributions());
    }
  }, [user, dispatch]);

  return null;
}
