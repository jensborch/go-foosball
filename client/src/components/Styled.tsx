import { styled } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import SvgIcon from "@mui/material/SvgIcon";
import type {
  CardProps,
  GridProps,
  ButtonProps,
  SvgIconProps,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import type { Theme } from "@mui/material/styles";

export const MenuOffset = styled("div")(
  ({ theme }: { theme: Theme }) => theme.mixins.toolbar
);

export const ActionButton = styled((props: ButtonProps) => (
  <Button size="large" {...props} />
))(({ theme }: { theme: Theme }) => ({
  minWidth: 160,
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  fontWeight: theme.typography.fontWeightBold,
}));

export const ActionIcon = styled((props: SvgIconProps) => (
  <SvgIcon {...props} />
))({
  width: 24,
  height: 24,
});

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

export const ActionButtonGroup = styled((props: GridProps) => (
  <Grid container spacing={2} alignItems="center" {...props} />
))``;

export const DefaultGrid = styled((props: GridProps) => (
  <Grid spacing={3} {...props} />
))(({ theme }: { theme: Theme }) => ({
  margin: theme.spacing(),
}));
