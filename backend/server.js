const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const nodemailer = require("nodemailer");
const qrcode = require("qrcode");
const path = require("path");

// const { createCanvas } = require('canvas');

const app = express();
const PORT = process.env.PORT || 5000;

const EVENTS_FILE_PATH = path.join(__dirname, "events.json");
const BOOKINGS_FILE_PATH = path.join(__dirname, "bookings.json");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Function to read events from file
const readEventsFromFile = () => {
  try {
    const data = fs.readFileSync(EVENTS_FILE_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading events.json:", error);
    return [];
  }
};

// Function to write events to file
const writeEventsToFile = (events) => {
  fs.writeFileSync(EVENTS_FILE_PATH, JSON.stringify(events, null, 2));
};

// Endpoint to handle event creation
app.post("/api/events", (req, res) => {
  const {
    eventName,
    eventDate,
    eventTime,
    eventLocation,
    eventDescription,
    eventCategory,
    registrationDeadline,
    maxAttendees,
    ticketPrice,
  } = req.body;

  if (
    !eventName ||
    !eventDate ||
    !eventLocation ||
    !eventDescription ||
    !eventCategory
  ) {
    return res
      .status(400)
      .json({
        error:
          "Event name, date, location, description, and category are required.",
      });
  }

  const events = readEventsFromFile();
  const newEvent = {
    eventId: events.length === 0 ? 1 : events[events.length - 1].eventId + 1,
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

  try {
    events.push(newEvent);
    writeEventsToFile(events);

    return res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({ error: "Failed to create event." });
  }
});

// Endpoint to update an event by eventId
app.put("/api/events/:eventId", (req, res) => {
  const { eventId } = req.params;
  const updatedEventData = req.body;

  try {
    let events = readEventsFromFile();

    const eventIndex = events.findIndex(
      (event) => event.eventId === parseInt(eventId)
    );
    if (eventIndex === -1) {
      return res.status(404).json({ error: "Event not found." });
    }

    events[eventIndex] = {
      ...events[eventIndex],
      ...updatedEventData,
    };
    writeEventsToFile(events);

    return res.status(200).json(events[eventIndex]);
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json({ error: "Failed to update event." });
  }
});

// Endpoint to fetch all events
app.get("/api/events", (req, res) => {
  const events = readEventsFromFile();
  return res.json(events);
});

// Endpoint to fetch a single event by eventId
app.get("/api/events/:eventId", (req, res) => {
  const { eventId } = req.params;

  const events = readEventsFromFile();
  const event = events.find((event) => event.eventId === parseInt(eventId));
  if (!event) {
    return res.status(404).json({ error: "Event not found." });
  }

  return res.json(event);
});

// Endpoint to delete an event by eventId
app.delete("/api/events/:eventId", (req, res) => {
  const { eventId } = req.params;

  try {
    let events = readEventsFromFile();

    events = events.filter((event) => event.eventId !== parseInt(eventId));
    writeEventsToFile(events);

    events.forEach((event, index) => {
      event.eventId = index + 1;
    });
    writeEventsToFile(events);

    return res.status(200).json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({ error: "Failed to delete event." });
  }
});

// Function to read bookings from file
const readBookingsFromFile = () => {
  try {
    const data = fs.readFileSync(BOOKINGS_FILE_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading bookings.json:", error);
    return [];
  }
};

// Function to write bookings to file
const writeBookingsToFile = (bookings) => {
  fs.writeFileSync(BOOKINGS_FILE_PATH, JSON.stringify(bookings, null, 2));
};

// Configure Nodemailer to use Gmail
app.post("/send-email", async (req, res) => {
  try {
    const { fullName, email, phoneNumber, ticketQuantity } = req.body;
    const bookingId = generateBookingId();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "ameerhamzakhalid313@gmail.com",
        pass: "lkdnpxyhbdnturcr",
      },
    });

    const qrCodeData = await generateQRCodeData(
      bookingId,
      fullName,
      email,
      ticketQuantity
    );

    const qrCodeCid = `qrcode-${Date.now()}`;

    const emailContent = {
      from: "ameerhamzakhalid313@gmail.com",
      to: email,
      subject: "Ticket Booking Confirmation",
      html: `
        <p>Hello ${fullName},</p>
        <p>Thank you for booking ${ticketQuantity} tickets. Your booking ID is: ${bookingId}</p>
        <p>Here's your QR code:</p>
        <img src="cid:${qrCodeCid}" alt="QR Code" />
        <p>Regards,</p>
        <p>The Event Team</p>
      `,
      attachments: [
        {
          filename: "qrcode.png",
          content: qrCodeData.split(";base64,").pop(),
          encoding: "base64",
          cid: qrCodeCid,
        },
      ],
    };

    await transporter.sendMail(emailContent);

    // Save booking data to bookings.json
    const bookingData = {
      bookingId,
      fullName,
      email,
      phoneNumber,
      ticketQuantity,
    };
    const bookingsFilePath = path.join(__dirname, "bookings.json");
    const existingBookings = fs.existsSync(bookingsFilePath)
      ? JSON.parse(fs.readFileSync(bookingsFilePath, "utf8"))
      : [];

    existingBookings.push(bookingData);
    fs.writeFileSync(
      bookingsFilePath,
      JSON.stringify(existingBookings, null, 2)
    );

    console.log("Email sent successfully");
    res.status(200).json({ bookingId });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
});

function generateBookingId() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let bookingId = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    bookingId += characters.charAt(randomIndex);
  }
  return bookingId;
}

const generateQRCodeData = async (
  bookingId,
  fullName,
  email,
  ticketQuantity
) => {
  const qrCodeText = JSON.stringify({
    bookingId,
    fullName,
    email,
    ticketQuantity,
  });

  try {
    const qrCodeData = await qrcode.toDataURL(qrCodeText);
    return qrCodeData;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
};

app.get("/qrcode/:bookingId", async (req, res) => {
  const { bookingId } = req.params;

  try {
    const qrCodeText = JSON.stringify({ bookingId });
    const qrCodeData = await generateQRCodeData(qrCodeText);
    res.send(qrCodeData);
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).send("Error generating QR code");
  }
});

// API endpoint for fetching quotes from the Forismatic API
app.get("/api/quotes", async (req, res) => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json",
      requestOptions
    );

    // Forismatic returns text, so we need to parse it
    const resultText = await response.text();
    const resultJson = JSON.parse(resultText); // Parse the text response to JSON

    // Return the JSON response to the client
    return res.json(resultJson);
  } catch (error) {
    console.error("Error fetching quote:", error);
    return res.status(500).json({ error: "Error fetching quote" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
