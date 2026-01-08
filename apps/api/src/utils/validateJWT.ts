import jwt from 'jsonwebtoken';
export const validateJWT = (token:string) => {

  if (!token) {
    return false
  }

  try {
    // Assuming you have a function to verify JWT
    const decoded = jwt.verify(
            token,
            process.env.JWT_REFRESH_TOKEN_SECRET as string
        ) as { id: string, role: string };
    return decoded;
  } catch (error) {
    return false;
  }
}
