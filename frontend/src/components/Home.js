import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Container, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    axios.get('http://localhost:5000/api/events')
      .then((response) => {
        // Sort events by eventDate in ascending order
        const sortedEvents = response.data.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
        setEvents(sortedEvents);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
  };

  const formatTime = (time) => {
    const d = new Date(`1970-01-01T${time}`);
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  return (
    <Container>
      <h1 className="my-4 text-center">Welcome To EventPlaza</h1>
      <Row xs={1} md={2} lg={3} className="g-4 justify-content-center">
        {events.map((event) => (
          <Col key={event.eventId} className="mb-4">
            <Card>
              {event.imageUrl && <Card.Img variant="top" src={event.imageUrl} />}
              <Card.Body>
                <Card.Title>{event.eventName}</Card.Title>
                <Card.Text>Date: {formatDate(event.eventDate)}</Card.Text>
                <Card.Text>Time: {formatTime(event.eventTime)}</Card.Text>
                <Card.Text>Location: {event.eventLocation}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <div className="d-flex justify-content-between">
                  <Button
                    variant="primary"
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowModal(true);
                    }}
                    style={{ borderRadius: '20px', width: '100%', height: '100%' }}
                  >
                    View Details
                  </Button>
                </div>
                <div className="text-center mt-2">
                  <Link to={`/events/${event.eventId}/book`}>
                    <Button variant="success" style={{ borderRadius: '20px', width: '100%' }}>
                      Book Now
                    </Button>
                  </Link>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Event Details</Modal.Title>
        </Modal.Header>
        {selectedEvent && (
          <Modal.Body>
            <h5>{selectedEvent.eventName}</h5>
            <p>Date: {formatDate(selectedEvent.eventDate)}</p>
            <p>Time: {formatTime(selectedEvent.eventTime)}</p>
            <p>Location: {selectedEvent.eventLocation}</p>
            <p>Description: {selectedEvent.eventDescription}</p>
            <p>Category: {selectedEvent.eventCategory}</p>
            <p>Registration Deadline: {formatDate(selectedEvent.registrationDeadline)}</p>
            <p>Max Attendees: {selectedEvent.maxAttendees}</p>
            <p>Ticket Price: ${selectedEvent.ticketPrice}</p>
            <Link to={`/events/${selectedEvent.eventId}/book`} className="mt-2">
              <Button variant="success" style={{ borderRadius: '20px', width: '100%' }}>
                Book Now
              </Button>
            </Link>
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Home;
