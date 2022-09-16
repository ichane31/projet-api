import { ApiProperty } from "@nestjs/swagger";

export class PasswordLinkDTO {
    @ApiProperty({
        required: true
    })
    email: string;

}