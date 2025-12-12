import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [

    ConfigModule.forRoot({ isGlobal: true }),

    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbUrl = config.get<string>('DATABASE_URL');

        if (dbUrl) {
          return {
            type: 'postgres',
            url: dbUrl,                       
            autoLoadEntities: true,
            synchronize: true,                
            ssl: { rejectUnauthorized: false }
          };
        }

        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST'),
          port: parseInt(config.get<string>('DB_PORT') ?? '5432', 10),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),

    UserModule,
  ],
})
export class AppModule {}
