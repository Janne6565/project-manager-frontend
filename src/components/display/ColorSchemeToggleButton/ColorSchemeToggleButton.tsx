import { Button } from "@/components/ui/button.tsx";
import { SunMoon } from "lucide-react";
import { useTheme } from "@/components/technical/theme-provider.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { useTranslation } from "react-i18next";

const ColorSchemeToggleButton = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const onClick = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={"outline"}
          className={"aspect-square w-auto h-auto rounded-xl"}
          onClick={onClick}
        >
          <SunMoon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{t("tooltips.colorScheme.toggle")}</TooltipContent>
    </Tooltip>
  );
};

export default ColorSchemeToggleButton;
