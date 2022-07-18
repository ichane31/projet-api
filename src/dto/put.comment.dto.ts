import { PartialType } from "@nestjs/swagger";
import { PostCommentDTO } from "./post.comment.dto";

export class PutCommentDTO extends PartialType(PostCommentDTO) {}