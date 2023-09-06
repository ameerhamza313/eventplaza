import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const BookTicket = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    ticketQuantity: 1,
  });
  const [bookingId, setBookingId] = useState('');
  const [qrCodeData, setQRCodeData] = useState('');
  const [bookingCompleted, setBookingCompleted] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = () => {
    axios.get(`http://localhost:5000/api/events/${eventId}`)
      .then((response) => {
        setEvent(response.data);
      })
      .catch((error) => {
        console.error('Error fetching event details:', error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the booking data
    const bookingData = {
      eventName: event?.eventName,
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      ticketQuantity: formData.ticketQuantity,
    };

    try {
      // Send booking data to the server
      const response = await axios.post('http://localhost:5000/send-email', bookingData);
      const generatedBookingId = response.data.bookingId;

      setBookingId(generatedBookingId);
      generateQRCode(generatedBookingId);
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        ticketQuantity: 1,
      });
      setBookingCompleted(true);
    } catch (error) {
      console.error('Error sending email and saving booking:', error);
    }
  };

  const generateQRCode = async (generatedBookingId) => {
    try {
      const response = await axios.get(`http://localhost:5000/qrcode/${generatedBookingId}`);
      setQRCodeData(response.data);
    } catch (error) {
      console.error('Error fetching QR code:', error);
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header className="text-center">
              <h1>{event?.eventName}</h1>
            </Card.Header>
            <Card.Body>
              {bookingCompleted ? (
                <Alert variant="success">
                  <Alert.Heading>Booking Successful!</Alert.Heading>
                  <p>Your booking ID: {bookingId}</p>
                  <div className="text-center">
                    <img src={qrCodeData} alt="QR Code" className="img-fluid" />
                  </div>
                </Alert>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formFullName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formPhoneNumber">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formTicketQuantity">
                    <Form.Label>Ticket Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter ticket quantity"
                      value={formData.ticketQuantity}
                      onChange={(e) => setFormData({ ...formData, ticketQuantity: e.target.value })}
                      min={1}
                      required
                    />
                  </Form.Group>
                  <div className="text-center">
                    <Button variant="primary" type="submit">
                      Book Now
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookTicket;
