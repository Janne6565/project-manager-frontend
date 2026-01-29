import {Button} from "@/components/ui/button.tsx";
import {SunMoon} from "lucide-react";
import {useTheme} from "@/components/technical/theme-provider.tsx";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {useTranslation} from "react-i18next";

const ColorSchemeToggleButton = () => {
    const {theme, setTheme} = useTheme();
    const {t} = useTranslation("common");
    const onClick = () => {
        setTheme(theme === "light" ? "dark" : "light")
    }

    return <Tooltip>
        <TooltipTrigger asChild>
            <Button variant={"outline"} className={"aspect-square w-auto h-auto"} onClick={onClick}>
                <SunMoon/>
            </Button>
        </TooltipTrigger>
        <TooltipContent>
            {t("")}
            Toggle Theme
        </TooltipContent>
    </Tooltip>
}

export default ColorSchemeToggleButton;