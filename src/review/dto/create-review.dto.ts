import { IsString, IsNumber, Max, Min } from 'class-validator';

const RATING_MAX = 5;
const RATING_MIN = 1;

export class CreateReviewDto {
	@IsString()
	name: string;

	@IsString()
	title: string;

	@IsString()
	description: string;

	@Max(RATING_MAX, { message: `Rating can not be more than ${RATING_MAX}` })
	@Min(RATING_MIN, { message: `Rating can not be more than ${RATING_MIN}` })
	@IsNumber()
	rating: number;

	@IsString()
	productId: string;
}
