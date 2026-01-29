import Logo from '@/components/display/FloatingHeader/Logo/Logo.tsx';
import HeaderButtonGroup from '@/components/display/FloatingHeader/HeaderButtonGroup/HeaderButtonGroup.tsx';

const FloatingHeader = () => {
  return (
    <div className={'top-0 w-full pl-5 pr-6 py-3 justify-between flex align-middle items-center'}>
      <Logo />
      <HeaderButtonGroup />
    </div>
  );
};

export default FloatingHeader;
