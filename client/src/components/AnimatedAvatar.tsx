import { Avatar, keyframes } from '@mui/material';
import { useRef } from 'react';
import { Transition, TransitionStatus } from 'react-transition-group';

const flip = keyframes`
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(180deg);
  }
`;

type AnimatedAvatarProps = {
  selected: boolean;
  setSelected: (selected: boolean) => void;
  selectedComp: React.ReactNode;
  deselectedComp: React.ReactNode;
  timeout?: number;
};

const AnimatedAvatar = ({
  selected,
  setSelected,
  selectedComp,
  deselectedComp,
  timeout = 500,
}: AnimatedAvatarProps) => {
  const nodeRef = useRef<any>();
  return (
    <Transition in={selected} timeout={timeout} nodeRef={nodeRef}>
      {(state: TransitionStatus) => {
        switch (state) {
          case 'entering':
          case 'exiting':
            return (
              <Avatar ref={nodeRef} sx={{ animation: `${flip} ${timeout}ms` }}>
                {' '}
              </Avatar>
            );
          case 'entered':
            return (
              <Avatar ref={nodeRef} onClick={() => setSelected(false)}>
                {selectedComp}
              </Avatar>
            );
          case 'exited':
            return (
              <Avatar ref={nodeRef} onClick={() => setSelected(true)}>
                {deselectedComp}
              </Avatar>
            );
        }
      }}
    </Transition>
  );
};

export default AnimatedAvatar;