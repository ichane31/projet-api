import { Request, Response } from 'express';
import moment, { duration } from 'moment';
import { BadRequestException } from '../error/BadRequestException.error';
import { User } from '../model/user';
import userService from '../service/user.service';
import jwtService from '../service/jwt.service';
import passwordService from '../service/password.service';
import { Role } from '../types/role.enum';
import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotFoundException } from '../error/NotFoundException.error';
import emailService from '../service/email.service';
import { IUser } from '../types/user.interface';
import htmlService from '../service/html.service';
import { config } from '../config/env.config';
import { IPasswordPayload } from '../types/passwordpayload.interface';
import path from 'path';
import { Files } from '../model/files';
import fileService from '../service/file.service';
import { PostUserDTO } from '../dto/post.user.dto';
import { PutUserDTO } from '../dto/put.user.dto';
import { LoginDTO } from '../dto/login.dto';
import { IEmail } from '../types/email.interface';
import { UnauthorizedError } from '../error/UnauthorizedError.error';

@ApiTags('User')
@Controller('api/v1/user')
export class UserController {
	@Get('/me')
	@ApiOperation({ description: 'get information about the current user (session)' })
	public async currentUser(req: Request, res: Response) {
		res.status(200).json(req.currentUser);
	}

	@Get('/admin')
	@ApiOperation({ description: 'get all admins' })
	public async getAdmins(req: Request, res: Response) {
		let user = await userService.getAdmins();
		if (!user.length) {
			let y = await userService.setAdmin();
			res.status(300).json(userService.presente(y, '', false));
		}
		res.status(200).json(user.map(e => userService.presente(e, '', false)));
	}

	@Put('/:userId/setAdmin')
	@ApiOperation({description: 'set user to  admin'})
	public async setAdmin(req:Request , res: Response){
		const {userId} = req.params;
		let user = await userService.setOneAdmin(Number(userId));
		res.status(200).json({message: 'Success user is promoted to admin' , user});
	}

	@Get('/')
	@ApiOperation({ description: 'get the ist of all users' })
	public async allUsers(req: Request, res: Response) {
		// let defaultImage = await fileService.getDefaultImage();
		res.status(200).json((await userService.getAll()).map((user) => userService.presente(user , '' ,false)));
	}

	@Get('/active')
	@ApiOperation({ description: 'get the list of active users' })
	public async allActiveUsers(req: Request, res: Response) {
		// let defaultImage = await fileService.getDefaultImage();
		res.status(200).json((await userService.getAll()).filter(x => {
			return (new Date()).getTime() - x.active.getTime() < 24 * 60 * 60 * 1000;
		}).map((user) => userService.presente(user , '' , true)));
	}

	@Get('/joined')
	@ApiOperation({ description: 'get the list of recently joined users' })
	public async allJoinedUsers(req: Request, res: Response) {
		// let defaultImage = await fileService.getDefaultImage();
		res.status(200).json((await userService.getAll()).filter(x => {
			return (new Date()).getTime() - x.createdAt.getTime() < 24 * 60 * 60 * 1000;
		}).map((user) => userService.presente(user , '' , true)));
	}

	@Get('/joined/month')
	@ApiOperation({ description: 'get the list of users joined this monyh' })
	public async allMonthlyJoinedUsers(req: Request, res: Response) {
		// let defaultImage = await fileService.getDefaultImage();
		res.status(200).json((await userService.getAll()).filter(x => {
			return (new Date()).getTime() - x.createdAt.getTime() < 30*24*60*60*1000;
		}).map((user) => userService.presente(user , '' , true)));
	}


	@Post('/')
	@ApiBody({
		type: PostUserDTO,
		description: 'user credentials',
	})
	@ApiOperation({ description: 'request an email verification link to create new user account', })
	public async create(req: Request, res: Response) {
		const { email, password, firstname, lastname } = req.body;

		if (!email || !password || !firstname || !lastname) {
			throw new BadRequestException('Missing required fields');
		}

		if (!/^[\w\-\.]+@[\w\-]+\.[\.a-z]+$/.test(email.trim().toLowerCase())) {
			throw new BadRequestException(`email ${email} must be a valid email address`);
		}

		if (password.length < 8 || /^[\w]+$/.test(password)) {
			throw new BadRequestException(`password must be at least 8 characters long with one special character at least`);
		}

		if (await userService.getByEmail(email)) {
			throw new BadRequestException('Email already exists');
		}

		let link = config.origin + 'api/v1/user/verify/' + jwtService.signUser({
			email,
			password: await passwordService.hashPassword(password),
			firstname, lastname
		});
		await emailService.sendMail(
			htmlService.createLink(link, 'Verifier votre compte mail'),
			email,
			'Confirmer votre inscription sur notre plateforme labLib_Projets ');
		res.status(200).json({ message: "un email vous a éte envoyé  account" });
	}

