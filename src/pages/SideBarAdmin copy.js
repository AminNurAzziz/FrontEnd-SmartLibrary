import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookReturnIcon from '@mui/icons-material/ExitToApp';
import ManageStudentIcon from '@mui/icons-material/PeopleAlt';
import ManageBorrowingIcon from '@mui/icons-material/LibraryBooks';
import { makeStyles } from '@mui/styles';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    drawerContainer: {
        overflow: 'auto',
        backgroundColor: '#052c65'
    },
    listItem: {
        '&:hover': {
            backgroundColor: theme.palette.primary.light,
        },
    },
    icon: {
        color: theme.palette.common.white,
    },
    text: {
        color: theme.palette.common.white,
    },
}));

const SidebarAdmin = () => {
    const classes = useStyles();

    return (
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div className={classes.drawerContainer}>
                <List>
                    <ListItem button className={classes.listItem}>
                        <ListItemIcon className={classes.icon}>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" className={classes.text} />
                    </ListItem>
                    <ListItem button className={classes.listItem}>
                        <ListItemIcon className={classes.icon}>
                            <BookReturnIcon />
                        </ListItemIcon>
                        <ListItemText primary="Return Book" className={classes.text} />
                    </ListItem>
                    <ListItem button className={classes.listItem}>
                        <ListItemIcon className={classes.icon}>
                            <ManageStudentIcon />
                        </ListItemIcon>
                        <ListItemText primary="Manage Student" className={classes.text} />
                    </ListItem>
                    <ListItem button className={classes.listItem}>
                        <ListItemIcon className={classes.icon}>
                            <ManageBorrowingIcon />
                        </ListItemIcon>
                        <ListItemText primary="Manage Borrowing" className={classes.text} />
                    </ListItem>
                </List>
            </div>
        </Drawer>
    );
};

export default SidebarAdmin;

