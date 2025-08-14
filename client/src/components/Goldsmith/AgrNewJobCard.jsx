
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Divider,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useState,useEffect} from "react";
function AgrNewJobCard({edit,handleCloseJobcard,name}){
      const today = new Date().toLocaleDateString("en-IN");
      const [time,setTime]=useState(null)
       useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);
    return(
      <>
      <Box>
      <DialogTitle sx={{ m: 0, p: 0 }} id="customized-dialog-title">
          {edit?"Edit JobCard":"Add New JobCard"}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseJobcard}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          
            <Box sx={{display:"flex",justifyContent:"space-around",alignItems:"center"}}>
             <Typography>Name:{name}</Typography>
            <Typography>Date:{today}</Typography>
            <Typography>Time:{time}</Typography>
            </Box>
         
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseJobcard}>
            Save changes
          </Button>
        </DialogActions>
        </Box>
      </>
    )
}
export default AgrNewJobCard