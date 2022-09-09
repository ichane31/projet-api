import { PartialType } from "@nestjs/swagger";
import { PostContactDTO } from "./post.contact.dto";

export class PutContactDTO extends PartialType(PostContactDTO) {}