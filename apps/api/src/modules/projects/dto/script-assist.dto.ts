import { IsString } from 'class-validator';

export class ScriptAssistDto {
  @IsString()
  scriptText!: string;
}
