import React from "react";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';   
import { Box, Button, Container, Typography } from "@mui/material"; 
import { TextField } from "@mui/material";
import Logout from "../../Logout";
function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  
function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }
  
export default function Profile({role,userData})
{    const newDob= new Date(userData.dob);
  console.log(newDob)

    return(
           <Container minWidth="xs" maxWidth="sm" className="my-2 profile-container">
            <Box height={300}>
             <Stack direction="column" spacing={2} className=" h-full w-full flex    bg-[#0066CC]" justifyContent="center"
  alignItems="center">
              <Avatar {...stringAvatar(userData.fullname)} sx={{ width: 100, height: 100 }} className="" />
              <Typography variant="h5">{userData.fullname}</Typography>
              <Typography>{role}</Typography>
            </Stack>
            </Box>
            <Box my={3} >
            <Stack direction="column" spacing={2} >
           <TextField
          id="outlined-read-only-input"
          label="Email Address"
          defaultValue={userData.email}
          InputProps={{
            readOnly: true,
          }}
        />
           <TextField
          id="outlined-read-only-input"
          label="College Name"
          defaultValue={userData.collegeName}
          InputProps={{
            readOnly: true,
          }}
        />
           <TextField
          id="outlined-read-only-input"
          label="Roll Number"
          defaultValue={userData.rollno}
          InputProps={{
            readOnly: true,
          }}
        />
           <TextField
          id="outlined-read-only-input"
          label="Date of Birth "
          defaultValue={newDob.toLocaleDateString()}
          InputProps={{
            readOnly: true,
          }}
        />
          <Logout/>
            </Stack>
            </Box>
            </Container>
    )
}