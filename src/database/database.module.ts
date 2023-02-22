// import { Module } from '@nestjs/common';
// import { DatabaseService } from './database.service';

// @Module({
//   providers: [DatabaseService]
// })
// export class DatabaseModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'mydb.sqlite',
      // entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true, //will make database table based on the entity classes
    }),
  ],
})
export class DatabaseModule {}
