import { RefObject, useEffect } from 'react';

export interface RefWrapeprProps {
  selectedRef: RefObject<HTMLDivElement> | undefined;
  children: React.ReactNode;
}

const ScrollIntoViewWrapper = ({ selectedRef, children }: RefWrapeprProps) => {
  useEffect(() => {
    if (selectedRef) {
      selectedRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedRef?.current]);
  return <div ref={selectedRef}>{children}</div>;
};

export default ScrollIntoViewWrapper;
