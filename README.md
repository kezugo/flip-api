## FLIP API

API created according to instructions from PDF file. 

Documentation of API available on /api endpoint OS3 Swagger exposed. 
The api has been prepared with nest.js framework and mongo db as data storage.
There are 2 docker containers, one with mongo and second with node app. 

### Additional features to initial requirements:
- ability to add products which maybe added later to the cart
- ability to add products with any currency from exchange rate list
- during checkout calculating total for cart in set currency with ability to convert products with different currencies
- removing quantity from products set during addition to cart
 
 
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
- more validation pipes 
- better schema description in swagger
- better mongo db 
- using of config service instead of pure dotenv 
- better separation of domain logic from datasource - clean architecture 

## Stay in touch

- Author - [Maciej Guzek](https://linkedin.com/maciej.guzek)
- Github - [https://github.com/kezugo/flip-api](https://github.com/kezugo/flip-api)

Maciej Guzek
+48534807090
kezugo@gmail.com

