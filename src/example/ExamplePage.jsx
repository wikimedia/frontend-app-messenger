import { Container } from '@openedx/paragon';
import { useEffect, useState } from 'react';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

const ExamplePage = () => {
  const [user, setUser] = useState('');
  useEffect(() => {
    setUser(getAuthenticatedUser());
  }, []);
  return (
    <main>
      <Container className="py-5">
        <h1>Example Page</h1>
        <p>Hello {user.username}!!</p>
      </Container>
    </main>
  );
};

export default ExamplePage;
