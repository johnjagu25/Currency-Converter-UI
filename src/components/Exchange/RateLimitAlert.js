import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { rateLimit } from "../../util/commonstyle";

export default function AlertDialog(props) {
  const handleClose = () => {
    props.updReqDialog(false);
  };

  return (
      <Dialog open={props.reqLimitDialog} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>
            <div style={rateLimit.title} >Oh no, you've exceeded your request limit!</div>
            <div style={rateLimit.msg}>Please take a minute break and come back</div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
  );
}
