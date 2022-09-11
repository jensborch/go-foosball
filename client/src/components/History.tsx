import CircularProgress from "@mui/material/CircularProgress";
import { useTournamentHistory } from "../api/hooks";
import { StyledCard } from "./Styled";
import { Error } from "./Error";
import { CardContent, Divider, List } from "@mui/material";

type HistoryProps = {
  tournament: string;
};
const History = ({ tournament }: HistoryProps) => {
  const { status, error, data } = useTournamentHistory(tournament);
  return (
    <StyledCard sx={{ minWidth: "200px", maxHeight: "100vh" }}>
      {status === "loading" && <CircularProgress />}
      {status === "error" && <Error msg={error?.message} />}
      {status === "success" && (
        <CardContent sx={{ overflow: "auto", maxHeight: "65vh" }}>
          <List dense={true}>
            {data?.map((p, i) => (
              <div>{i !== data.length - 1 ? <Divider /> : null}</div>
            ))}
          </List>
        </CardContent>
      )}
    </StyledCard>
  );
};

export default History;
