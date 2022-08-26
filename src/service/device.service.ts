import { DeleteResult, Repository } from "typeorm";
import { PostgresDataSource } from "../config/datasource.config";
import { Device } from "../model/device";

export class DeviceService {

    private repository: Repository<Device>;

    constructor() {
        this.repository = PostgresDataSource.getRepository(Device);
    }

    public async update(id: string, device: Device) : Promise<Device>{
        return this.repository.save({ ...device, id });
    }
    public async getAll(): Promise<Device[]> {
        return this.repository.find({ relations: ['user'] });
    }

    public async getById(id: string): Promise<Device | null> {
        return this.repository.findOne({ where: { id }, relations: ['user'] });
    }

    public async create(device: Device): Promise<Device> {
        return this.repository.save(device);
    }
    public async delete(id: string): Promise<DeleteResult> {
        return this.repository.delete({ id });
    }
    public async getByDevice(device: string): Promise<Device | null> {
        return this.repository.findOne({ where: { identifier: device }, relations: ['user'] });
    }

    public presente(device: Device) {
        return {
            id: device.id,
            loggedIn: device.createdAt,
            platform: device.platform,
            lastSession: device.active,
            trusted: device.trusted
        }
    }
}

export default new DeviceService();