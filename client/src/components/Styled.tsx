import { styled } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import SvgIcon from "@mui/material/SvgIcon";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import type {
  CardProps,
  CardContentProps,
  GridProps,
  ButtonProps,
  SvgIconProps,
  ChipProps,
  StackProps,
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

export const RankingChip = styled((props: ChipProps) => (
  <Chip size="small" color="primary" {...props} />
))(({ theme }: { theme: Theme }) => ({
  minWidth: theme.spacing(6),
}));

export const ScrollableCardContent = styled((props: CardContentProps) => (
  <CardContent {...props} />
))({
  overflow: "auto",
  maxHeight: "65vh",
});

export const CenteredStack = styled((props: StackProps) => (
  <Stack alignItems="center" justifyContent="center" {...props} />
))``;

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
