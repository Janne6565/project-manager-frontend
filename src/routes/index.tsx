import { createFileRoute } from '@tanstack/react-router';
import { ProtectedRoute } from '@/components/technical/protected-route';

export const Route = createFileRoute('/')({
  component: IndexPage,
});

function IndexPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-4 p-6">
        <h1 className="text-2xl font-bold">Welcome to Project Manager</h1>
        <p className="text-muted-foreground">
          You are now logged in. Your projects will appear here.
        </p>
      </div>
    </ProtectedRoute>
  );
}
