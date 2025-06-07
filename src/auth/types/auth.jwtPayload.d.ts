export type AuthJwtPayload = {
  sub: string;
};

export interface AuthenticatedRequest extends Request {
  user: User; // or your specific user type
}
