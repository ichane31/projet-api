import { ApiProperty } from "@nestjs/swagger";
import { Category } from "../model/category";
import { Projet } from "../model/projet";


export class SearchResult {
    @ApiProperty()
    input: string;
    @ApiProperty({ type: 'array', items: new Category })
    categories: Category[];
    @ApiProperty({ type: 'array', items: new Projet })
    projets: Projet[];

}