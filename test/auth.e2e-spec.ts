import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import mongoose from 'mongoose';
import { WRONG_CREDENTIALS } from '../src/auth/auth.constants';

const mockLoginDto = {
	login: 'test@test.com',
	password: 'test',
};

describe('AuthController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/auth/login (POST) - success', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send(mockLoginDto)
			.expect(HttpStatus.OK)
			.then(({ body }: request.Response) => {
				expect(body.access_token).toBeDefined();
			});
	});

	it('/auth/login (POST) - fail login', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...mockLoginDto, login: 'wronguser@mail.com' })
			.expect(HttpStatus.UNAUTHORIZED, {
				error: 'Unauthorized',
				message: WRONG_CREDENTIALS,
				statusCode: HttpStatus.UNAUTHORIZED,
			});
	});

	it('/auth/login (POST) - fail password', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...mockLoginDto, password: 'wrong' })
			.expect(HttpStatus.UNAUTHORIZED, {
				error: 'Unauthorized',
				message: WRONG_CREDENTIALS,
				statusCode: HttpStatus.UNAUTHORIZED,
			});
	});

	afterAll(() => {
		mongoose.disconnect();
	});
});
