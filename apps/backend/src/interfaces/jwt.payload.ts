import type { JwtPayload } from 'jsonwebtoken';
import { UserModel } from '../database/user.schema';

export const JWT_BASE_OPTIONS: JwtPayload = {};

export interface JwtPayloadTest extends JwtPayload {
  sub?: UserModel['username'];
}
