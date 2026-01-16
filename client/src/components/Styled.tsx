import { styled } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";
import Card from "@mui/material/Card";
import type { CardProps, GridProps } from "@mui/material";
import Grid from "@mui/material/Grid";

export const MenuOffset = styled("div")(
  ({ theme }: { theme: Theme }) => theme.mixins.toolbar
);

import type { Theme } from "@mui/material/styles";

export const StyledCardHeader = styled(CardHeader)(
  ({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "& .MuiCardHeader-subheader": {
      color: theme.palette.primary.contrastText,
    },
    "& .MuiSvgIcon-root": {
      color: theme.palette.primary.contrastText,
    },
  })
);

export const StyledCard = styled((props: CardProps) => (
  <Card elevation={4} {...props} />
))``;

export const DefaultGrid = styled((props: GridProps) => (
  <Grid spacing={3} {...props} />
))(({ theme }: { theme: Theme }) => ({
  margin: theme.spacing(),
}));
