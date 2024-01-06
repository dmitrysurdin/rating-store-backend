import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import mongoose, { Types } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';

const productId = new Types.ObjectId().toHexString();

const mockLoginDto = {
	login: 'test@test.com',
	password: 'test',
};

const mockCreateReviewDto: CreateReviewDto = {
	name: 'Test name',
	title: 'Test title',
	description: 'Test description',
	rating: 5,
	productId,
};

describe('AppController (e2e)', () => {
	let app: INestApplication;
	let createdId: string;
	let token: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		const { body } = await request(app.getHttpServer()).post('/auth/login').send(mockLoginDto);
		token = body.access_token;
	});

	it('/review/create (POST) - success', async (): Promise<void> => {
		return request(app.getHttpServer())
			.post('/review/create')
			.send(mockCreateReviewDto)
			.expect(HttpStatus.CREATED)
			.then(({ body }: request.Response) => {
				createdId = body._id;
				expect(createdId).toBeDefined();
			});
	});

	it('/review/create (POST) - fail', () => {
		return request(app.getHttpServer())
			.post('/review/create')
			.send({ ...mockCreateReviewDto, rating: 6 })
			.expect(HttpStatus.BAD_REQUEST);
	});

	it('/review/byProduct/:productId (GET) - success', async (): Promise<void> => {
		return request(app.getHttpServer())
			.get('/review/byProduct/' + productId)
			.expect(HttpStatus.OK)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(1);
			});
	});

	it('/review/byProduct/:productId (GET) - fail', async (): Promise<void> => {
		return request(app.getHttpServer())
			.get('/review/byProduct/' + new Types.ObjectId().toHexString())
			.expect(HttpStatus.OK)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(0);
			});
	});

	it('/review/:id (DELETE) - success', () => {
		return request(app.getHttpServer())
			.delete('/review/' + createdId)
			.set('Authorization', 'Bearer ' + token)
			.expect(HttpStatus.OK);
	});

	it('/review/:id (DELETE) - fail', () => {
		return request(app.getHttpServer())
			.delete('/review/' + new Types.ObjectId().toHexString())
			.set('Authorization', 'Bearer ' + token)
			.expect(HttpStatus.NOT_FOUND, {
				statusCode: HttpStatus.NOT_FOUND,
				message: REVIEW_NOT_FOUND,
			});
	});

	afterAll(() => {
		mongoose.disconnect();
	});
});
