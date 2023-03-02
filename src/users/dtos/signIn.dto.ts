import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsNotEmpty} from "class-validator";

export class SignInDto {
    @ApiProperty({ example: "test78@test.com", description: 'User email' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: "q1w2e3r4t5", description: 'User password' })
    @IsString()
    @IsNotEmpty()
    password: string;


}