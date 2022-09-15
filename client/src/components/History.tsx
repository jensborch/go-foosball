import CircularProgress from "@mui/material/CircularProgress";
import { useTournamentHistory } from "../api/hooks";
import { StyledCard, StyledCardHeader } from "./Styled";
import { Error } from "./Error";
import {
  Avatar,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Grid,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

type HistoryProps = {
  tournament: string;
};
const History = ({ tournament }: HistoryProps) => {
  const { status, error, data } = useTournamentHistory(tournament);
  return (
    <Grid item>
      <StyledCard sx={{ minWidth: "200px", maxHeight: "100vh" }}>
        <StyledCardHeader
          avatar={
            <Avatar>
              <EmojiEventsIcon />
            </Avatar>
          }
          title="Winners"
        />
        {status === "loading" && <CircularProgress />}
        {status === "error" && <Error msg={error?.message} />}
        {status === "success" && (
          <CardContent sx={{ overflow: "auto", maxHeight: "65vh" }}>
            <List dense={false}>
              {data?.map((p, i) => (
                <div key={`${p.nickname}-${p.ranking}-${p.updated}`}>
                  <ListItem disableGutters>
                    <ListItemAvatar>
                      <Badge
                        max={9999}
                        color="secondary"
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        badgeContent={p.ranking}
                      >
                        <Avatar>
                          {p.nickname.substring(0, 1).toUpperCase()}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText primary={p.realname} />
                  </ListItem>
                </div>
              ))}
            </List>
          </CardContent>
        )}
      </StyledCard>
    </Grid>
  );
};

export default History;
