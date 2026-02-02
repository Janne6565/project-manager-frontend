import ColorSchemeToggleButton from "@/components/display/FloatingHeader/HeaderButtonGroup/ColorSchemeToggleButton/ColorSchemeToggleButton.tsx";
import LanguageSelectorButton from "@/components/display/FloatingHeader/HeaderButtonGroup/LanguageSelectorButton/LanguageSelectorButton.tsx";

const HeaderButtonGroup = () => {
  return (
    <div className="flex gap-4">
      <LanguageSelectorButton />
      <ColorSchemeToggleButton />
    </div>
  );
};

export default HeaderButtonGroup;
