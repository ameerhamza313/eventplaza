// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { Container, Card, Form, Button } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

// const EventDetails = () => {
//   const { eventId } = useParams();
//   const [event, setEvent] = useState(null);
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');

//   useEffect(() => {
//     const fetchEventDetails = () => {
//       axios.get(`http://localhost:5000/api/events/${eventId}`)
//         .then((response) => {
//           setEvent(response.data);
//         })
//         .catch((error) => {
//           console.error('Error fetching event details:', error);
//         });
//     };

//     fetchEventDetails();
//   }, [eventId]);

//   const handleFormSubmit = (e) => {
//     e.preventDefault();

//     // Perform ticket booking logic here
//     // You can send the user's name and email to the server or perform any other action

//     // For now, let's just show an alert
//     alert(`Thank you, ${name}, for booking a ticket for ${event.eventName}!`);
//   };

//   if (!event) {
//     return <div>Loading...</div>;
//   }

//   // Format event time to AM/PM format
//   const formattedEventTime = new Date(event.eventTime).toLocaleTimeString('en-US', {
//     hour: 'numeric',
//     minute: 'numeric',
//     hour12: true,
//   });

//   return (
//     <Container>
//       <h1 className="mt-4">{event.eventName}</h1>
//       <Card className="mt-4">
//         {event.imageUrl && <Card.Img variant="top" src={event.imageUrl} alt={event.eventName} />}
//         <Card.Body>
//           <Card.Title>Date: {event.eventDate}</Card.Title>
//           <Card.Text>Time: {formattedEventTime}</Card.Text>
//           <Card.Text>Location: {event.eventLocation}</Card.Text>
//           <Card.Text>Description: {event.eventDescription}</Card.Text>
//           <Card.Text>Category: {event.eventCategory}</Card.Text>
//           <Card.Text>Registration Deadline: {event.registrationDeadline}</Card.Text>
//           <Card.Text>Max Attendees: {event.maxAttendees}</Card.Text>
//           <Card.Text>Ticket Price: ${event.ticketPrice}</Card.Text>
//           {/* Add more event details here */}
//           <Form onSubmit={handleFormSubmit}>
//             <Form.Group controlId="name">
//               <Form.Label>Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Enter your name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//               />
//             </Form.Group>
//             <Form.Group controlId="email">
//               <Form.Label>Email</Form.Label>
//               <Form.Control
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </Form.Group>
//             <Button variant="primary" type="submit">
//               Book Tickets
//             </Button>
//           </Form>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };

// export default EventDetails;
