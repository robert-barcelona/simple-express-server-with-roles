
<p align="center">
 

  <h3 align="center">AXA Data Test</h3>




<!-- ABOUT THE PROJECT -->
## About The Project
  A simple Node/Express application to access two data sources ([https://mocky.io/v2/580891a4100000e8242b75c5] and [https://www.mocky.io/v2/5808862710000087232b75ac]) which represent client and policy data, cache those in a MongoDB, and provide APIs with which to access this data in a filtered manner with role authentication.
  
  <h6>Note: the folder '/data' is <i>not</i> used to populate the DB or to provide data for the API.  It is used only for mocking in tests.</h6>

### Built With

* [Node.js](https://nodejs.org/)
* [ExpressJS](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [Mongoose](https://mongoosejs.com/)
* [Babel](https://babeljs.io/)
* [Winston](https://github.com/winstonjs)
* [Jest](https://jestjs.io/)



<!-- GETTING STARTED -->
## Prerequisites
Make sure you have MongoDB installed on your local machine.

You should also be running Node version 11.  If you do not have that installed you may use Node Version Manager ([https://github.com/nvm-sh/nvm]), or Docker ([https://www.docker.com/]) or simple install the correct version ([https://nodejs.org/en/])


### Installation


1. Clone the repo
```sh
git clone https://github.com/robert-barcelona/simple-express-server-with-roles.git
```
2. 
Place the following code into an  `.env` file at root level if that file does not exist

```JS
DATABASE_URL=mongodb://localhost:27017/axa-mongodb-server
PORT=4321
JWT_SECRET=SUPERSTUFF
JWT_EXP="2 days"
POLICIES_URL=http://www.mocky.io/v2/580891a4100000e8242b75c5
CLIENTS_URL=http://www.mocky.io/v2/5808862710000087232b75ac
SERVICE_LOAD_INTERVAL=600000

```

3. Install NPM packages
```sh
cd simple-express-server-with-roles
yarn
```
4. Start MongoDB
```sh
mongodb
```
5. Start the development server
```sh
yarn start
```
6. The service will be served on localhost:4321



## How it works

<p>This app chose to use a database (MongoDB) to cache the data.  It was thought that this approach -- although complicated for such a small amount of data -- would provide the speed, flexibility and ease of use that would scale easily in a larger, 'real world'application.</p>


<p>On startup the application retrieves data from the two external data sources and caches the data in a local MongoDB database.  This data is retrieved by a 'logic' layer which interfaces between the database and the Express routes via Mongoose.  The data is periodically refreshed from the live data sources to ensure that it is always up-to-date (the frequency of refresh can be set in an environment variable).  This refresh is not necessary in this case but mimics a real life scenario. </p>
<p>It would have also been possible to skip the DB caching and simply filter the data via JS itself, perhaps caching the retrieved data in Redis.  It was felt that a DB solution was more elegant and scalable.</p>

<p>Note: a possible race condition could develop if an API route were called during DB refresh.  This would be simple to avoid, but the solution was not implemented since this is a sample application and it is not likely to occur with current parameters. </p>

### API routes available

<h5>Note: all routes are prefaced with 'api/' and -- except for the 'authenticate' route -- require the JWT returned by 'authenticate' as Bearer Token</h5>

<h5>A collection of sample Postman requests -- with JWT pre-fetched -- for the application API routes is available here: https://www.getpostman.com/collections/13bb27d186e9ac2b1054</h5>

1. Authenticate: "/authenticate" -- example: http://localhost:4321/api/authenticate
- method POST
- returns JWT
- note: at the moment a password is not required, since there was no password given in the user data
- returns error message as json in the event of error and either status 401 or 403
- expects email (string) and password (string, min 6 chars) in body as raw `application/json` data
```JS
{
"email":"inesblankenship@quotezart.com",
"password":"admin1"
}	
```


2. Get User Data By ID: "/users/id/:userId" -- example: http://localhost:4321/api/users/id/a0ece5db-cd14-4f21-812f-966633e7be86
- method GET
- expects user ID as final route parameter
- returns user data as json
- returns error message as json and 401 or 500 error status
- requires JWT returned by authentication to be returned as Bearer Token
- access is determined by user role, accessible to 'user' and 'admin'


3. Get User Data By User Name: "/users/name/:name"  -- example: http://localhost:4321/api/users/name/Ines
- method GET
- expects user name as final route parameter
- returns user data as json
- returns error message as json and 401 or 500 error status
- requires JWT returned by authentication to be returned as Bearer Token
- access is determined by user role, accessible to 'user' and 'admin'


4. Get Policy By Policy Number: "/users/policy/:policyNumber"  -- example: http://localhost:4321/api/users/policy/0df3bcef-7a14-4dd7-a42d-fa209d0d5804
- method GET
- expects policy number as final route parameter
- returns user data as json
- returns error message as json and 401 or 500 error status
- requires JWT returned by authentication to be returned as Bearer Token
- access is determined by user role, accessible to  'admin'


5. Get Policies for User Name: "/policies/name/:name"  -- example: http://localhost:4321/api/policies/name/Manning
- method GET
- expects user name as final route parameter
- returns user data as json
- returns error message as json and 401 or 500 error status
- requires JWT returned by authentication to be returned as Bearer Token
- access is determined by user role, accessible to  'admin'

## Environment

The application runs under Node v11 and relies on Babel to translate the ESNext code to Node.  


## Testing


<p>Jest was used for testing.  Only testing of one Express route was implemented due to time constraints, to show the pattern to follow if testing were extended to the rest of the app. 
</p>

```sh
yarn test
```

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.




