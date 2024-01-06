import { Module } from '@nestjs/common';
import { TopPageController } from './top-page.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TopPageSchema, TopPageModel } from './top-page.model';
import { TopPageService } from './top-page.service';

@Module({
	controllers: [TopPageController],
	imports: [
		MongooseModule.forFeature([
			{
				name: TopPageModel.name,
				schema: TopPageSchema,
			},
		]),
	],
	providers: [TopPageService],
})
export class TopPageModule {}
