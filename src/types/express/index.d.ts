declare namespace Express {
	export interface Request {
		currentUser?: {
			userId: number;
			role: number;
			exp?: number ;
			v? : number;
			refresh? : number;
		};
		session: {
			access_token?: string;
		};
		files?: any;
		
	}
}
