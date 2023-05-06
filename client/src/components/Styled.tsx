import { styled } from "@mui/material/styles";
import CardHeader, { CardHeaderProps } from "@mui/material/CardHeader";
import Card, { CardProps } from "@mui/material/Card";
import Grid, { GridProps } from "@mui/material/Grid";

export const MenuOffset = styled("div")(({ theme }) => theme.mixins.toolbar);

export const StyledCardHeader = styled(CardHeader)<CardHeaderProps>(
  ({ theme }) => ({
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
))(({ theme }) => ({
  margin: theme.spacing(),
}));
