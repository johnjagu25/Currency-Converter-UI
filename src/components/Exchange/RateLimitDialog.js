import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { rateLimit } from "../../util/commonstyle";
import { BTN, RATE_LIMIT_DIALOG } from "../../constant/constant";

export default function RateLimitDialog({onUpdReqDialog,onReqLimitDialog}) {
  const handleClose = () => {
    onUpdReqDialog(false);
  };

  return (
      <Dialog open={onReqLimitDialog} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>
            <div style={rateLimit.title}>{RATE_LIMIT_DIALOG.title}</div>
            <div style={rateLimit.msg}>{RATE_LIMIT_DIALOG.msg}</div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{BTN.CLOSE}</Button>
        </DialogActions>
      </Dialog>
  );
}
