import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class PostNoteDTO{
    
    @ApiProperty({
        default: '',
        maxLength: 255,
        required: true
    })
    @IsNotEmpty()
    note: number;
}