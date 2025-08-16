import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TableContainer,
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
import CloseIcon from "@mui/icons-material/Close";
import { MdDeleteForever } from "react-icons/md";
import { useState, useEffect } from "react";
import "./AgrNewJobCard.css";
import React from "react";
function AgrNewJobCard({

  edit,
  handleCloseJobcard,
  name,
  description,
  setDescription,
  givenGold,
  setGivenGold,
  itemDelivery,
  setItemDelivery,
}) {
  const today = new Date().toLocaleDateString("en-IN");
  const [time, setTime] = useState(null);

  const format = (
    val // its used for set three digit after point value
  ) => (isNaN(parseFloat(val)) ? "" : parseFloat(val).toFixed(3));

  const calculatePurity = (w, t) =>
    !isNaN(w) && !isNaN(t)
      ? ((parseFloat(w) * parseFloat(t)) / 100).toFixed(3)
      : "";
  const handleStone = (index) => {
    let newDeduction = { dedcution: "", weight: "" };

    let updated = [...itemDelivery];
    updated[index].stone.push(newDeduction);

    setItemDelivery(updated);
  };

  const handleGoldRowChange = (i, field, val) => {
    const copy = [...givenGold];
    copy[i][field] = val;
    copy[i].purity = calculatePurity(
      parseFloat(copy[i].weight),
      parseFloat(copy[i].touch)
    );
    setGivenGold(copy);
  };
  const totalInputPurityGiven = givenGold.reduce(
    (sum, row) => sum + parseFloat(row.purity || 0),
    0
  );
  const handleRemoveGoldRow = (i) => {
    const isTrue = window.confirm("Are You Want To Remove This Row");
    if (isTrue) {
      const filtergold = givenGold.filter((_, index) => i !== index);
      setGivenGold(filtergold);
    }
  };
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
  return (
    <>
      <DialogTitle className="dialogTitle" id="customized-dialog-title">
        <p>{edit ? "Edit JobCard" : "Add New JobCard"}</p>
        <IconButton
          aria-label="close"
          onClick={handleCloseJobcard}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box className="jobCardheader">
          <Typography>Name:{name}</Typography>
          <Typography>Date:{today}</Typography>
          <Typography>Time:{time}</Typography>
        </Box>

        <div className="description section">
          <label htmlFor="description" className="label">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            className="textarea"
          />
        </div>
        <Box className="section">
          <h4 className="section-title">Given Details</h4>
          <div className="givenGold">
            {givenGold.map((row, i) => (
              <div key={row.id || `gold-${i}`} className="row">
                <input
                  type="number"
                  placeholder="Weight"
                  value={row.weight}
                  onChange={(e) =>
                    handleGoldRowChange(i, "weight", e.target.value)
                  }
                  className="input"
                  onWheel={(e) => e.target.blur()}
                />
                <span className="operator">x</span>
                <input
                  type="number"
                  placeholder="Touch"
                  value={row.touch}
                  onChange={(e) =>
                    handleGoldRowChange(i, "touch", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                  className="input"
                />
                <span className="operator">=</span>
                <input
                  type="text"
                  readOnly
                  placeholder="Purity"
                  value={format(row.purity)}
                  className="input-read-only"
                />
                <MdDeleteForever
                  className="delIcon"
                  size={25}
                  onClick={() => handleRemoveGoldRow(i)}
                />
              </div>
            ))}
          </div>

          <button
            onClick={() =>
              setGivenGold([
                ...givenGold,
                { weight: "", touch: "", purity: "" },
              ])
            }
            className="circle-button"
          >
            +
          </button>
          <div className="total-purity-container">
            <span className="total-purity-label">Total Purity:</span>
            <span className="total-purity-value">
              {format(totalInputPurityGiven)}
            </span>
          </div>
        </Box>
        <Box className="section">
          <h4 className="section-title">Item Delivery</h4>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="item table">
              <TableHead>
                <TableRow>
                  <TableCell>S.No</TableCell>
                  <TableCell>Item Name</TableCell>
                  <TableCell>Item Weight</TableCell>
                  <TableCell>Touch</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell colSpan={2}>Deduction</TableCell>
                  <TableCell>Net Weight</TableCell>
                  <TableCell>Wastage Type</TableCell>
                  <TableCell>Wastage Value</TableCell>
                  <TableCell>Final Purity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {itemDelivery.map((item, index) => (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell rowSpan={item.stone.length}>
                        {index + 1}
                      </TableCell>
                      <TableCell rowSpan={item.stone.length}>
                        <input  className="input" type="number"  onWheel={(e) => e.target.blur()} />
                      </TableCell>
                      <TableCell rowSpan={item.stone.length}>
                        <input   className="input"  type="number"  onWheel={(e) => e.target.blur()}/>
                      </TableCell>
                      <TableCell rowSpan={item.stone.length}>
                        <input  className="input"  type="number"  onWheel={(e) => e.target.blur()}/>
                      </TableCell>
                      <TableCell rowSpan={item.stone.length}>
                        <Button onClick={() => handleStone(index)}>+</Button>
                      </TableCell>

                      {/* First stone row */}
                      <TableCell>
                        <input  className="input"v type="number"  onWheel={(e) => e.target.blur()}/>
                      </TableCell>
                      <TableCell>
                        <input  className="input"  type="number"  onWheel={(e) => e.target.blur()}/>
                      </TableCell>

                      <TableCell rowSpan={item.stone.length}>
                        <input  className="input"  type="number"  onWheel={(e) => e.target.blur()} />
                      </TableCell>
                      <TableCell rowSpan={item.stone.length}>
                        <input  className="input"   type="number"  onWheel={(e) => e.target.blur()}/>
                      </TableCell>
                      <TableCell rowSpan={item.stone.length}>
                        <input  className="input"  type="number"  onWheel={(e) => e.target.blur()}/>
                      </TableCell>
                      <TableCell rowSpan={item.stone.length}>
                        <input  className="input"  type="number"  onWheel={(e) => e.target.blur()}/>
                      </TableCell>
                    </TableRow>

                    {/* Remaining stone rows */}
                    {item.stone.slice(1).map((s, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <input  className="input"  type="number"  onWheel={(e) => e.target.blur()}/>
                        </TableCell>
                        <TableCell>
                          <input   className="input"  type="number"  onWheel={(e) => e.target.blur()}/>
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <button
            onClick={() =>
              setItemDelivery([
                ...itemDelivery,
                {
                  ItemName: "",
                  ItemWeight: "",
                  Touch: "",
                  stone: [{ dedcution: "", weight: "" }],
                  netwt: "",
                  wastageTyp: "",
                  wastageValue: "",
                  finalPurity: "",
                },
              ])
            }
            className="circle-button"
          >
            +
          </button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCloseJobcard}>
          Save changes
        </Button>
      </DialogActions>
    </>
  );
}
export default AgrNewJobCard;
