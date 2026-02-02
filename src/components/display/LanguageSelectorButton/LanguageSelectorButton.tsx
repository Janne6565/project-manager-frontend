import { Button } from "@/components/ui/button.tsx";
import { Globe } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import type { TranslationKey } from "@/types/i18next.d.ts";

const LanguageSelectorButton = () => {
  const { t, i18n } = useTranslation();

  const supportedLanguages = (i18n.options.supportedLngs || []).filter(
    (lng) => lng !== "cimode",
  );

  return (
    <DropdownMenu>
      <Tooltip>
        <DropdownMenuTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              variant={"outline"}
              className={"w-auto grow h-auto rounded-xl justify-start gap-3"}
            >
              <Globe /> {t(("languages." + i18n.language) as TranslationKey)}
            </Button>
          </TooltipTrigger>
        </DropdownMenuTrigger>
        <TooltipContent>{t("tooltips.languageSelector")}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("languages.title")}</DropdownMenuLabel>
          {supportedLanguages.map((language) => (
            <DropdownMenuItem
              key={language}
              onClick={() => i18n.changeLanguage(language)}
            >
              {t(("languages." + language) as TranslationKey)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelectorButton;
