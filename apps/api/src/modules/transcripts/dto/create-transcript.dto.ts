import { IsBoolean, IsIn, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateTranscriptDto {
  @IsUrl()
  url!: string;

  @IsOptional()
  @IsString()
  lang?: string;

  @IsOptional()
  @IsBoolean()
  text?: boolean;

  @IsOptional()
  @IsIn(["native", "auto", "generate"])
  mode?: "native" | "auto" | "generate";
}
