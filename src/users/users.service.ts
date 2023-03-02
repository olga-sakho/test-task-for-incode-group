import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(name: string, email: string, role: string, password: string, bossId?: number) {
    const user = this.repo.create({ name, email, role, password, bossId });

    return this.repo.save(user);
  }

  findOne(id: number) {
    if(!id) {
      return null
    }
    return this.repo.findOne({where: { id: id}});
  }

  find(email: string) {
    return this.repo.find({ where : {email: email} });
  }

  findAll(id: number) {
    return this.repo.find({ where : 
        {
          bossId: id
        }
    
    });
  }

  findAllForAdmin() {
    return this.repo.find();
  }

  findBoss(bossId: number) {
    return this.repo.findOne({ where : {id: bossId} });
  }

  async update(id: number, bossId: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    if (user.bossId !== bossId) {
      throw new ForbiddenException('You can only change your subordinates')
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.repo.remove(user);
  }
}