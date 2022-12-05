# Project Setup
This is a repository for main project as part of homework under Node Global Mentoring Program by Serik Akimgereyev.

1. run `nmp i`
2. run `npm run build`
3. create local database in postgres 
4. add `config.env` file in your local repo and provide connection details to database (refer to config.env.example)
5. run `npm run generate` to generate the Users table in local postgres database
6. run `npm start`

# API definitions to test in POSTMAN
base url: `http://localhost:3000/`
## Users
1. get all users: `users/`
2. get one user: `users/:id`
3. delete user: DELETE `users/:id`
4. create new user: POST `users/` 
5. update use: PATCH `users/:id`
6. get autosuggested users: GET `users/autosuggest?limit=5&search=text`

## Groups
1. get all groups: `groups/`
2. get one group: `groups/:id`
3. delete group: DELETE `groups/:id`
4. create new group: POST `groups/` 
5. update group: PATCH `groups/:id`
6. add users to group: POST `group/addusers`
