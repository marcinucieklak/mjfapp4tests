import { Injectable } from '@nestjs/common';
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MysqlSequelizeConfigService implements SequelizeOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createSequelizeOptions(): SequelizeModuleOptions {
    return {
      dialect: 'mysql',
      autoLoadModels: true,
      synchronize: true,
      host: this.configService.get<string>('database.host'),
      port: this.configService.get<number>('database.port'),
      username: this.configService.get<string>('database.username'),
      password: this.configService.get<string>('database.password'),
      database: this.configService.get<string>('database.database'),
      ssl:
        this.configService.get<string>('NODE_ENV') === 'development'
          ? false
          : true,
      dialectOptions: {
        ssl:
          this.configService.get<string>('NODE_ENV') === 'development'
            ? false
            : {
                require: true,
                rejectUnauthorized: false,
              },
      },
    };
  }
}
