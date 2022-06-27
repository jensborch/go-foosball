import { Avatar, keyframes } from '@mui/material';
import { Transition, TransitionStatus } from 'react-transition-group';

const transitions = (state: TransitionStatus) => {
  switch (state) {
    case 'entering':
      return 'rotateY(0deg)';
    case 'entered':
      return 'rotateY(180deg)';
    case 'exiting':
      return 'rotateY(180deg)';
    case 'exited':
      return 'rotateY(0deg)';
  }
};

const flip = keyframes`
  0% {
    transform: rotateY(180deg);
  }
  100% {
    transform: rotateY(0deg);
  }
`;

type AnimatedAvatarProps = {
  selected: boolean;
  setSelected: (selected: boolean) => void;
  selectedComp: React.ReactNode;
  deselectedComp: React.ReactNode;
};

const AnimatedAvatar = ({
  selected,
  setSelected,
  selectedComp,
  deselectedComp,
}: AnimatedAvatarProps) => {
  return (
    <Transition in={selected} timeout={300}>
      {(state: TransitionStatus) => {
        switch (state) {
          case 'entering':
            return <Avatar></Avatar>;
          case 'entered':
            return (
              <Avatar onClick={() => setSelected(false)}>{selectedComp}</Avatar>
            );
          case 'exiting':
            return <Avatar></Avatar>;
          case 'exited':
            return <Avatar onClick={() => setSelected(true)}>{deselectedComp}</Avatar>;
        }
      }}
    </Transition>
  );
};

export default AnimatedAvatar;