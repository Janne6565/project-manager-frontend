import { useTranslation } from 'react-i18next';
import type { Project } from '@/types/project';

/**
 * Hook to get the appropriate description based on current language
 */
export function useLocalizedDescription(project: Project): string {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  // Priority: localized description > fallback to old description field
  if (currentLang === 'de' && project.descriptionDe) {
    return project.descriptionDe;
  }
  
  if (currentLang === 'en' && project.descriptionEn) {
    return project.descriptionEn;
  }

  // Fallback: try other language's description
  if (project.descriptionEn) {
    return project.descriptionEn;
  }
  
  if (project.descriptionDe) {
    return project.descriptionDe;
  }

  // Last resort: old description field (backward compatibility)
  return project.description || '';
}
