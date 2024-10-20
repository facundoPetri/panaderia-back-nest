import { IsString, IsMongoId, IsDate } from 'class-validator';

export class CreateWasteDto {
    @IsString()
    motive: string;

    @IsMongoId({ each: true })
    supplies: string[];

    @IsMongoId()
    reporter: string;

    @IsMongoId({ each: true })
    responsible: string[];

    @IsDate()
    date: Date;
}
