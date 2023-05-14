
# Employee Management API
#### with User Roles and User Registration

NOTE: PROJECT IN PROGRESS

Stacks Used:
- Nodejs
- Docker
- Express
- MongoDB
- Cloudinary

An API that monitors the status of the employee, add, update and delete an employee and employee status. This API has a middleware that an account is needed or should be registered in order to have an access on the APIs.

Admin enables:
- retrieve all employees, users and status or an employee, users and status
- add an employee, user and status
- update employee, user and status details
- delete employee, user and status

Editor enables:
- retrieve all employees, users and status or an employee, users and status
- add an employee, user and status
- update employee, user and status details

User
- retrieve all employees or an employee
- retrieve all users or an user


## API Endpoints:

- /register
- /auth
- /refresh
- /logout

#### Needs Access
- /users (Get, Put, Delete)
- /users/:id (Get)
- /employee (Get, Put, Delete)
- /employee/:id (Get)
- /status (Get, Put, Delete)
- /status/:id (Get)
