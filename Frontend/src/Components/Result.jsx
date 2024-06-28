import axios from "axios"
function Result() {
  const columns = [
    { field: 'Course Name', headerName: 'Course Name', width: 150, editable:false},
    {field:"Marks",editable:false}
  ]
  const rows=[
    {
      
    }
  ]
 const retrieveData= async()=>{
  axios.post("http://localhost:3000/api/v1/users/fetch-result",{},{withCredentials:true}).then((response)=>{
   console.log(response.data)
  })
 }
  return (
    <div>Result</div>
  )
}

export default Result