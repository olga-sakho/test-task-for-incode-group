import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { CreateUserDto } from "src/users/dtos/create-user.dto";

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signup(body: CreateUserDto) {

        const users = await this.usersService.find(body.email)
        if (users.length) {
            throw new BadRequestException('email in use')
        }
        if (body.role !== 'admin') {

            if(body.bossId == null) {
                throw new BadRequestException(
                    'Please enter bossId field. BossId must be a string.',
                  );
            }
            const boss = await this.usersService.findBoss(body.bossId)
            if (!boss) {
                throw new BadRequestException(
                  'Boss does not exist. Each user except the Administrator must have existing Boss',
                );
              }
        }

        const salt = randomBytes(8).toString('hex')

        const hash = (await scrypt(body.password, salt, 32)) as Buffer;

        const result = salt + '.' + hash.toString('hex');
        const user = await this.usersService.create(body.name, body.email, body.role, result, body.bossId)
        
        return user
    }

    async signin(email: string, password: string) {
        const [user] = await this.usersService.find(email);
        if(!user) {
            throw new NotFoundException('user not found')
        }

        const [salt, storedHash] = user.password.split('.');

        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('bad password');
        }

        return user;
    }


}

