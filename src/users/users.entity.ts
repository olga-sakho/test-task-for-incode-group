import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { Exclude, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';


  export enum UserRole {
    ADMIN = 'admin',
    BOSS = 'boss',
    REGULAR = 'regular'
  }
  

  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ApiProperty({ example: "Kate", description: 'User name' })
    @Column()
    name: string;

    @ApiProperty({ example: "test1@test.com", description: 'User email' })
    @Column()
    email: string;
  
    @ApiProperty({ example: "q1w2e3r4t5", description: 'User password' })
    @Column()
    @Exclude()
    password: string;

    @ApiProperty({ example: "admin", description: 'User role' })
    @Column({
        enum: UserRole,
        default: UserRole.REGULAR,
       })
    role: string;
    
    @ApiProperty({ example: null, description: 'BossId if you are regular user or boss.' })
    @Column({ nullable: true })
    bossId?: number;

  }

