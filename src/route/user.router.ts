import { Router } from 'express';
import userController from '../controller/user.controller';
import { decodeUser } from '../middleware/decodeuser.middleware';
import { ensureAccessLevel } from '../middleware/ensureAccessLevel';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated.middleware';
import { ensureNotLoggedIn } from '../middleware/ensureNotLoggedIn.middleware';
import { Role } from '../types/role.enum';

class AdminRouter {
	public router: Router;

	constructor() {
		this.router = Router();
		this.routes();
	}

	private routes() {

		this.router.get(
			'/',
			userController.allUsers
		);

		this.router.get(
			'/active',
			userController.allActiveUsers
		);

		this.router.get(
			'/joined',
			userController.allJoinedUsers
		);

		this.router.get(
			'/resetpassword',
			userController.resetPassword
		);

		this.router.get(
			'/resetpassword/:token',
			userController.resetPasswordPage
		);
		this.router.post(
			'/resetpassword/:token',
			userController.getPassword
		);

		this.router.get(
			'/changeemail/:token',
			userController.changeEmail
		);

		this.router.get(
			'/me',
			decodeUser,
			userController.currentUser
		);

		this.router.put(
			'/me',
			decodeUser,
			userController.updateCurrentUser
		);

		this.router.get(
			'/me/details',
			decodeUser,
			userController.details
		);


		this.router.post(
			'/',
			userController.create
		);

		this.router.get(
			'/verify/:token',
			userController.verifyEmail
		);

		this.router.post('/login', ensureNotLoggedIn, userController.login);
		this.router.post('/logout', decodeUser, userController.logout);

		this.router.get('/role/user',
		decodeUser,
			ensureAccessLevel(Role.ADMIN),
			userController.getRoleUser);

		this.router.get('/role/admin',
		decodeUser,
			ensureAccessLevel(Role.ADMIN),
			userController.getRoleAdmin);

		this.router.put('/:userId/promote',
		      decodeUser,
			ensureAccessLevel(Role.ADMIN),
			userController.promote);

		this.router.put('/:userId/demote',
			decodeUser,
			ensureAccessLevel(Role.ADMIN),
			userController.demote);

		this.router.get(
			'/:userId',
			decodeUser,
			userController.userById
		);
		this.router.delete('/:userId', userController.delete);
		
	}
}

export default new AdminRouter();