	@Get('/verify/:token')
	@ApiOperation({ description: 'create a new user account after the verification process has completed' })
	public async verifyEmail(req: Request, res: Response) {
		let { token } = req.params, body: IUser;
		try {
			body = jwtService.verifyAccount(token);
		} catch (err) {
			throw new BadRequestException('Invalid token');
		}
		if (await userService.getByEmail(body.email)) {
			throw new BadRequestException('Email is already verified');
		}
		const user = new User();
		user.email = body.email;
		user.password = body.password;
		user.firstname = body.firstname;
		user.lastname = body.lastname;

		if (req.files && req.files.image) {
			let image = req.files.image;
			const newImage = new Files();
			newImage.content = image.data;
			let $image = await fileService.create(newImage);
			user.image = $image.id;
		}

		const newUser = await userService.create(user);
		res.status(200).redirect('https://projet-api-frontend.herokuapp.com/Login');
	}

	@Get('/resetpassword')
	@ApiOperation({ description: 'request a reset password link to be sent to your mailbox' })
	public async resetPassword(req: Request, res: Response) {
		const { email } = req.body;
		if (!email) throw new BadRequestException('Invalid email address :' + email);
		const user = await userService.getByEmail(email);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		let link = config.origin + 'api/v1/user/resetpassword/' + jwtService.signPassword({ userId: user.id, key: user.password } as IPasswordPayload);
		emailService.sendMail(
			htmlService.createLink(link, 'click to reset your password'),
			user.email,
			'Reset Your LabLib-projets Password');
		return res.status(200).json({ message: 'email sent to you mailbox' });
	}

	@Get('/resetpassword/:token')
	@ApiOperation({ description: ' get access to reset your password' })
	public async resetPasswordPage(req: Request, res: Response) {
		let { token } = req.params, body: IPasswordPayload;
		try {
			body = jwtService.verifyPassword(token);

		} catch (err) {
			throw new BadRequestException('Invalid token');
		}

		let { userId } = body;
		const user = await userService.getById(userId);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		
		res.status(200).send(`<html lang="fr">
		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title> Reinitialiser le mot de passe </title>
		</head>
		<body>
			<form method="post" action="./${token}">
				<input type="password" name="password" placeholder="Entrer votre nouveau mot de passe " required>
				<input type="password" name="confirm" placeholder="Re-entrer votre nouveau mot de passe" required>
				<input type="submit" value="Confirm" />
			</form>
		</body>
		</html>`);
	}

	@Get('/changeemail/:token')
	@ApiOperation({ description: ' get access to change your email' })
	public async changeEmail(req: Request, res: Response) {
		let { token } = req.params, body: IEmail;
		try {
			body = jwtService.verifyEmail(token);

		} catch (err) {
			throw new BadRequestException('Invalid token');
		}

		let { id } = body;
		const user = await userService.getById(id);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		user.email = body.email;
		let updatedUser = userService.update(id, user);
		res.status(200).json({ message: 'Email updated successfully' }).redirect('https://projet-api-frontend.herokuapp.com/');
	}

	@Post('/resetpassword/:token')
	@ApiOperation({ description: 'request to change password via link sent to the email' })
	public async getPassword(req: Request, res: Response) {
		let { password } = req.body;
		let { token } = req.params, body: IPasswordPayload;
		try {
			body = jwtService.verifyPassword(token);

		} catch (err) {
			throw new BadRequestException('Invalid token');
		}

		let { userId } = body;
		const user = await userService.getById(userId);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		user.password = await passwordService.hashPassword(password);
		await userService.update(userId, user);
		res.status(200).json({ message: "password updated successfully" }).redirect('https://projet-api-frontend.herokuapp.com/Login');
	}

