import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useAuth from "@/hooks/use-auth";
import type { OAuthError } from "@/types/auth";

interface LoginFormProps extends React.ComponentProps<"div"> {
  readonly oauthError?: OAuthError;
}

export function LoginForm({ className, oauthError, ...props }: LoginFormProps) {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAuthentikLogin = () => {
    // Full browser navigation (never fetch): the backend 302s to Authentik.
    globalThis.location.href = `${API_BASE_URL}/auth/oauth/authentik/authorize`;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setLocalError(null);
    setIsSubmitting(true);

    try {
      await login({ username, password });
      navigate({ to: "/" });
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : t("auth.login.errorDefault"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{t("auth.login.title")}</CardTitle>
          <CardDescription>{t("auth.login.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {oauthError && (
            <div
              role="alert"
              data-testid="login-oauth-error"
              className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {oauthError === "noAccess"
                ? t("auth.login.oauthErrorNoAccess")
                : t("auth.login.oauthErrorDefault")}
            </div>
          )}
          <form onSubmit={handleSubmit} noValidate>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">
                  {t("auth.login.username")}
                </FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder={t("auth.login.usernamePlaceholder")}
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isSubmitting}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">
                  {t("auth.login.password")}
                </FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("auth.login.passwordPlaceholder")}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </Field>
              {localError && (
                <Field>
                  <FieldError>{localError}</FieldError>
                </Field>
              )}
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? t("auth.login.loggingIn")
                    : t("auth.login.loginButton")}
                </Button>
              </Field>
              <div className="flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-muted-foreground text-xs uppercase">
                  {t("auth.login.orDivider")}
                </span>
                <Separator className="flex-1" />
              </div>
              <Field>
                <Button
                  type="button"
                  variant="outline"
                  data-testid="login-authentik-button"
                  onClick={handleAuthentikLogin}
                  disabled={isSubmitting}
                >
                  <KeyRound aria-hidden />
                  {t("auth.login.authentikButton")}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
