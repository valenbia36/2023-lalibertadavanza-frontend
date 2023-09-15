import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import Tooltip  from '@mui/material/Tooltip';

const Notifications = ({badgeContent}) => {
  const newNotifications = 'You have '+badgeContent+' new notifications!'
  const noNotifications = 'You have no notifications'

  return(
    <Tooltip title ={badgeContent ? newNotifications:noNotifications }>
        <IconButton
            color="inherit"
            aria-label="notifications"
            edge="end"
            sx={{ left:'50%'}}
          >
            <Badge badgeContent={4} color="error"></Badge>
              <NotificationsIcon/>
            <Badge/>
          </IconButton>
    </Tooltip>

          
)}
export default Notifications;
