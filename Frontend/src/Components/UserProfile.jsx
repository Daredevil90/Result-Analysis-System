
import Profile from './ui/Profile'
import { useSelector } from 'react-redux'
import Notauthenticated from './ui/Notauthenticated'

function UserProfile() {
    const authStatus= useSelector((state)=>state.auth.status);
    const userdata= useSelector((state)=>state.auth.userData);
    const isAdmin = useSelector((state)=>state.auth.isAdmin);
    let role="Student"
    if(isAdmin){
      role="Administrator"
    }
  if(authStatus){
  return (
    <Profile role={role} userData={userdata}/>
  )
} 
else{
   return(<Notauthenticated/>)
}
}

export default UserProfile