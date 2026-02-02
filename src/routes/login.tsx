import { createFileRoute, Navigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { LoginForm } from '@/components/display/LoginForm/LoginForm';
import useAuth from '@/hooks/use-auth';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const { t } = useTranslation();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div>{t("auth.loading")}</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
