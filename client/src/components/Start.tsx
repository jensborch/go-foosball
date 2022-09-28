import { Fab } from "@mui/material";
import { useEffect, useState } from "react";
import Timer from "./Timer";
import TimerIcon from "@mui/icons-material/Timer";

const Start = ({ tournament }: { tournament: string }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const websocket = new WebSocket(
      `ws://localhost:8080/tournaments/${tournament}/events/game`
    );

    websocket.onmessage = (msg) => {
      setOpen(true);
    };

    return () => {
      websocket.close();
    };
  }, [tournament]);

  return (
    <>
      <Fab onClick={() => setOpen(true)} color="default" aria-label="Start">
        <TimerIcon />
      </Fab>
      <Timer timeout={2 * 60} open={open} setOpen={setOpen} />
    </>
  );
};

export default Start;
