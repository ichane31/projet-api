import { Role } from './role.enum';

export interface IRPayload {
	userId: number;
	role: Role;
	tokenVersion : number;
}