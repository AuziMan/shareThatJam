import { Container, Accordion, Button, Card  } from "react-bootstrap";
import React, { useState } from 'react';
import NowPlaying from "../Services/NowPlaying";
import TopTracks from "../Services/TopTracks";
import UserPlaylists from "../Services/UserPlaylists";

const HomePage = () => {
    return (
        <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100">
            <NowPlaying />
            <Accordion defaultActiveKey="0" className="w-75">
                <Card>
                    <Accordion.Header>
                        <Button className="w-100 text-left">
                            Top Tracks
                        </Button>
                    </Accordion.Header>
                    <Accordion.Body>
                        <TopTracks />
                    </Accordion.Body>
                </Card>
            </Accordion>

            <UserPlaylists />
        </Container>
    );
};

export default HomePage;