	@Get('/:userId')
	@ApiOperation({ description: 'get information about a specific user' })
	public async userById(req: Request, res: Response) {
		const userId = Number(req.params.userId);
		res.status(200).json({ ...await userService.getById(userId), password: undefined, favorites: undefined });
	}

	@Post('/login')
	@ApiBody({
		type: LoginDTO,
		description: 'informations to authenticate user',
	})
	@ApiOperation({ description: 'authentication as a specific user' })
	public async login(req: Request, res: Response) {
		const { email, password } = req.body;

		const user = await userService.getByEmail(email);

		if (!user) {
			throw new BadRequestException('Invalid user');
		}

		const isPasswordValid = await passwordService.comparePassword(
			password,
			user.password
		);

		if (!isPasswordValid) {
			throw new BadRequestException('Invalid password');
		}

		const token = jwtService.sign({
			userId: user.id,
			role: user.role as Role
		});

		const $token = jwtService.signRefresh({
			userId: user.id,
			role: user.role as Role,
			v : user.isAdmin ? 1: 0
	    });
		
		
		
		res.cookie("refresh-auth", "Refresh  " + $token, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 7,
			sameSite: "none",
			secure: true,
		    path:'',
		});

		// res.setHeader('x-access-token', 'Bearer ' + token);
		// res.setHeader('authorization', 'Bearer ' + token);
		
		
		user.active = new Date();

		

		await userService.update(user.id, user);
		
		let exp : number;

