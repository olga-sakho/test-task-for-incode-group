import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, ValidateIf } from "class-validator";
import { UserRole } from "../users.entity";

export class UpdateUserDto {
    
    @ApiProperty({ example: 5, description: 'Change boss' })
    @ValidateIf((user) => user.role !== UserRole.ADMIN)
    @IsNotEmpty()
    @IsNumber()
    bossId: number;

}