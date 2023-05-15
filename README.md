
# Medical Laboratory Clinic Management (Employee and Lab Test Procedures - w/ Price Lists) API
# w/ Patient Lab Test History
#### with User Roles and User Registration


NOTE: PROJECT IN PROGRESS (planning to 
improve this project into a medical laboratory clinic use, by adding laboratory tests with price lists, patients record with lab test procedures and its prices.


Stacks Used:
- Nodejs
- Docker
- Express
- MongoDB
- Cloudinary


Definition:
- Users has 3 roles (User [default], Editor, Admin)
- Users can only view employee details
- Editors can only update empoyee details
- Admins have all the privileges as well as deleting the employees
- Editor can set the employment status (model) of an employee


Models:
Representing Employees:
- employee ID - auto Generated by employees date of birth + incrementating by 1: String
- firstname: String
- lastname: String
- jobTitle: String
- dateHired: Date
- birthDate: Date
- phoneNumber: String
- status - this will be populated by Status Model: ObjectId (Status)
- image: String

Representing Status
- name: String

Representing Users
- username: String
- password: String
- roles - default to User, other options: Editor, Representing Admin
- refreshToken - this will be generated oncw the user is login and will be destrot upon logging out. (with expiration): String

Representing Patients
- patientNo: String
- firstname: String
- lastname: String
- birthDate: Date
- address: String
- phoneNumber: String
- photo (optional): String
- age: Number
- records: this will be populated by LabTests Model: ObjectId (LabTests)
- remarks: String

Representing LabTests
- name: String
- description: String
- price: String

Representing Promos
- name: String
- description: String
- price: String
- requirements (Array): String
- startDate: Date
- endDate: Date


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
