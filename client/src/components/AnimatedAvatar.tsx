import { Avatar, keyframes, SxProps, Theme } from "@mui/material";
import { useRef } from "react";
import { Transition, TransitionStatus } from "react-transition-group";
import { conf } from "../api/util";

const flip = keyframes`
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(180deg);
  }
`;

type SrcProp = { src?: string };

type AnimatedAvatarProps = {
  selected: boolean;
  setSelected: (selected: boolean) => void;
  selectedComp: React.ReactNode;
  deselectedComp: React.ReactNode;
  timeout?: number;
  avatar?: string;
};

const sx: SxProps<Theme> = {
  backgroundColor: (theme) => theme.palette.secondary.main,
};

const AnimatedAvatar = ({
  selected,
  setSelected,
  selectedComp,
  deselectedComp,
  timeout = 500,
  avatar,
}: AnimatedAvatarProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodeRef = useRef<any>(null);
  return (
    <Transition in={selected} timeout={timeout} nodeRef={nodeRef}>
      {(state: TransitionStatus) => {
        switch (state) {
          case "entering":
          case "exiting": {
            return (
              <Avatar
                ref={nodeRef}
                sx={{ ...sx, animation: `${flip} ${timeout}ms` }}
              >
                {" "}
              </Avatar>
            );
          }
          case "entered": {
            return (
              <Avatar ref={nodeRef} sx={sx} onClick={() => setSelected(false)}>
                {selectedComp}
              </Avatar>
            );
          }
          case "exited": {
            const src: SrcProp = {};
            if (avatar) {
              src.src = `${conf.baseUrl()}/avatars/${avatar}.jpg`;
            }
            return (
              <Avatar ref={nodeRef} {...src} onClick={() => setSelected(true)}>
                {deselectedComp}
              </Avatar>
            );
          }
        }
      }}
    </Transition>
  );
};

export default AnimatedAvatar;
