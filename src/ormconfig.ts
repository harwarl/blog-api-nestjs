import { join } from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'seniorcr',
  password: '1234',
  database: 'seniorcr',
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  synchronize: true,
  migrations: [join(__dirname, 'migrations', '**', '*.{ts, js}')],
};

export default config;
