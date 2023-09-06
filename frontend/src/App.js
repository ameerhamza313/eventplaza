import React from 'react';
import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import AppNavbar from './components/Navbar'
import Home from "./components/Home";
import ErrorPage from './components/ErrorPage';
import CreateEvent from './components/CreateEvent';
import EventDetails from './components/EventDetails';
import ManageEvent from './components/ManageEvent';
import Event from './components/Event';
import EditEvent from './components/EditEvent';
import BookTickets from './components/BookTicket';


function App() {
  return (
    <>
    <AppNavbar />
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/events" element={<Event />} />
        <Route path="/events/:eventId/book" element={<BookTickets />} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        <Route path="/manage" element={<ManageEvent />} />
        <Route path="/events/:eventId/edit" element={<EditEvent />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  )
}

export default App