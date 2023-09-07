import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const CreateEvent = () => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  const [registrationDeadline, setRegistrationDeadline] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      eventName,
      eventDate,
      eventTime,
      eventLocation,
      eventDescription,
      eventCategory,
      registrationDeadline,
      maxAttendees,
      ticketPrice,
    };

    axios.post('https://backend-6ezq.onrender.com/api/events', newEvent)
      .then((response) => {
        console.log('Event created:', response.data);
        alert('Event created successfully!');
        setEventName('');
        setEventDate('');
        setEventTime('');
        setEventLocation('');
        setEventDescription('');
        setEventCategory('');
        setRegistrationDeadline('');
        setMaxAttendees('');
        setTicketPrice('');
      })
      .catch((error) => {
        console.error('Error creating event:', error);
        alert('Failed to create event. Please try again.');
      });
  };

  return (
    <Container style={{ margin: '20px auto', maxWidth: '600px', padding: '20px', boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Create New Event</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="eventName">
          <Form.Label>Event Name</Form.Label>
          <Form.Control
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="eventDate">
          <Form.Label>Event Date</Form.Label>
          <Form.Control
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </Form.Group>

        <Row>
          <Col xs={12} md={6}>
            <Form.Group controlId="eventTime">
              <Form.Label>Event Time</Form.Label>
              <Form.Control
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group controlId="eventLocation">
              <Form.Label>Event Location</Form.Label>
              <Form.Control
                type="text"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="eventDescription">
          <Form.Label>Event Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="eventCategory">
          <Form.Label>Event Category</Form.Label>
          <Form.Control
            as="select"
            value={eventCategory}
            onChange={(e) => setEventCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="conference">Conference</option>
            <option value="workshop">Workshop</option>
            <option value="party">Party</option>
          </Form.Control>
        </Form.Group>

        <Row>
          <Col xs={12} md={6}>
            <Form.Group controlId="registrationDeadline">
              <Form.Label>Registration Deadline</Form.Label>
              <Form.Control
                type="date"
                value={registrationDeadline}
                onChange={(e) => setRegistrationDeadline(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group controlId="maxAttendees">
              <Form.Label>Maximum Attendees</Form.Label>
              <Form.Control
                type="number"
                value={maxAttendees}
                onChange={(e) => setMaxAttendees(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={6}>
            <Form.Group controlId="ticketPrice">
              <Form.Label>Ticket Price ($)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button variant="primary" type="submit">
            Create Event
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default CreateEvent;
