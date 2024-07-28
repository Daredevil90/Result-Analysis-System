import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Avatar, 
  Typography, 
  Chip, 
  Grid, 
  useTheme, 
  useMediaQuery 
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import BadgeIcon from '@mui/icons-material/Badge';
import CakeIcon from '@mui/icons-material/Cake';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { logout } from '../../store/authSlice.js';
function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function ProfileCard({ icon, label, value }) {
  
  return (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        {icon}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 'medium', mt: 0.5 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function Profile({ role, userData }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const newDob = new Date(userData.dob);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/users/logout', {}, {
        withCredentials: true 
      });
  
      if (response.status === 200) {
        dispatch(logout())
        navigate('/'); 
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  const profileInfo = [
    { icon: <EmailIcon fontSize="large" color="primary" />, label: 'Email', value: userData.email },
    { icon: <SchoolIcon fontSize="large" color="primary" />, label: 'College', value: userData.collegeName },
    { icon: <BadgeIcon fontSize="large" color="primary" />, label: 'Roll No.', value: userData.rollno },
    { icon: <CakeIcon fontSize="large" color="primary" />, label: 'Birthday', value: newDob.toLocaleDateString() },
  ];

  return (
    <Box sx={{ 
      maxWidth: '800px', 
      margin: 'auto', 
      p: 2, 
      backgroundColor: theme.palette.background.default 
    }}>
      <Card elevation={3}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: stringToColor(userData.fullname),
                fontSize: '3rem',
                mb: 2
              }}
            >
              {userData.fullname.split(' ').map(name => name[0]).join('')}
            </Avatar>
            <Typography variant="h4" gutterBottom>{userData.fullname}</Typography>
            <Chip label={role} color="primary" />
          </Box>

          <Grid container spacing={2}>
            {profileInfo.map((info, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <ProfileCard {...info} />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Chip
              icon={<LogoutIcon />}
              label="Logout"
              clickable
              color="secondary"
              onClick={handleLogout}
            />
          </Box>
        </CardContent>
      </Card>
      <ToastContainer />
    </Box>
  );
}