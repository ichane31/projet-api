import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class PostProjetDTO{
    @ApiProperty({
        required: true
    })
    @IsString()
    @MinLength(8)
    title: string;

    @ApiProperty({default: '',
    maxLength: 255,
    required: false})
    @IsString()
    @MinLength(20)
    description: string;

    @ApiProperty({
        type: 'file',
        properties: {
            file: {type:'string', format:'binary'}
        }
    })
    resume:string

    @ApiProperty({
        type: 'file',
        properties: {
            file: {type:'string', format:'binary'}
        }
    })
    rapport:string

    @ApiProperty({
        type: 'file',
        properties: {
            file: {type:'string', format:'binary'}
        }
    })
    image : string

    @ApiProperty({
        type: 'file',
        properties: {
            file: {type:'string', format:'binary'},
            extension: {type:'ppt'}
        }
    })
    presentation: string;

    @ApiProperty({
        type: 'file',
        properties: {
            file: {type:'string', format:'binary'}
        }
    })
    videoDemo : string

    @ApiProperty({
        type: 'file',
        properties: {
            file: {type:'string', format:'binary'}
        }
    })
    codeSource: string

    @ApiProperty({ required:true})
    prix: number;
}