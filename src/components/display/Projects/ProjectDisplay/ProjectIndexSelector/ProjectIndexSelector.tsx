import { ButtonGroup } from '@/components/ui/button-group.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';

const ProjectIndexSelector = ({
  currentIndex,
  setIndex,
  maxIndex,
}: {
  currentIndex: number;
  setIndex: (newPageCallback: (prevVal: number) => number) => void;
  maxIndex: number;
}) => {
  const shownIndices = (
    currentIndex == 0
      ? [currentIndex, currentIndex + 1, currentIndex + 2]
      : currentIndex == maxIndex
        ? [currentIndex - 2, currentIndex - 1, currentIndex]
        : [currentIndex - 1, currentIndex, currentIndex + 1]
  ).filter(i => i >= 0 && i <= maxIndex);

  return (
    <ButtonGroup>
      <ButtonGroup>
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant={'outline'}
              size={'icon'}
              aria-label={'Next Project'}
              onClick={() => setIndex(p => p - 1)}
              disabled={currentIndex == 0}
            >
              <ArrowLeftIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Previous Project</TooltipContent>
        </Tooltip>
      </ButtonGroup>
      <ButtonGroup>
        {shownIndices.map(index => (
          <Button
            variant={currentIndex == index ? 'default' : 'outline'}
            size={'icon'}
            aria-label={'Go to ' + currentIndex + ' index'}
            key={'button-index-' + index}
            onClick={() => setIndex(() => index)}
          >
            {index}
          </Button>
        ))}
      </ButtonGroup>
      <ButtonGroup>
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant={'outline'}
              size={'icon'}
              aria-label={'Next Project'}
              onClick={() => setIndex(p => p + 1)}
              disabled={currentIndex == maxIndex}
            >
              <ArrowRightIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Previous Project</TooltipContent>
        </Tooltip>
      </ButtonGroup>
    </ButtonGroup>
  );
};

export default ProjectIndexSelector;
