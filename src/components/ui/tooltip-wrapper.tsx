import type { ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';

const TooltipWrapper = (props: { children?: ReactNode; tooltip: string; asChild?: boolean }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild={props.asChild}>{props.children}</TooltipTrigger>
      <TooltipContent>{props.tooltip}</TooltipContent>
    </Tooltip>
  );
};

export default TooltipWrapper;
