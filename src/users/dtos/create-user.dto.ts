import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsEnum, IsNotEmpty, IsNumber, ValidateIf, IsOptional } from "class-validator";
import { UserRole } from "../users.entity";

export class CreateUserDto {
    @ApiProperty({ example: "Mick", description: 'User name' })
    @IsString()
    name: string;

    @ApiProperty({ example: "test78@test.com", description: 'User email' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: "q1w2e3r4t5", description: 'User password' })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({ example: "boss", description: 'User role' })
    @IsNotEmpty()
    @IsEnum(UserRole)
    role: UserRole
    

    @ApiProperty({ example: 1, description: 'BossId if you are regular user or boss.' })
    @ValidateIf((user) => user.role !== UserRole.ADMIN)
    @IsOptional()
    @IsNumber()
    bossId: number;

}