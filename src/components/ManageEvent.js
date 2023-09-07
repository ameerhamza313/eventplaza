import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Row, Col, Modal, Table } from 'react-bootstrap';

const ManageEvent = () => {
  const [events, setEvents] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    fetchEvents();
    fetchAttendees();
  }, []);

  const fetchEvents = () => {
    axios.get('https://backend-6ezq.onrender.com/api/events')
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  };

  const fetchAttendees = () => {
    axios.get('https://backend-6ezq.onrender.com/api/attendees')
      .then((response) => {
        setAttendees(response.data);
      })
      .catch((error) => {
        console.error('Error fetching attendees:', error);
      });
  };

  const handleDeleteEvent = (eventId) => {
    setShowDeleteModal(true);
    setSelectedEventId(eventId);
  };

  const confirmDeleteEvent = () => {
    if (selectedEventId) {
      axios.delete(`https://backend-6ezq.onrender.com/api/events/${selectedEventId}`)
        .then(() => {
          setShowDeleteModal(false);
          setSelectedEventId(null);
          fetchEvents();
          alert('Event deleted successfully!');
        })
        .catch((error) => {
          console.error('Error deleting event:', error);
          alert('Failed to delete event. Please try again.');
        });
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedEventId(null);
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Manage Events</h1>
      <Row>
        <Col md={6}>
          <div className="mb-5">
            <h2>Manage Attendees</h2>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Ticket Quantity</th>
                </tr>
              </thead>
              <tbody>
                {attendees.map((attendee) => (
                  <tr key={attendee.bookingId}>
                    <td>{attendee.bookingId}</td>
                    <td>{attendee.fullName}</td>
                    <td>{attendee.email}</td>
                    <td>{attendee.phoneNumber}</td>
                    <td>{attendee.ticketQuantity}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
        <Col md={6}>
          <h2>Upcoming Events</h2>
          <Row>
            {events.map((event) => (
              <Col key={event.eventId} sm={6} xs={12} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{event.eventName}</Card.Title>
                    <Card.Text>Date: {event.eventDate}</Card.Text>
                    <Card.Text>Location: {event.eventLocation}</Card.Text>
                  </Card.Body>
                  <Card.Footer className="text-center">
                    <Link to={`/events/${event.eventId}/edit`} className="btn btn-warning btn-sm mx-1">
                      Edit
                    </Link>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteEvent(event.eventId)}
                      className="btn-sm mx-1"
                    >
                      Delete
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* Delete Event Modal */}
      <Modal show={showDeleteModal} onHide={closeDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this event?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteEvent}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageEvent;
