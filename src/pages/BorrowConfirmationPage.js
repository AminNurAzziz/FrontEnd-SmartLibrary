import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, styled } from '@mui/material';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import backgroundImage from '../assets/logo/background.jpg'; // Import the background image

const MainContainer = styled('div')({
    minHeight: '100vh',
    backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.5)), url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

const TransparentCard = styled(Card)({
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // White color with 80% opacity
});

const BorrowConfirmationPage = () => {
    const location = useLocation();
    const { message } = location.state;
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/', { replace: true }); // Using replace to replace the latest entry in the history stack
    };

    return (
        <MainContainer>
            <Container maxWidth="sm">
                <TransparentCard>
                    <CardContent>
                        <Grid container spacing={3} direction="column" alignItems="center">
                            <Grid item>
                                <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 100, color: 'green' }} />
                            </Grid>
                            <Grid item>
                                <Typography variant="h5" align="center">
                                    {message} Successful
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body1" align="center">
                                    Thank you! Your {message} book has been successfully processed.
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" onClick={handleGoBack}>Go Back</Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </TransparentCard>
            </Container>
        </MainContainer>
    );
};

export default BorrowConfirmationPage;
