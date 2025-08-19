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
import { useParams, useLocation } from "react-router-dom";
import { Add, Visibility } from "@mui/icons-material";
import { useState,useEffect } from "react";
import AgrNewJobCard from "./AgrNewJobCard";
import axios from "axios";
import { BACKEND_SERVER_URL } from "../../Config/Config";
function JobCardDetails() {
  const { id, name } = useParams();
  const [description, setDescription] = useState("");
  const [givenGold, setGivenGold] = useState([
    { weight: "", touch: "", purity: "" },
  ]);

  const [itemDelivery, setItemDelivery] = useState([
    {
      ItemName: "",
      ItemWeight: "",
      Touch: "",
      stone: [{type: "", weight: "" }],
      netwt: "",
      wastageType: "",
      wastageValue: "",
      finalPurity: "",
    },
  ]);

  const [receivedMetalReturns,setReceivedMetalReturns]=useState([{weight: "", touch: "", purity: ""} ])
  const [masterItems,setMasterItems]=useState([])
  const [touchList,setTouchList]=useState([])
  const [openJobcardDialog, setOpenJobcardDialog] = useState(false);
  const [edit, setEdit] = useState(false);

  const handleCreateJobcard = () => {
    setOpenJobcardDialog(true);
  };
  const handleCloseJobcard = () => {
    setOpenJobcardDialog(false);
  };
  useEffect(()=>{
     const fetchMasterItems=async()=>{
      const res=await axios.get(`${BACKEND_SERVER_URL}/api/master-items/`)
      
      setMasterItems(res.data)
     }
      const fetchTouch = async () => {
      try {
        const res = await axios.get(`${BACKEND_SERVER_URL}/api/master-touch`);
        setTouchList(res.data);
      } catch (err) {
        console.error("Failed to fetch touch values", err);
       }
  };
     fetchMasterItems()
     fetchTouch()
  },[])
  
  return (
    <>
      <Container maxWidth="xxl" sx={{ py: 3 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            Goldsmith Details
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
              mb: 3,
            }}
          >
            <div>
              <Box sx={{ pl: 2 }}>
                <Typography>
                  <b>Name:</b> {name}
                </Typography>
              </Box>
            </div>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Job Card Records
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={handleCreateJobcard}
            >
              New Job Card
            </Button>
          </Box>

          {/* {loadingJobcards ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : jobcards.length === 0 ? (
          <Paper elevation={0} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="textSecondary">
              No job cards found for this goldsmith
            </Typography>
          </Paper>
        ) : (
          <Paper elevation={2} sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 1500 }}>
              <TableHead
                sx={{
                  backgroundColor: "#e3f2fd",
                  "& th": {
                    backgroundColor: "#e3f2fd",
                    color: "#0d47a1",
                    fontWeight: "bold",
                    fontSize: "1rem",
                  },
                }}
              >
                <TableRow>
                  <TableCell rowSpan={2}>S.No</TableCell>
                  <TableCell rowSpan={2}>Date</TableCell>
                  <TableCell rowSpan={2}>Description</TableCell>
                  <TableCell colSpan={3}>Given Gold</TableCell>
                  <TableCell rowSpan={2}>OB</TableCell>
                  <TableCell rowSpan={2}>TB</TableCell>
                  <TableCell colSpan={2}>Item Delivery</TableCell>
                  <TableCell rowSpan={2}>Stone WT</TableCell>
                  <TableCell rowSpan={2}>Wastage</TableCell>
                  <TableCell rowSpan={2}>Net WT</TableCell>
                  <TableCell rowSpan={2}>Final Purity</TableCell>
                  <TableCell colSpan={3}>Received Gold</TableCell>
                  <TableCell rowSpan={2}>Balance Owed By</TableCell>
                  <TableCell rowSpan={2}>Balance</TableCell>
                  <TableCell rowSpan={2}>Actions</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Weight</TableCell>
                  <TableCell>Touch</TableCell>
                  <TableCell>Purity</TableCell>
                  <TableCell>Item Name</TableCell>
                  <TableCell>Item Weight</TableCell>
                  <TableCell>Weight</TableCell>
                  <TableCell>Touch</TableCell>
                  <TableCell>Purity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobcards.map((jobcard, index) => {
                  const deliveries = jobcard.deliveries || [];
                  const received = jobcard.received || [];
                  const maxRows = Math.max(
                    deliveries.length,
                    received.length,
                    1
                  );
                  const totalRecord = getTotalRecordForJobcard(jobcard, index);
                  const runningBalance = calculateRunningBalance(
                    jobcard,
                    index
                  );
                  const jobcardBalanceStatus = getJobcardBalanceStatus(jobcard);
                  const jobcardNumericalBalance =
                    getJobcardNumericalBalance(jobcard);

                  return [...Array(maxRows)].map((_, i) => (
                    <TableRow key={`jobcard-${jobcard.id}-row-${i}`}>
                      {i === 0 && (
                        <>
                          <TableCell align="center" rowSpan={maxRows}>
                            {index + 1}
                          </TableCell>
                          <TableCell align="center" rowSpan={maxRows}>
                            {new Date(jobcard.createdAt).toLocaleDateString(
                              "en-IN"
                            )}
                          </TableCell>
                          <TableCell align="center" rowSpan={maxRows}>
                            {jobcard.description || "-"}
                          </TableCell>
                          <TableCell align="center" rowSpan={maxRows}>
                            {jobcard.weight ?? "-"}
                          </TableCell>
                          <TableCell align="center" rowSpan={maxRows}>
                            {jobcard.touch ?? "-"}
                          </TableCell>
                          <TableCell align="center" rowSpan={maxRows}>
                            {jobcard.purity?.toFixed(3) ?? "-"}
                          </TableCell>
                          <TableCell align="center" rowSpan={maxRows}>
                            {totalRecord?.openingBalance?.toFixed(3) || "0.000"}
                          </TableCell>
                          <TableCell align="center" rowSpan={maxRows}>
                            {runningBalance.toFixed(3)}
                          </TableCell>
                        </>
                      )}
                      {deliveries[i] ? (
                        <>
                          <TableCell align="center">
                            {deliveries[i].itemName}
                          </TableCell>
                          <TableCell align="center">
                            {deliveries[i].itemWeight?.toFixed(3) || "-"}
                          </TableCell>
                          <TableCell align="center">
                            {deliveries[i].stoneWeight?.toFixed(3) || "-"}
                          </TableCell>
                          <TableCell align="center">
                            {deliveries[i].wastageValue?.toFixed(3) || "-"}
                          </TableCell>
                          <TableCell align="center">
                            {calculateNetWeight(deliveries[i])}
                          </TableCell>
                          <TableCell align="center">
                            {deliveries[i].finalPurity?.toFixed(3) || "0.000"}
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell align="center">-</TableCell>
                          <TableCell align="center">-</TableCell>
                          <TableCell align="center">-</TableCell>
                          <TableCell align="center">-</TableCell>
                          <TableCell align="center">-</TableCell>
                          <TableCell align="center">-</TableCell>
                        </>
                      )}
                      {received[i] ? (
                        <>
                          <TableCell align="center">
                            {received[i].weight?.toFixed(3) || "-"}
                          </TableCell>
                          <TableCell align="center">
                            {received[i].touch?.toFixed(3) || "-"}
                          </TableCell>
                          <TableCell align="center">
                            {received[i].purity?.toFixed(3) || "-"}
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell align="center">-</TableCell>
                          <TableCell align="center">-</TableCell>
                          <TableCell align="center">-</TableCell>
                        </>
                      )}
                      {i === 0 && (
                        <>
                          <TableCell align="center" rowSpan={maxRows}>
                            {jobcardBalanceStatus}
                          </TableCell>
                          <TableCell align="center" rowSpan={maxRows}>
                            {jobcardNumericalBalance}
                          </TableCell>
                          <TableCell align="center" rowSpan={maxRows}>
                            <IconButton
                              onClick={() => handleEditJobcard(jobcard)}
                            >
                              <Visibility color="primary" />
                            </IconButton>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ));
                })}
              </TableBody>
            </Table>
          </Paper>
        )} */}
        </Paper>
      </Container>
      <Dialog
        open={openJobcardDialog}
        onClose={handleCloseJobcard}
        fullWidth
        maxWidth="md"
       
      >
        <AgrNewJobCard
         
          description={description}
          setDescription={setDescription}
          givenGold={givenGold}
          setGivenGold={setGivenGold}
          itemDelivery={itemDelivery}
          setItemDelivery={setItemDelivery}
          receivedMetalReturns={receivedMetalReturns}
          setReceivedMetalReturns={setReceivedMetalReturns}
          masterItems={masterItems}
          setMasterItems={setMasterItems}
          touchList={touchList}
          setTouchList={setTouchList}
          name={name}
          edit={edit}
          handleCloseJobcard={handleCloseJobcard}
        />
      </Dialog>
    </>
  );
}
export default JobCardDetails;

const box={
     backgroundColor:"red"
} 
 
