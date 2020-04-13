## FLIP API

API created according to instructions from PDF file. 

Documentation of API available on /api (http://localhost:3002/api/) endpoint OS3 Swagger exposed. 
The api has been prepared with **nest.js** framework and **mongo db** as data storage.
There are 2 docker containers, one with mongo and second with node app. 

### Additional features to initial requirements:
- ability to define products with quantity "in-store" and predefined currency
- removing quantity of product from store during additions to cart
- adding back quantity of product to store during removing product from cart
- during checkout products with different currencies are converted to selected currency for checkout

### Application structure:

The application was created with uncle bob clean arhitecture principles on mind. The domain layer is completly separated 
from framework code (well, almost there are still some exception and typegoose decorators used - its easy thing to cut off those bits as well)
The domain logic is located in __domain__ folder and is injected into framework with Nest.js DI - instruction what should be used is
located in scenario.ts and app.module.ts files.

The application is fully written in Typescript. For tests there is Jest framework used with jest-mock-extended package for better mocking. 
Everything is packaged with docker containers. There is a make file created to easy use of docker-compose and deal with env files
(.env-xxx files are being used for env prod/dev configuration).

The entry points for applications are controllers located in api folder. There are methods described in swagger docs.  

There are some improvements to standard nest.js structure. I added:
- more linting rules
- sorting for prettier
- clean architecture domain separation
- nodemon configuration

There are tests for domain logic only and are located in __domain__/tests folder. The tests are covering business domain logic only.   

## Installation / Running the app

For dev build with file watching
```bash
$ make dev
```

For prod builds (installation prod packages and no nest watchers)
```bash
$ make prod
```

After building the containers for the very first time you may preserve builds and use
```bash
$ make ENV=prod | dev up
```

To run the tests use, tests spec are located in __domain__/tests folder
```bash
$ yarn test
```

also it might be run typically with docker-compose

## Additional information

Configuration of the application is done with env files (.env.dev and .env.prod) which will be copied to .env file 
while running make command (configuration from .env is being used by app )

## Test

```bash
# unit tests
$ yarn test
```

## Missing bits
As usual there are improvements that could be added to the project:
- more tests
- more validation, add pipes 
- better mongo db structure
- using of config service instead of pure dotenv 

## Stay in touch

- Author - [Maciej Guzek](https://linkedin.com/maciej.guzek)
- Github - [https://github.com/kezugo/flip-api](https://github.com/kezugo/flip-api)

Maciej Guzek
+48534807090
kezugo@gmail.com

