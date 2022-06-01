import {
  AppBar,
  Box,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

type MenuProps = {
  title: string;
  children?: JSX.Element;
};

const Menu = ({ title, children }: MenuProps) => {
  return (
    <AppBar position="static">
      <Toolbar>
      <IconButton
          href="/"
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
        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            top: (theme) => theme.spacing(3.5),
            right: (theme) => theme.spacing(5),
          }}
        >
          {children}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Menu;
