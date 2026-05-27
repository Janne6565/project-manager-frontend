import { useState, useEffect, useCallback } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { ProtectedRoute } from '@/components/technical/protected-route';
import { listApiKeys, generateApiKey, revokeApiKey } from '@/lib/api';
import type { ApiKey, GeneratedApiKey } from '@/types/apiKey';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Key, Plus, Copy, Check, Trash2 } from 'lucide-react';

export const Route = createFileRoute('/api-keys')({
  component: ApiKeysPage,
});

function ApiKeysPage() {
  const { t } = useTranslation();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [generateOpen, setGenerateOpen] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [generatedKey, setGeneratedKey] = useState<GeneratedApiKey | null>(null);
  const [copied, setCopied] = useState(false);

  const [revokeTarget, setRevokeTarget] = useState<ApiKey | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  const loadKeys = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listApiKeys();
      setKeys(data);
    } catch {
      setError(t('apiKeys.error'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { loadKeys(); }, [loadKeys]);

  const handleGenerate = async () => {
    if (!keyName.trim()) return;
    setIsGenerating(true);
    try {
      const result = await generateApiKey(keyName.trim());
      setGeneratedKey(result);
      setGenerateOpen(false);
      setKeyName('');
      await loadKeys();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedKey) return;
    await navigator.clipboard.writeText(generatedKey.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    setIsRevoking(true);
    try {
      await revokeApiKey(revokeTarget.id);
      setRevokeTarget(null);
      await loadKeys();
    } finally {
      setIsRevoking(false);
    }
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return t('apiKeys.table.never');
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('apiKeys.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('apiKeys.description')}</p>
          </div>
          <Button onClick={() => setGenerateOpen(true)}>
            <Plus className="size-4" />
            {t('apiKeys.generate')}
          </Button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">{t('apiKeys.loading')}</div>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 py-8 text-center text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && keys.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-12">
            <Key className="size-8 text-muted-foreground" />
            <div className="font-medium text-muted-foreground">{t('apiKeys.empty.title')}</div>
            <div className="text-sm text-muted-foreground">{t('apiKeys.empty.description')}</div>
            <Button variant="outline" onClick={() => setGenerateOpen(true)}>
              <Plus className="size-4" />
              {t('apiKeys.generate')}
            </Button>
          </div>
        )}

        {!loading && !error && keys.length > 0 && (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('apiKeys.table.name')}</TableHead>
                  <TableHead>{t('apiKeys.table.prefix')}</TableHead>
                  <TableHead>{t('apiKeys.table.created')}</TableHead>
                  <TableHead>{t('apiKeys.table.lastUsed')}</TableHead>
                  <TableHead>{t('apiKeys.table.status')}</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                        {key.prefix}…
                      </code>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(key.createdAt)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(key.lastUsedAt)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={key.active ? 'default' : 'secondary'}>
                        {key.active ? t('apiKeys.table.active') : t('apiKeys.table.revoked')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {key.active && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setRevokeTarget(key)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Generate dialog */}
      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('apiKeys.generateTitle')}</DialogTitle>
            <DialogDescription>{t('apiKeys.generateDescription')}</DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel>{t('apiKeys.nameLabel')}</FieldLabel>
            <Input
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder={t('apiKeys.namePlaceholder')}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              autoFocus
            />
          </Field>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGenerateOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleGenerate} disabled={!keyName.trim() || isGenerating}>
              {isGenerating ? t('apiKeys.generating') : t('apiKeys.generate')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Show generated key dialog */}
      <Dialog open={!!generatedKey} onOpenChange={() => setGeneratedKey(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('apiKeys.generatedTitle')}</DialogTitle>
            <DialogDescription>{t('apiKeys.generatedDescription')}</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 rounded-lg border bg-muted p-3">
            <code className="flex-1 break-all text-sm font-mono">{generatedKey?.key}</code>
            <Button size="icon" variant="ghost" className="shrink-0" onClick={handleCopy}>
              {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setGeneratedKey(null)}>{t('apiKeys.dismiss')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke confirmation */}
      <AlertDialog open={!!revokeTarget} onOpenChange={(open) => !open && setRevokeTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('apiKeys.revokeConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('apiKeys.revokeConfirmDescription', { name: revokeTarget?.name ?? '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleRevoke} disabled={isRevoking}>
              {isRevoking ? t('apiKeys.revoking') : t('apiKeys.revoke')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ProtectedRoute>
  );
}
