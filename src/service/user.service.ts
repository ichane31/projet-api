import { Repository } from 'typeorm';
import { PostgresDataSource } from '../config/datasource.config';
import { User } from '../model/user';

class UserService {

	private userRepository: Repository<User>;

	constructor() {
		this.userRepository = PostgresDataSource.getRepository(User);
	}

	public async update(userId: number, user: User) {
		return this.userRepository.save({ ...user, id: userId });
	}
	public async getAll(): Promise<User[]> {
		return this.userRepository.find();
	}

	public async getById(id: number): Promise<User | null> {
		return this.userRepository.findOne({ where: { id } });
	}

	public async create(user: User): Promise<User> {
		return this.userRepository.save(user);
	}

	public async getByEmail(email: string): Promise<User | null> {
		return this.userRepository.findOneBy({ email });
	}
}

export default new UserService();