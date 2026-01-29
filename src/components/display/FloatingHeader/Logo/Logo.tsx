import { useTheme } from '@/components/technical/theme-provider.tsx';
import TooltipWrapper from '@/components/ui/tooltip-wrapper.tsx';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { Button } from '@/components/ui/button.tsx';

const Logo = () => {
  const { theme } = useTheme();
  const color = theme === 'light' ? 'gray-900' : 'gray-100';
  const openGithub = () => window.open('https://github.com/janne6565');

  return (
    <>
      <TooltipWrapper tooltip={'GitHub: janne6565'}>
        <Button variant={'outline'} className={'w-auto h-auto py-2 gap-3'} onClick={openGithub}>
          <SiGithub color={`var(--color-${color})`} className={'transition-colors'} />
          <p>janne6565</p>
        </Button>
      </TooltipWrapper>
      <p className={'text-gray-100'}></p>
      <p className={'text-gray-900'}></p>
    </>
  );
};

export default Logo;
