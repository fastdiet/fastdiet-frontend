export default interface User {
  id?: number;
  username?: string; 
  name?: string;
  email?: string;
  is_verified?: boolean;
  sub?: string | null;
};