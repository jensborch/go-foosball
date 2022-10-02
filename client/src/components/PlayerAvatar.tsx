import { Avatar } from "@mui/material";
import { conf } from "../api/util";

type PlayerAvatarProps = {
  nickname: string;
};
const PlayerAvatar = ({ nickname }: PlayerAvatarProps) => {
  return (
    <Avatar
      sx={{
        backgroundColor: (theme) => theme.palette.primary.light,
      }}
      src={`${conf.baseUrl()}/avatars/${nickname}.jpg`}
    >
      {nickname.substring(0, 1).toUpperCase()}
    </Avatar>
  );
};

export default PlayerAvatar;
