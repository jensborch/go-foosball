import { Button, Stack, TextField } from "@mui/material";
import { SetStateAction, useState } from "react";

const AddTable = () => {
  const [name, setName] = useState("");
  const [leftColor, setLeftColor] = useState("");
  const [rightColor, setRightColor] = useState("");
  function create(): void {}
  return (
    <Stack spacing={2}>
      <TextField
        helperText="Name"
        value={name}
        onChange={(event: { target: { value: SetStateAction<string> } }) =>
          setName(event.target.value)
        }
      />
      <TextField
        helperText="Right Color"
        value={rightColor}
        onChange={(event: { target: { value: SetStateAction<string> } }) =>
          setRightColor(event.target.value)
        }
      />
      <TextField
        helperText="Left Color"
        value={leftColor}
        onChange={(event: { target: { value: SetStateAction<string> } }) =>
          setLeftColor(event.target.value)
        }
      />
      <Button variant="outlined" onClick={create}>
        Create
      </Button>
    </Stack>
  );
};

export default AddTable;
