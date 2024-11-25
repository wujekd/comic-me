// tokenValidator.js
import jwt from 'jsonwebtoken';

const secretKey = 'my-super-secret-key';

export const checkToken = (token) => {
  if (!token) {
    return false;
  }

  try {
    return jwt.verify(token, secretKey);

  } catch (error) {
    return false;
  }
};
