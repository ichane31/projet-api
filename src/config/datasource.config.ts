import { DataSource } from 'typeorm';
import { User } from '../model/user';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { config } from './env.config';
import { Category } from '../model/category';
import { Projet } from '../model/projet';
import { Comment } from '../model/comment';
import { Note } from '../model/note';
import { Files } from '../model/files';
import {SessionContainer} from '../model/session';
import { Contact } from '../model/contact';

 

const PostgresDataSource = new DataSource({
	name: 'default',
	type: 'postgres',
	url: config.DB_URL,
	entities: [User,  Category,  Projet,Comment,Note ,Files ,  SessionContainer, Contact],
	ssl: config.NODE_ENV == 'development' ? undefined : {
		rejectUnauthorized: false
	},
	namingStrategy: new SnakeNamingStrategy(),
	synchronize : true
});

export { PostgresDataSource };