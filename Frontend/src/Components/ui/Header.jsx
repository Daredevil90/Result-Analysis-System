import React from "react";
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import { Divider } from "@mui/material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {Container} from "@mui/material";
import axios from "axios";
const navitems=[
  {
    component:NavLink,
    text:"Profile",
    slug:"/profile",
    variant:"h5"
  },
  {
    component:NavLink,
    text:"Sign Up",
    slug:"/register",
     variant:"h5"
  },
  {
    component:NavLink,
    text:"Sign In",
    slug:"/login",
     variant:"h5"
  },
  {
    component:NavLink,
    text:"Upload Results",
    slug:"/admin/upload",
    variant:"h5"
  }
]
const allowedIndices = [1,2]; 
export default function Header()
{    const authStatus= useSelector((state)=>state.auth.status);
     const adminStatus = useSelector((state)=>state.auth.isAdmin);
     console.log(adminStatus)
    return(
        <Container component="nav" maxWidth="xl"  className="bg-black h-20 flex" > 
          <Stack spacing={3} direction="row"  divider={<Divider orientation="vertical" flexItem  className="bg-blue-400"/>} sx={{ color: 'primary.main' }} justifyContent="center" alignItems="center" className=" justify-center h-full">
     {authStatus &&(
      <Link component={navitems[0].component} variant={navitems[0].variant} to={navitems[0].slug}>{navitems[0].text}</Link>
     )}
    {/* {!authStatus &&( <> 
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
    } */}
    {
      !authStatus ? (
        navitems.filter((item,index)=>allowedIndices.includes(index)).map((item, index) => (
          <Link key={index} component={NavLink} color="primary" variant={item.variant} to={item.slug} className="">
            {item.text}
          </Link>
        ))
      ) : null
    }
     {adminStatus && (<Link component={navitems[3].component} to={navitems[3].slug} variant={navitems[3].variant}>{navitems[3].text}</Link>) }
      </Stack>
        </Container>
    )
}