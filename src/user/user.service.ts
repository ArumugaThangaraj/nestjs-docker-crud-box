import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/createuser.dto.';
import { UpdateUserDto } from './dto/updateuser.dto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) { }

    // Get all users
    async findAll() {
        return this.userRepo.find()
    }

    // get one user
    async findOne(id: number) {
        const user = await this.userRepo.findOne({ where: { id } })

        if (!user) throw new NotFoundException("User not found");

        return user;
    }

    // create users
    async create(dto: CreateUserDto) {
        const newUser = this.userRepo.create(dto)
        return this.userRepo.save(newUser)
    }

    // update users
    async update(id: number, dto: UpdateUserDto) {
        const user = await this.userRepo.preload({
            id,
            ...dto,
        });
        if (!user) throw new NotFoundException("User not found");

        return this.userRepo.save(user)
    }

    // Delete users
    async delete(id: number) {
        const user = await this.userRepo.delete(id);
        if (user.affected === 0) throw new NotFoundException("User not found");

        return { message: "User deleted successfully" };
    }
}
