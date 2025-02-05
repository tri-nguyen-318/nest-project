import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NovelsModule } from './novels/novels.module';

@Module({
  imports: [NovelsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
