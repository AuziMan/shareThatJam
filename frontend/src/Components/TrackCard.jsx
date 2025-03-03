import React from 'react';
import { Card } from 'react-bootstrap';
import '../styles/trackCard.css'; // Import the CSS file

const TrackCard = ({ trackName, artistName, albumImg }) => {
    return (
        <Card className="track-card">
            <Card.Img variant="top" src={albumImg || "https://via.placeholder.com/150"} className="track-card-img"/>
            <Card.Body className="track-card-body">
                <Card.Title className="track-card-title">{trackName}</Card.Title>
                <Card.Text className="track-card-text">{artistName}</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default TrackCard;
