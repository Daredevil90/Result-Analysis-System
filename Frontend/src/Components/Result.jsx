import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Alert
} from '@mui/material';

const Result = () => {
  const userData = useSelector((state) => state.auth.userData);
  console.log("userData:", userData);

  const location = useLocation();
  const { resultData, headers } = location.state || {};
  console.log("resultData:", resultData);
  console.log("headers:", headers);

  if (!resultData || !headers) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="error">No result data available. Please go back and select an exam.</Alert>
      </Box>
    );
  }

  // Find the user's result by matching the roll number
  const userResult = resultData.find(row => row === userData.rollno);
  console.log("userResult:", userResult);

  if (!userResult) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="warning">No results found for your roll number.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{
      maxWidth: 800,
      margin: 'auto',
      mt: 4,
      p: 3,
      backgroundColor: '#f5f5f5',
      borderRadius: 2,
      boxShadow: 3
    }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
        Exam Result
      </Typography>
      <Typography variant="h6" gutterBottom>
        Roll No: {userResult}
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="result table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>SI No.</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Course Name</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Marks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {headers.slice(1).map((header, index) => (
              <TableRow
                key={index}
                sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}
              >
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{header}</TableCell>
                <TableCell align="center">{resultData[index+1]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h6" align="right" sx={{ mt: 2 }}>
        Total: {userResult[userResult.length - 1]}
      </Typography>
    </Box>
  );
};

export default Result;
