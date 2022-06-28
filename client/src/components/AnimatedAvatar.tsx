import { Avatar, keyframes } from '@mui/material';
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
  timeout = 500
}: AnimatedAvatarProps) => {
  return (
    <Transition in={selected} timeout={timeout}>
      {(state: TransitionStatus) => {
        switch (state) {
          case 'entering':
            return <Avatar sx={{ animation: `${flip} ${timeout}ms` }}> </Avatar>;
          case 'entered':
            return (
              <Avatar onClick={() => setSelected(false)}>{selectedComp}</Avatar>
            );
          case 'exiting':
            return <Avatar sx={{ animation: `${flip} ${timeout}ms` }}> </Avatar>;
          case 'exited':
            return (
              <Avatar onClick={() => setSelected(true)}>
                {deselectedComp}
              </Avatar>
            );
        }
      }}
    </Transition>
  );
};

export default AnimatedAvatar;