		try {
			exp = ( jwtService.verify(token)).exp;
		}catch (err) {
            
		}
		res.status(200).json({ ...user, password: undefined, favorites: undefined, likes: undefined, token  ,$token, exp});
		
	}

	@Post('/logout')
	@ApiOperation({ description: 'close the session' })
	public async logout(req: Request, res: Response) {
		/*req.session.access_token = undefined;*/
		res.clearCookie('refresh-auth');
		
		res.status(200).json();
	}

	@Get('/me/details')
	@ApiOperation({ description: 'get detailed informations about the current user' })
	public async details(req: Request, res: Response) {
		const user = await userService.getById(req.currentUser?.userId!);
		if (!user) throw new NotFoundException('this user isnt valid :(' + JSON.stringify(user) +')');
		// let defaultImage = await fileService.getDefaultImage();
		
		const userNoPassword = { ...userService.presente(user , '' , true) , favorites: user.favorites?.length , likes: user.likes?.length };
		res.status(200).json(userNoPassword);
	}

	@Put('/:userId/promote')
	public async promote(req: Request, res: Response) {
		const { userId } = req.params;
		const user = await userService.getById(Number(userId));

		if (!user) {
			throw new NotFoundException('User not found');
		}

		user.role = Role.ADMIN;
		user.isAdmin = true;
		const updatedUser = await userService.update(Number(userId), user);

		return res.status(200).json(userService.presente(updatedUser , '' ,true) );
	}

	@Put('/:userId/demote')
	public async demote(req: Request, res: Response) {
		const { userId } = req.params;
		const user = await userService.getById(Number(userId));

		if (!user) {
			throw new NotFoundException('User not found');
		}

		user.role = Role.USER;
		user.isAdmin = false;
		const updatedUser = await userService.update(Number(userId), user);

		return res.status(200).json(userService.presente(updatedUser , '' , true));
	}

	@Get('/refresh')
	public async refreshToken(req: Request, res: Response) {
		if (req.currentUser.refresh == 2) throw new UnauthorizedError('Not available for this auth method')
		const user = await userService.getById(Number(req.currentUser.userId));
		let { firstname, lastname, id } = user;
		let token = jwtService.sign({
			userId: user.id,
			role: user.role
		});
		let exp: number;
		let $token = req.headers['authorization'].split(' ').slice(1).join('');
		try {
			exp = ( jwtService.verify(token)).exp;
		} catch (_) { }
		res.status(200).json({ firstname, lastname, id, token, exp , $token });
	}

	@Get('/role/admin')
	public async getRoleAdmin(req: Request, res: Response) {
		res.status(200).json((await userService.getAll()).map((user) => ({ ...user, password: undefined })).filter(x => (x.role === Role.ADMIN)));
	}

	@Get('/role/user')
	public async getRoleUser(req: Request, res: Response) {
		res.status(200).json((await userService.getAll()).map((user) => ({ ...user, password: undefined })).filter(x => (x.role === Role.USER)));
	}


	@Put('/me')
	@ApiBody({
		type: PutUserDTO,
		description: 'infos to be updated',
	})
	@ApiOperation({ description: 'update information about the current user' })
	public async updateCurrentUser(req: Request, res: Response) {
		let { email, firstname, lastname, password, currentPassword ,country } = req.body;
		const user = await userService.getById(req.currentUser.userId);

		firstname && (user.firstname = firstname);
		lastname && (user.lastname = lastname);
		country && (user.country = country);


		if (email || password) {
			if (!currentPassword) {
				throw new BadRequestException ('current password must be provided');
			}
			let isPasswordValid = await passwordService.comparePassword(currentPassword , user.password);

			if(!isPasswordValid) {
				throw new BadRequestException('Invalid password');
			}

			if(email && user.email !=email) {
				email = email.toLowerCase();
				if(!/^[\w\-\.]+@[\w\-]+\.[\.a-z]+$/.test(email.trim().toLowerCase())) {
					throw new BadRequestException(`email ${email} must be a valid email address`);
				}

				let isUsed = await userService.getByEmail(email);
				if (isUsed ) {
					throw new BadRequestException('email already in use');
				}

				let token  = jwtService.signEmail({
					id : user.id ,
					email
				});
				emailService.sendMail(htmlService.createLink(config.origin 	+ 'api/v1/user/changeemail/' + token , 'change your email address') , email , 'Change password for your lablib-projets account');
			}

			if(password) {
				if (password.length < 8 || /^[\w]+$/.test(password))
					throw new BadRequestException(`password must be at least 8 characters long with one special character at least`);
				user.password = await passwordService.hashPassword(password);
			}
		}

		if (req.files && req.files.image) {
			let image = req.files.image;
			await fileService.delete(user.image);
			const newImage = new Files();
			newImage.content = image.data;
			let $image = await fileService.create(newImage);
			user.image = $image.id;
		}

		const updatedUser = await userService.update(req.currentUser.userId, user);
		return res.status(200).json(userService.presente(updatedUser , '' , true));
	}

	@Put('/me/Image')
	@ApiBody({
		description: 'Update user profile image',
	})
	@ApiOperation({ description: 'update profile image for the current user' })
	public async updateProfileImage(req: Request, res: Response) {
		const userId = req.currentUser.userId;

		let user = await userService.getById(userId);
		if (!user) {
			throw new NotFoundException('User not found');	
		}

		if (req.files && req.files.image) {
			let image = req.files.image;
			await fileService.delete(user.image);
			const newImage = new Files();
			newImage.content = image.data;
			let $image = await fileService.create(newImage);
			user.image = $image.id;
		}

		await userService.update(userId, user);
		return res.status(200).json({message :'success'})
	}

	@Delete('/:userId')
	public async delete(req: Request, res: Response) {
		const { userId } = req.params;

		const user = await userService.getById(Number(userId));

		if (!user)
			throw new NotFoundException('User not found');

		await userService.delete(Number(userId));

		return res.status(200).json({});
	}

	@Delete('/Account/me')
	@ApiOperation({ description : 'delete my account'})
	public async deleteMyAccount(req: Request , res: Response) {
		const userId  = req.currentUser.userId;
		const {password} = req.body;
		const user = await userService.getById(userId);
		if(!user) {
		    throw new NotFoundException('User not found');
		}

		if(!password) {
			throw new BadRequestException('Password is required');	
		}

		const verifyPassword = await passwordService.comparePassword(password , user.password);
		if(!verifyPassword) {
			throw new UnauthorizedError('password incorrect');	
		}

		await userService.delete(userId);

		return res.status(200).json({message : 'Account successfully deleted.'})
	}

	@Delete('/me/image')
	@ApiOperation({ description: 'remove user\'s image' })
	public async deleteUserProfileImage(req: Request, res: Response) {
		const userId  = req.currentUser.userId;

		const user = await userService.getById(userId);
		if (!user)
			throw new NotFoundException('User not found');

		let image = await fileService.getById(user.image);
		if (image) await fileService.delete(image.id);
		user.image = null;
		return res.status(200).json({message:'Image deleted'});
	}

	
	}

export default new UserController();