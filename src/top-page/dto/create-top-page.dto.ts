import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TopLevelCategory } from '../top-page.model';

class HhDataDto {
	@IsNumber()
	count: number;
	@IsNumber()
	juniorSalary: number;
	@IsNumber()
	middleSalary: number;
	@IsNumber()
	seniorSalary: number;
}

class TopPageAdvantagesDto {
	@IsString()
	title: string;

	@IsString()
	description: string;
}

export class CreateTopPageDto {
	@IsEnum(TopLevelCategory)
	firstCategory: TopLevelCategory;

	@IsString()
	secondCategory: string;

	@IsString()
	alias: string;

	@IsString()
	title: string;

	@IsString()
	category: string;

	@ValidateNested()
	@IsOptional()
	@Type(() => HhDataDto)
	hh?: HhDataDto;

	@ValidateNested()
	@IsArray()
	@Type(() => TopPageAdvantagesDto)
	advantages: TopPageAdvantagesDto[];

	@IsString()
	seoText: string;

	@IsString()
	tagsTitle: string;

	@IsArray()
	@IsString({ each: true })
	tags: string[];
}
