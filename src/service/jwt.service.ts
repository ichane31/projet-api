import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config/env.config';
import { IPayload } from '../types/jwtpayload.interface';
import { IPasswordPayload } from '../types/passwordpayload.interface';
import { IUser } from '../types/user.interface';
import {IEmail} from '../types/email.interface'
import {IRPayload } from '../types/jwtpayload.r.interface';


class JwtService {
	constructor(private readonly options?: SignOptions) { }

	public sign(payload: IPayload): string {
		return jwt.sign(payload, config.JWT_SECRET!, {
			expiresIn : '30min'
		});
	}

	// public signRefresh (payload: IRPayload) : string {
	// 	return jwt.sign(payload , config.SESSION_SECRET!)
	// }
 	public signUser(user: IUser): string {
		return jwt.sign(user, config.JWT_SECRET!, this.options);
	}
	public signEmail(email: IEmail): string {
		return jwt.sign(email, config.JWT_SECRET!, this.options);
	}
	public signPassword(password: IPasswordPayload): string {
		return jwt.sign(password, config.JWT_SECRET!, {
			expiresIn: '15min'
		});
	}

	public verify(token: string): IPayload {
		return jwt.verify(token, config.JWT_SECRET!, this.options) as IPayload;
	}

	// public verifyRefresh(token: string): IPayload {
	// 	return jwt.verify(token, config.SESSION_SECRET!, this.options) as IPayload;
	// }
	public verifyAccount(token: string): IUser {
		return jwt.verify(token, config.JWT_SECRET!, this.options) as IUser;
	}
	public verifyEmail(token: string): IEmail {
		return jwt.verify(token, config.JWT_SECRET!, this.options) as IEmail;
	}
	public verifyPassword(token: string): IPasswordPayload {
		return jwt.verify(token, config.JWT_SECRET!, this.options) as IPasswordPayload;
	}
	public signRefreshToken(payload: IPayload): string {
		return jwt.sign(payload, config.JWT_SECRET!, {
			...this.options,
			expiresIn: '90d',
		});
	}


}

export default new JwtService({
	expiresIn: '1d',
});