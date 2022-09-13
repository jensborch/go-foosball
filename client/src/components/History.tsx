import CircularProgress from "@mui/material/CircularProgress";
import { useTournamentHistory } from "../api/hooks";
import { StyledCard } from "./Styled";
import { Error } from "./Error";
import {
  Avatar,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Grid,
} from "@mui/material";

type HistoryProps = {
  tournament: string;
};
const History = ({ tournament }: HistoryProps) => {
  const { status, error, data } = useTournamentHistory(tournament);
  return (
    <Grid item>
      <StyledCard sx={{ minWidth: "200px", maxHeight: "100vh" }}>
        {status === "loading" && <CircularProgress />}
        {status === "error" && <Error msg={error?.message} />}
        {status === "success" && (
          <CardContent sx={{ overflow: "auto", maxHeight: "65vh" }}>
            <List dense={true}>
              {data?.map((p, i) => (
                <>
                  <ListItem disableGutters>
                    <ListItemAvatar>
                      <Badge
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        badgeContent={p.ranking}
                      >
                        <Avatar>{p.nickname}</Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText primary={p.realname} />
                  </ListItem>
                  <div>{i !== data.length - 1 ? <Divider /> : null}</div>
                </>
              ))}
            </List>
          </CardContent>
        )}
      </StyledCard>
    </Grid>
  );
};

export default History;
