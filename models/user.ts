export default interface User {
  id?: number;
  username?: string; 
  name?: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: string;
  email?: string;
  is_verified?: boolean;
  sub?: string | null;
};