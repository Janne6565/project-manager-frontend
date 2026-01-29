import {Badge} from "@/components/ui/badge.tsx";
import {Presentation} from "lucide-react";
import {useTheme} from "@/components/technical/theme-provider.tsx";

const Logo = () => {
    const {theme} = useTheme();
    const color = theme === "light" ? "gray-900" : "gray-100";
    return <>
        <Badge variant={"outline"} className={`scale-125 select-none text-${color} p-3 gap-2`}>
            <Presentation color={`var(--color-${color})`} className={"transition-all"}/> <p>
            Janne Keipert
        </p>
        </Badge>
        <p className={"text-gray-100"}></p>
    </>
}

export default Logo