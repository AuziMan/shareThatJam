// TrackCard.js
import React from 'react';
import { Card } from 'react-bootstrap';

const TrackCard = ({ trackName, artistName, albumImg }) => {
    return (
        <Card style={{ width: '18rem', margin: '10px' }}>
            <Card.Img variant="top" src={albumImg || "https://via.placeholder.com/150"} />
            <Card.Body>
                <Card.Title>{trackName}</Card.Title>
                <Card.Text>{artistName}</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default TrackCard;
