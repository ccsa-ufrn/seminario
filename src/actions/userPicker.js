import fetch from 'isomorphic-fetch';
import { application } from '../../config';

export function findUserByEmail(email, eventId) {
  const config = {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userEmail: email,
    }),
  };

  return fetch(`${application.url}/api/event/${eventId}/findUser`, config)
    .then(resp => resp.json());
}
