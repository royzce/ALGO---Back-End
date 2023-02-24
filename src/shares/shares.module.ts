import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { postProviders } from 'src/posts/providers/post.providers';
import { ShareController } from './controller/share/share.controller';
import { shareProviders } from './providers/share.provider';
import { ShareService } from './service/share/share.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ShareController],
  providers: [...shareProviders, ...postProviders, ShareService],
})
export class SharesModule {}
