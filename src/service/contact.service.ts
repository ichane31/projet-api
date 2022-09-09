import { DeleteResult, Repository } from 'typeorm';
import { PostgresDataSource } from '../config/datasource.config';
import { Contact } from '../model/contact';
import { Injectable } from '@nestjs/common';
import { NotFoundException } from '../error/NotFoundException.error';

@Injectable()
export class ContactService {
    private contactRepository: Repository<Contact>;

    constructor() {
		this.contactRepository = PostgresDataSource.getRepository(Contact);
	}

    public async update(contactId: number, contact: Contact) {
		return this.contactRepository.save({ ...contact, id: contactId });
	}

    public async getAll(): Promise<Contact[]> {
		return this.contactRepository.find({
			relations: ['user']
		});
	}

    public async getContacts(userId : number) : Promise<Contact[]> {
        return (await this.getAll()).filter(x => x.user?.id === userId);
    }

    public async  create(contact: Contact): Promise<Contact> {
        let save: Promise<Contact>;
		try {
			save = this.contactRepository.save(contact);
		} catch (err) {
			console.error(err);
		}
		return save;
    }

	public async getById(id: number): Promise<Contact | null> {
        return this.contactRepository.findOne( { where: { id }, 
            relations:['user']},
            );
    }

    public async delete(id: number): Promise<DeleteResult> {
        return await this.contactRepository.delete(id);
    }
}

export default new ContactService();