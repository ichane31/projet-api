import { ApiProperty } from "@nestjs/swagger";

export class PostContactDTO{
    @ApiProperty({
        required: true
    })
    name: string;

    @ApiProperty({
        required: true
    })
    email: string;

    @ApiProperty({
        required: true
    })
    subject: string;

    @ApiProperty({
        required: true
    })
    message: string;
}