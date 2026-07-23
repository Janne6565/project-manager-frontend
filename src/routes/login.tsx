import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LoginForm } from "@/components/display/LoginForm/LoginForm";
import useAuth from "@/hooks/use-auth";
import type { OAuthError } from "@/types/auth";

interface LoginSearch {
  oauthError?: OAuthError;
}

// Hand-rolled validator (zod is not a dependency): the OAuth callback redirects
// to /login?oauthError=noAccess or /login?oauthError=true on failure.
function validateSearch(search: Record<string, unknown>): LoginSearch {
  const raw = search.oauthError;
  if (raw === "noAccess") return { oauthError: "noAccess" };
  if (raw === true || raw === "true") return { oauthError: true };
  if (raw === false || raw === "false") return { oauthError: false };
  return {};
}

export const Route = createFileRoute("/login")({
  validateSearch,
  component: LoginPage,
});

function LoginPage() {
  const { t } = useTranslation();
  const { user, isLoading } = useAuth();
  const { oauthError } = Route.useSearch();

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
        <LoginForm oauthError={oauthError} />
      </div>
    </div>
  );
}
