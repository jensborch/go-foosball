import { styled } from '@mui/system';
import CardHeader, { CardHeaderProps } from '@mui/material/CardHeader';

export const StyledCardHeader = styled(CardHeader)<CardHeaderProps>(
  ({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '& .MuiCardHeader-subheader': {
        color: theme.palette.primary.contrastText
    }
  })
);
