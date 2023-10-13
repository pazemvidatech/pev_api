module.exports = [
  {
    "name": "default",
    "type": "postgres",
    "database": "postgres",
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "cache": {
      type: "redis",
      options: {
        host: process.env.CACHE_HOST,
        port: Number(process.env.CACHE_PORT)
      }
    },
    "host": process.env.POSTGRES_HOST,
    "port": process.env.POSTGRES_PORT,
    "entities": ["./src/modules/**/infra/typeorm/entities/*.ts"],
    "migrations": ["./src/shared/infra/typeorm/migrations/*.ts"],
    "cli": {"migrationsDir": "./src/shared/infra/typeorm/migrations"}
  },
  {
    "name": "development",
    "type": "postgres",
    "database": "postgres",
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "cache": {
      type: "redis",
      options: {
        host: process.env.CACHE_HOST,
        port: Number(process.env.CACHE_PORT)
      }
    },
    "host": process.env.POSTGRES_HOST,
    "port": process.env.POSTGRES_PORT,
    "entities": ["./src/modules/**/infra/typeorm/entities/*.ts"],
    "migrations": ["./src/shared/infra/typeorm/migrations/*.ts"],
    "cli": {"migrationsDir": "./src/shared/infra/typeorm/migrations"}
  },
  {
    "name": "production",
    "type": "postgres",
    "database": process.env.POSTGRES_DATABASE,
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "synchronize": false,
    "logging": false,
    "ssl": true,
    "extra": {
      "ssl": {
        "rejectUnauthorized": false
      }
    },
    "cache": {
      type: "redis",
      options: {
        url: encodeURI(process.env.CACHE_URL),
        tls: {
            rejectUnauthorized: false
        }
      }
    },
    "host": process.env.POSTGRES_HOST,
    "port": process.env.POSTGRES_PORT,
    "entities": ["./dist/modules/**/entities/*.js"],
    "migrations": ["./dist/shared/infra/typeorm/migrations/*.js"],
    "cli": {"migrationsDir": "./src/shared/infra/typeorm/migrations"}
  },
  {
    "name": "test",
    "type": "postgres",
    "database": "pev_test",
    "logging": false,
    "synchronize": false,
    "dropSchema": true,
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "cache": {
      type: "redis",
      options: {
        host: process.env.CACHE_HOST,
        port: Number(process.env.CACHE_PORT)
      }
    },
    "host": process.env.POSTGRES_HOST,
    "port": process.env.POSTGRES_PORT,
    "entities": ["./src/modules/**/infra/typeorm/entities/*.ts"],
    "migrations": ["./src/shared/infra/typeorm/migrations/*.ts"],
    "cli": {"migrationsDir": "./src/shared/infra/typeorm/migrations"}
  }
]
