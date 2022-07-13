import { PartialType } from "@nestjs/swagger";
import { PostProjetDTO } from "./post.projet.dto";

export class PutProjetDTO extends PartialType(PostProjetDTO) {}