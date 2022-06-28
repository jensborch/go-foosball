import {
  AppBar,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Children } from 'react';
import { Link } from 'react-router-dom';

type MenuProps = {
  title: string;
  children?: React.ReactNode;
};

const Menu = ({ title, children }: MenuProps) => {
  const arrayChildren = Children.toArray(children);
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          to="/"
          component={Link}
          sx={{
            marginLeft: (theme) => theme.spacing(-1),
            marginRight: (theme) => theme.spacing(2),
          }}
          color="inherit" 
          aria-label="Home"
        >
          <HomeIcon />
        </IconButton>
        <Typography variant="h6" color="inherit" sx={{ display: 'flex' }}>
          {title}
        </Typography>
        <Grid
          spacing={2}
          container
          direction="row-reverse"
          sx={{
            position: 'absolute',
            width: '30%',
            top: (theme) => theme.spacing(3.5),
            right: (theme) => theme.spacing(5),
          }}
        >
          {Children.map(arrayChildren, (child, index) => {
            return (
              <Grid item key={index}>
                {child}
              </Grid>
            );
          })}
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Menu;
