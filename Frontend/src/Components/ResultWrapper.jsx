import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  Box,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';

function ResultWrapper() {
  const navigate = useNavigate();
  const [examList, setExamList] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedSem, setSelectedSem] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExamList = async () => {
      try {
        setLoading(true);
        const response = await axios.post("http://localhost:3000/api/v1/users/fetch-result", {}, { withCredentials: true });
        setExamList(response.data.record);
      } catch (error) {
        console.error("Error fetching exam list:", error);
        setError(error.response?.data?.message || "An error occurred while fetching exam list.");
      } finally {
        setLoading(false);
      }
    };
    fetchExamList();
  }, []);

  const handleExamChange = (event) => {
    setSelectedExam(event.target.value);
  };

  const handleSemChange = (event) => {
    setSelectedSem(event.target.value);
  };

  const handleViewResult = async () => {
    if (!selectedExam || !selectedSem) {
      setError("Please select both exam and semester");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/api/v1/users/fetch-exam-result", {
        exam_name: selectedExam,
        exam_sem: selectedSem
      }, { withCredentials: true });
      console.log(response.data)
      navigate('/result', { state: { resultData: response.data.data,
                                     headers: response.data.headers
       } });
    } catch (error) {
      console.error("Error fetching result:", error);
      setError(error.response?.data?.message || "An error occurred while fetching the result.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
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
        Examination Results
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Exam</InputLabel>
          <Select value={selectedExam} onChange={handleExamChange}>
            {examList.map((exam) => (
              <MenuItem key={exam._id} value={exam.examination_name}>
                {exam.examination_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl fullWidth>
          <InputLabel>Semester</InputLabel>
          <Select value={selectedSem} onChange={handleSemChange}>
            {examList.map((exam) => (
              <MenuItem key={exam._id} value={exam.semester}>
                {exam.semester}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleViewResult}
          startIcon={<VisibilityIcon />}
          disabled={!selectedExam || !selectedSem}
        >
          View Result
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table aria-label="examination results table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Exam Name</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Semester</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {examList.map((exam) => (
              <TableRow 
                key={exam._id} 
                sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}
              >
                <TableCell align="center">{exam.examination_name}</TableCell>
                <TableCell align="center">{exam.semester}</TableCell>
                <TableCell align="center">{new Date(exam.exam_date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {examList.length === 0 && (
        <Typography variant="body1" align="center" sx={{ mt: 2 }}>
          No exams found.
        </Typography>
      )}
    </Box>
  );
}

export default ResultWrapper;