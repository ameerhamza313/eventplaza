import React from 'react';
import { Container, Alert } from 'react-bootstrap';

const ErrorPage = () => {
  return (
    <Container className="mt-5">
      <Alert variant="danger">
        <h2>Error 404</h2>
        <p>Oops! Something went wrong. Page Not Found.</p>
      </Alert>
    </Container>
  );
};

export default ErrorPage;
