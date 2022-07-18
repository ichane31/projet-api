import { PartialType } from "@nestjs/swagger";
import { PostNoteDTO } from "./post.note.dto";

export class PutNoteDTO extends PartialType(PostNoteDTO) {}