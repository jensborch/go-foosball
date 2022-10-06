import { Fab } from "@mui/material";
import { useEffect, useState } from "react";
import Timer from "./Timer";
import TimerIcon from "@mui/icons-material/Timer";
import { conf } from "../api/util";
import { useTournament } from "../api/hooks";

const Start = ({ tournament }: { tournament: string }) => {
  const [open, setOpen] = useState(false);
  const [reste, setReset] = useState(0);
  const { data, error } = useTournament(tournament);
  const timeout = !error && data ? data.timeout : 120;

  useEffect(() => {
    const websocket = new WebSocket(
      `ws://${conf.host}/api/tournaments/${tournament}/events/game`
    );

    websocket.onmessage = (msg) => {
      if (open) {
        setReset((r) => r + 1);
      } else {
        setOpen(true);
      }
    };

    return () => {
      websocket.close();
    };
  }, [tournament, open]);

  return (
    <>
      <Fab onClick={() => setOpen(true)} color="default" aria-label="Start">
        <TimerIcon />
      </Fab>
      <Timer reset={reste} timeout={timeout} open={open} setOpen={setOpen} />
    </>
  );
};

export default Start;
