// import { Global, Module } from '@nestjs/common'
// import { ConfigModule as NestConfigModule } from '@nestjs/config'

// import { validate } from './config.schema'

// @Global()
// @Module({
//   imports: [
//     NestConfigModule.forRoot({
//       isGlobal: true,
//       validate,
//       envFilePath: ['.env'],
//     }),
//   ],
// })
// export class ConfigModule {}


import { Global, Module } from '@nestjs/common'
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import { resolve } from 'path'
import { validate } from './config.schema'

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath: [
        resolve(__dirname, '../../../../.env'),   // root .env
        resolve(__dirname, '../../.env'),          // apps/api/.env fallback
        '.env',                                    // cwd fallback
      ],
    }),
  ],
})
export class ConfigModule {}
