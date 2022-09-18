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
		this.router.get('/joined/month' ,userController.allMonthlyJoinedUsers)

		this.router.post(
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
			ensureAuthenticated,
			userController.currentUser
		);
		
		this.router.get('/:userId' ,userController.userById)

		this.router.get('/me/details',ensureAuthenticated, userController.details)

		this.router.post(
			'/',
			userController.create
		);

		this.router.put(
			'/:userId/setAdmin',
			userController.setAdmin
		);

		this.router.get(
			'/verify/:token',
			userController.verifyEmail
		);

		this.router.post('/login', ensureNotLoggedIn, userController.login);
		this.router.post('/logout', ensureAuthenticated, userController.logout);

		this.router.get('/role/user',
		    ensureAuthenticated,
			ensureAccessLevel(Role.ADMIN),
			userController.getRoleUser);

		this.router.get('/role/admin',
			ensureAuthenticated,
			ensureAccessLevel(Role.ADMIN),
			userController.getRoleAdmin);

		this.router.put('/:userId/promote',
			ensureAuthenticated,
			ensureAccessLevel(Role.ADMIN),
			userController.promote);

		this.router.put('/:userId/demote',
			ensureAuthenticated,
			ensureAccessLevel(Role.ADMIN),
			userController.demote);

		
		this.router.delete('/:userId', userController.delete);
		this.router.put('/me/password' , ensureAuthenticated , userController.updateUserPassword);
		this.router.put('/me' , ensureAuthenticated , userController.updateCurrentUser);
		this.router.delete('/Account/me' , ensureAuthenticated , userController.deleteMyAccount);
		
	}
}

export default new AdminRouter();