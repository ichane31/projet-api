import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class PostCommentDTO{
    
    @ApiProperty({
        default: '',
        maxLength: 255,
        required: true
    })
    @IsNotEmpty()
    body: string;
}