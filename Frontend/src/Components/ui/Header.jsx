import React from "react";
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import { NavLink } from "react-router-dom";
import { Divider } from "@mui/material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {Container} from "@mui/material";

export default function Header()
{    const authStatus= useSelector((state)=>state.auth.status);
    return(
        <Container component="nav" maxWidth="xl"  className="bg-black h-20 flex" > 
          <Stack spacing={5} direction="row"  divider={<Divider orientation="vertical" flexItem />} sx={{ color: 'primary.main' }} className=" justify-center h-full">
     {authStatus &&(<>
      <Link 
      component="button"
      variant="h5"
      color="primary"
    ><NavLink to="/profile" >Profile</NavLink></Link></>)}
    {!authStatus &&( <> 
      <Link
      href="http://localhost:5173/profile"
      component="button"
      variant="h5"
    ><NavLink to="/register">Sign Up</NavLink></Link>
     <Link
      component="button"
      variant="h5"
    ><NavLink to="/login">Sign In</NavLink></Link>
    </>)
    }
      </Stack>
        </Container>
    )
}