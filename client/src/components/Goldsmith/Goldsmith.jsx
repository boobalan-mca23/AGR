import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  InputAdornment,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Goldsmith.css";
import { Link } from "react-router-dom";
import { BACKEND_SERVER_URL } from "../../Config/Config";

const Goldsmith = () => {
  const [goldsmith, setGoldsmith] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobCardId,setJobCardId]=useState(0)
  const [jobCardError,setJobCardError]=useState({})
  const [noJobCard, setNoJobCard] = useState({});
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedGoldsmith, setSelectedGoldsmith] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [description, setDescription] = useState("");
  const [givenGold, setGivenGold] = useState([
    { weight: "", touch: "", purity: "" },
  ]);

  const [itemDelivery, setItemDelivery] = useState([
    {
      itemName: "",
      itemWeight: "",
      touch: "",
      deduction: [{ type: "", weight: "" }],
      netWeight: "",
      wastageType: "",
      wastageValue: "",
      finalPurity: "",
    },
  ]);


  const [receivedMetalReturns, setReceivedMetalReturns] = useState([
    { weight: "", touch: "", purity: "" },
  ]);
  const [masterItems, setMasterItems] = useState([]);
  const [touchList, setTouchList] = useState([]);

  useEffect(() => {
    const fetchGoldsmiths = async () => {
      try {
        const response = await fetch(`${BACKEND_SERVER_URL}/api/goldsmith`);
        const data = await response.json();
        setGoldsmith(data);
      } catch (error) {
        console.error("Error fetching goldsmith data:", error);
      }
    };
    fetchGoldsmiths();
  }, []);

  const handleEditClick = (goldsmith) => {
    setSelectedGoldsmith(goldsmith);
    setFormData({
      name: goldsmith.name,
      phone: goldsmith.phone,
      address: goldsmith.address,
    });
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(
        `${BACKEND_SERVER_URL}/api/goldsmith/${selectedGoldsmith.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("Goldsmith updated successfully");

        setGoldsmith((prev) =>
          prev.map((g) =>
            g.id === selectedGoldsmith.id ? { ...g, ...formData } : g
          )
        );

        setOpenEditDialog(false);
      } else {
        toast.error("Failed to update goldsmith");
      }
    } catch (error) {
      toast.error("Error updating goldsmith");
    }
  };

  const filteredGoldsmith = goldsmith.filter((gs) => {
    const nameMatch =
      gs.name && gs.name.toLowerCase().includes(searchTerm.toLowerCase());
    const phoneMatch = gs.phone && gs.phone.includes(searchTerm);
    const addressMatch =
      gs.address && gs.address.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || phoneMatch || addressMatch;
  });
  
    const handleJobCardId = (id) => {
       const num = Number(id);
       if (isNaN(num)) {
         setJobCardError({ err: "Please Enter Vaild Input" });
       } else {
         setJobCardError({});
         setJobCardId(num);
       }
     };
     const handleSearch = () => {
       if (!jobCardError.err && !isNaN(jobCardId) && jobCardId !== null) {
        
         const fetchJobCardById = async () => {
           try {
             const res = await fetch(
               `${BACKEND_SERVER_URL}/api/assignments/${jobCardId}/jobcard`,
               {
                 method: "GET",
                 headers: {
                   "Content-Type": "application/json",
                 },
               }
             );
             const data = await res.json();
            console.log('data',data)
            
           } catch (err) {
             toast.error(err.message);
           }
         };
         fetchJobCardById();
       }
     };


  return (
  
      <div className="homeContainer">
        <Paper
          className="customer-details-container"
          elevation={3}
          sx={{ p: 3 }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Goldsmith Details
          </Typography>

          <TextField
            label="Search Goldsmith Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
                width: "18rem",
                backgroundColor: "#f8f9fa",
                "&.Mui-focused": {
                  backgroundColor: "#ffffff",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: "#777" }} />
                </InputAdornment>
              ),
            }}
          />

          <table>
            <thead
             className="goldSmithThead"
            >
              <tr>
                <td align="center">
                  <strong>Goldsmith Name</strong>
                </td>
                <td align="center">
                  <strong>Phone Number</strong>
                </td>
                <td align="center">
                  <strong>Address</strong>
                </td>
                <td align="center">
                  <strong>Actions</strong>
                </td>
              </tr>
            </thead>
            <tbody>
              {filteredGoldsmith.length > 0 ? (
                filteredGoldsmith.map((goldsmith, index) => (
                  <tr key={index}>
                    <td align="center">{goldsmith.name}</td>
                    <td align="center">{goldsmith.phone}</td>
                    <td align="center">{goldsmith.address}</td>
                    <td align="center">
                      <Tooltip title="View Jobcard">
                        <Link
                          to={`/goldsmithcard/${goldsmith.id}/${goldsmith.name}`}
                          state={{
                            phone: goldsmith.phone,
                            address: goldsmith.address,
                          }}
                          style={{ marginRight: "10px", color: "#1976d2" }}
                        >
                          <AssignmentIndOutlinedIcon
                            style={{ cursor: "pointer" }}
                          />
                        </Link>
                      </Tooltip>

                      <Tooltip title="Edit">
                        <EditIcon
                          style={{
                            cursor: "pointer",
                            marginRight: "10px",
                            color: "#388e3c",
                          }}
                          onClick={() => handleEditClick(goldsmith)}
                        />
                      </Tooltip>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} align="center">
                    No goldsmith details available...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Paper>

        <div className="searchContainer">
          <Typography variant="h6" gutterBottom>
            Search Job Card
          </Typography>
          <div className="searchBox">
            <div className="inputWithError">
              <TextField
                id="outlined-basic"
                label="JobCard Id"
                onChange={(e) => handleJobCardId(e.target.value)}
                variant="outlined"
                autoComplete="off"
              />
              {jobCardError.err && (
              <p className="errorText">{jobCardError.err}</p>
            )}
              {/* {noJobCard.err && <p className="errorText">{noJobCard.err}</p>} */}
            </div>

            <Button
              className="searchBtn"
              variant="contained"
              onClick={handleSearch}
              disabled={!!jobCardError.err}
            >
              Search
            </Button>
          </div>
        </div>
     

      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Goldsmith</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={formData.name}
            fullWidth
            margin="normal"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Phone"
            value={formData.phone}
            fullWidth
            margin="normal"
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          <TextField
            label="Address"
            value={formData.address}
            fullWidth
            margin="normal"
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer position="top-right" autoClose={3000} />
     </div>
  );
};

export default Goldsmith;
