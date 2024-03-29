import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import WorksContext from "../../store/works-context";
import { Badge, Button, Menu, MenuItem } from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import "../../scss/App.scss";
import { httpRequest } from "../../httpRequest";
import logo from "../../assets/substitutes-logo.png";

export const Notifications = ({ guest }) => {
  const ctx = useContext(WorksContext);

  const {
    notifications,
    notificationsNumber,
    updateNotificationsNumber,
    type,
  } = ctx;

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    updateNotificationsNumber(0);
    const user = JSON.parse(sessionStorage.getItem("user"));
    const data = { email: user[user.type].email, type: user.type };
    if (user.type === "sub") data.substituteId = user[user.type]._id;
    else data.userId = user[type]._id;
    setAnchorEl(event.currentTarget);

    httpRequest("post", `/${user.type}/notifications/clear`, data, {
      token: user.token,
    });
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="noti">
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        className={`noti-button ${guest && "noti-button-disabled"}`}
      >
        <Badge badgeContent={notificationsNumber} color="primary">
          <MailIcon color="action" />
        </Badge>
      </Button>
      <Menu
        className="noti-menu"
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {notifications.length > 0 ? (
          notifications.map((notification, i) => (
            <Link key={i} className="noti-link" to="/works">
              <MenuItem onClick={handleClose}>{notification}</MenuItem>
            </Link>
          ))
        ) : (
          <MenuItem onClick={handleClose}>אין התראות חדשות</MenuItem>
        )}
      </Menu>
      <img className="logo" src={logo} alt="logo" />
    </div>
  );
};
