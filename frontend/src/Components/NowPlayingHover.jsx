import React from 'react';
import { Card, Button } from 'react-bootstrap';

const NowPlayingHover = ({ trackName, artistName, albumImg, onPlay, onAddToPlaylist }) => {
    return (
        <Card style={{ width: '18rem', margin: '10px' }}>
            <Card.Img variant="top" src={albumImg || "https://via.placeholder.com/150"} />
            <Card.Body>
                <Card.Title>{trackName}</Card.Title>
                <Card.Text>{artistName}</Card.Text>
                <Button variant="primary" onClick={onPlay}>Play</Button>
                <Button variant="secondary" className="ms-2" onClick={onAddToPlaylist}>Add to Playlist</Button>
            </Card.Body>
        </Card>
    );
};

export default NowPlayingHover;
