// components/layout/Navbar.tsx
import { useRouter } from 'next/router';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import { Person as PersonIcon, List as ListIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Firebase Auth App
          </Typography>
          {currentUser ? (
            <>
              <Button 
                color="inherit" 
                startIcon={<ListIcon />}
                onClick={() => router.push('/tasks')}
                sx={{ mr: 2 }}
              >
                Tasks
              </Button>
              <Button 
                color="inherit"
                onClick={() => router.push('/home')}
                sx={{ mr: 2 }}
              >
                Dashboard
              </Button>
              <IconButton color="inherit">
                <PersonIcon />
              </IconButton>
              <Typography variant="body1" sx={{ mr: 2 }}>
                {currentUser.email}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                onClick={() => router.push('/login')}
              >
                Login
              </Button>
              <Button 
                color="inherit" 
                onClick={() => router.push('/register')}
              >
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;