import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Event = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    axios.get('https://backend-6ezq.onrender.com/api/events')
      .then((response) => {
        // Sort events by eventDate in ascending order
        const sortedEvents = response.data.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
        setEvents(sortedEvents);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
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
      <h1 className="my-4 text-center">Book Tickets</h1>
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
                <Card.Text>Category: {event.eventCategory}</Card.Text>
                <Card.Text>Description: {event.eventDescription}</Card.Text>
                <Card.Text>Registration Deadline: {formatDate(event.registrationDeadline)}</Card.Text>
                <Card.Text>Max Attendees: {event.maxAttendees}</Card.Text>
                <Card.Text>Ticket Price: ${event.ticketPrice}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <div className="text-center">
                  <Link to={`/events/${event.eventId}/book`}>
                    <Button variant="primary" style={{ borderRadius: '20px', width: '100%' }}>
                      Book Now
                    </Button>
                  </Link>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Event;
