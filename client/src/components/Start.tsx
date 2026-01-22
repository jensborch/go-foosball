import { useEffect, useState } from "react";
import { CardContent, Button, Typography, Box, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { conf } from "../api/util";
import { useTournament, CacheKeys } from "../api/hooks";
import { StyledCard } from "./Styled";
import { ColorHex, CountdownCircleTimer } from "react-countdown-circle-timer";
import { theme } from "./Theming";
import { useQueryClient } from "@tanstack/react-query";

const BASE_URL = import.meta.env.BASE_URL ?? "";

const PRIMARY = theme.palette.secondary.main as ColorHex;
const LIGHT = theme.palette.secondary.light as ColorHex;
const DARK = theme.palette.secondary.dark as ColorHex;

type RenderTimeProps = {
  remainingTime: number;
};

const renderTime = ({ remainingTime }: RenderTimeProps) => {
  if (remainingTime === 0) {
    return <Typography variant="h5">Game over</Typography>;
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h3">{remainingTime}</Typography>
    </Box>
  );
};

type ColorsTimesType = { 0: number } & { 1: number } & number[];

const colorsTimes = (timeout: number, colors: number): ColorsTimesType => {
  const result = [];
  for (let i = 0; i < colors; i++) {
    result.push((timeout / colors) * i);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return [timeout, ...result, 0] as any;
};

const Start = ({ tournament }: { tournament: string }) => {
  const queryClient = useQueryClient();
  const [isPlaying, setIsPlaying] = useState(false);
  const [reset, setReset] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const { data, error } = useTournament(tournament);
  const timeout = !error && data ? data.timeout : 120;

  useEffect(() => {
    const websocket = new WebSocket(
      `ws://${conf.host}/api/tournaments/${tournament}/events/game`
    );

    websocket.onmessage = () => {
      if (isPlaying) {
        setReset((r) => r + 1);
        setStartTime(new Date());
      } else {
        setIsPlaying(true);
        setStartTime(new Date());
      }
    };

    return () => {
      websocket.close();
    };
  }, [tournament, isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      const start = new Audio(
        `${BASE_URL}/sounds/duke/${Math.floor(Math.random() * 7) + 1}.wav`
      );
      start.play();
    }
  }, [reset, isPlaying]);

  const handleStart = () => {
    setIsPlaying(true);
    setStartTime(new Date());
  };

  const handleStop = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStartTime(null);
    setReset((r) => r + 1);
  };

  const onComplete = () => {
    new Audio(`${BASE_URL}/sounds/finish.wav`).play();
    setTimeout(() => {
      setIsPlaying(false);
      setStartTime(null);
    }, 4000);
  };

  const onUpdate = (remaining: number) => {
    if (remaining === 30) {
      new Audio(`${BASE_URL}/sounds/30seconds.wav`).play();
    } else if (remaining === 15) {
      new Audio(`${BASE_URL}/sounds/15seconds.wav`).play();
    }
  };

  return (
    <StyledCard>
      <CardContent>
        <Box position="relative" display="flex" justifyContent="center">
          <Box
            position="absolute"
            left={0}
            top="50%"
            display="flex"
            gap={2}
            alignItems="center"
            sx={{ transform: "translateY(-50%)" }}
          >
            {!isPlaying && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleStart}
                size="large"
                sx={{ minWidth: 150 }}
              >
                Start
              </Button>
            )}
            {isPlaying && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleStop}
                size="large"
                sx={{ minWidth: 150 }}
              >
                Stop
              </Button>
            )}
            <Tooltip title="Generate new games" arrow>
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  queryClient.invalidateQueries({
                    queryKey: [CacheKeys.RandomGames],
                  })
                }
                size="large"
              >
                <RefreshIcon />
              </Button>
            </Tooltip>
            {!isPlaying && startTime && (
              <Tooltip title="Reset timer" arrow>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleReset}
                  size="large"
                >
                  <RestartAltIcon />
                </Button>
              </Tooltip>
            )}
          </Box>
          <Box>
            <CountdownCircleTimer
              onComplete={onComplete}
              onUpdate={onUpdate}
              key={reset}
              isPlaying={isPlaying}
              duration={timeout}
              colors={[LIGHT, PRIMARY, DARK]}
              colorsTime={colorsTimes(timeout, 3)}
              size={140}
            >
              {renderTime}
            </CountdownCircleTimer>
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default Start;
