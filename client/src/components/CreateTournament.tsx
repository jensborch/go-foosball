import { Fab, Tooltip } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { api, handleErrors } from "../api/Util";

export const CreateTournament = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    () => api.tournaments.tournamentsCreate({ initial: 0, name: "", score: 0 }),
    {
      onSuccess: () => queryClient.invalidateQueries("tournaments"),
      onError: (error) => {
        handleErrors(error as Response);
      },
    }
  );

  const onCreateTournament = () => {
    mutate();
  };
  return (
    <Tooltip title="Create tournament">
      <Fab
        color="primary"
        onClick={onCreateTournament}
        sx={{ position: "absolute", right: "20px", bottom: "20px" }}
      >
        <AddIcon />
      </Fab>
    </Tooltip>
  );
};
