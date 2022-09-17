import { DeleteResult, Repository } from 'typeorm';
import { PostgresDataSource } from '../config/datasource.config';
import { User } from '../model/user';
import { Injectable } from '@nestjs/common';
import { Role } from '../types/role.enum';

@Injectable()
class UserService {

	private userRepository: Repository<User>;

	constructor() {
		this.userRepository = PostgresDataSource.getRepository(User);
	}
	public async getAdmins() {
		return this.userRepository.find({ where: { role: Role.ADMIN } })
	}

	public async setAdmin() {
		let user = await this.userRepository.findOne({
			order: { 'createdAt': 'ASC' }
		});
		console.log(user);
		if (user) {
			user.role = Role.ADMIN;
			return this.update(user.id, user);
		}
		return null;
	}

	public async setOneAdmin(id: number) {
		let user = await this.userRepository.findOne({where:{id} });

		if (user) {
			user.role = Role.ADMIN;
			user.isAdmin = true;
			return this.update(id, user);
		}
		return null;
	}

	public async update(userId: number, user: User) {
		return this.userRepository.save({ ...user, id: userId });
	}
	public async getAll(): Promise<User[]> {
		return this.userRepository.find({relations: ['favorites']});
	}

	public async getById(id: number): Promise<User | null> {
		return this.userRepository.findOne({ where: { id } , relations: ['favorites' ]});
	}
	
	public async getByIdWithDeepFavoriteBy(id: number): Promise<User | null> {
		return this.userRepository.findOne({ where: { id }, relations: ['favorites.favoritedBy.favorites']});
	}

	public async create(user: User): Promise<User> {
		return this.userRepository.save(user);
	}

	public async getByEmail(email: string): Promise<User | null> {
		return this.userRepository.findOneBy({ email });
	}
	public async delete(id: number): Promise<DeleteResult> {
		return this.userRepository.delete({ id });
	}

	public presente(user: User, image: string, admin: boolean) {
		return {
			...user,
			password: undefined,
			active: admin ? user.active : undefined,
			createdAt: admin ? user.createdAt : undefined,
			updatedAt: undefined,
			favorites: undefined,
			projets: undefined,
			image: user.image || image,
			likes: undefined,
			status :(new Date()).getTime() - user.active.getTime() < 300 * 1000 ? 'online' : 'offline',
		}
	}
}

export default new UserService();