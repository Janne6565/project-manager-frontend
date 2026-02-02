import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { fetchAllProjects } from '@/store/slices/projectsSlice';
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
      // Fetch all projects (admin) and contributions when user is logged in
      dispatch(fetchAllProjects());
      dispatch(fetchUnassignedContributions());
    }
  }, [user, dispatch]);

  return null;
}
