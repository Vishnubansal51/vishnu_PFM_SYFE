# vishnu_PFM_SYFE
 

Personal Finance Manager: Installation and Setup Guide
1. Clone the Repository

To set up the project, first, clone the repository from the version control system:

git clone <repository-url>
cd <repository-folder>/backend

2. Install Dependencies

Install all the required dependencies using npm:
npm install

3. Configure Environment Variables

- Create a `.env` file in the root of the `backend` directory.
- Add the following key-value pairs:
JWT_SECRET=your_secret_key
Replace `your_secret_key` with a secure and random string.
4. Set up the database:
Configure SQLite in db/connection.js


5. Run the Server
To start the application server:
npm start or npm run dev


By default, the server runs on `http://localhost:3000`.


6. Running the Application in Test Mode

To run the application in a test environment:

1. Ensure the `.env` file contains:
NODE_ENV=test
JWT_SECRET=your_test_secret_key

2. Run the test command:
npm test -- --runInBand
Each test file is independent of other test files

By default, Jest runs test files in parallel, which can lead to conflicts when tests share resources like a database. So to run the tests sequentially I used -- --runInBand

## API Documentation

Here are the main routes provided by the server:

User Management

•	POST /users/register: Register a new user.

•	POST /users/login: Login and receive a JWT token.

Transaction Management:

In transaction: type income will not have any category

Headers:
Authorization: Bearer <your_token>

•	POST /transactions: Add a new transaction.

•	GET /transactions: View all transactions.

•	PUT /transactions/:id: Update a transaction.

•	DELETE /transactions/:id: Delete a transaction.

Category Management

Headers:
Authorization: Bearer <your_token>

•	POST /categories: Add a new category.

•	GET /categories: View all categories.

Savings Goals

Headers:
Authorization: Bearer <your_token>

•	POST /savings: Add a savings goal.

•	GET /savings: View all savings goals.

Reports

Headers:
Authorization: Bearer <your_token>

•	GET /reports/monthly?month=1&year=2025: Generate a monthly report.

•	GET /reports/yearly?year=2025: Generate a yearly report.




## Design Overview and Assumptions

Design Overview:
The Personal Finance Manager system is designed using the Model-View-Controller (MVC) architecture to ensure a modular, scalable, and maintainable application. It consists of the following components:
1.	Models:
o	Models define the schema for users, transactions, categories, and savings goals using Sequelize ORM.
o	Relationships between models:
	A user has many transactions, categories, and savings goals.
	Transactions are associated with categories (for expenses).
	Savings goals track progress using transactions.
2.	Controllers:
o	Controllers handle the business logic for each feature, such as user authentication, transaction management, category management, savings goals, and report generation.
3.	Routes:
o	Routes map API endpoints to corresponding controller methods, ensuring separation of concerns.
4.	Database:
o	SQLite is used as the database, with Sequelize providing an abstraction layer to define and interact with the schema.
5.	Authentication:
o	JWT-based authentication secures routes that require user-specific access ( transactions, savings goals, reports)
6.	Reports:
o	Reports generate insights (e.g., income, expenses, category breakdowns) using transactions, with visual charts saved as PNG files.
Assumptions:
1.	Category Management and Transactions:
o	The Category Management module is tightly linked to transactions.
o	Before adding a transaction of type expense, the user must first create a category in the Category Management module.
o	This ensures a consistent and user-defined categorization of expenses.
2.	Transaction Schema Enhancement:
o	An additional column, type of transaction (income/expense), was added to the transaction schema.
•	This enhancement helps distinguish between income and expense transactions. It is particularly useful for:
o	Associating categories with only expense transactions (CategoryId is mandatory for expenses, optional for income).
o	Calculating the progress of savings goals by subtracting total expenses from total income.
3.	Savings Goals:
o	Savings goals track progress based on the user's total income and expenses, calculated from the transactions module.
o	Progress is represented as a percentage of the savings goal's target amount, capped at 100%.
4.	Authentication:
o	JWT is used for authentication to ensure all sensitive routes are protected.
o	Users must include a valid Bearer token in the header for any operations related to transactions, categories, savings goals, or reports.
5.	Data Integrity:
o	Validation rules are enforced across all APIs to ensure data integrity (e.g., a transaction without a type or an expense without a category will be rejected).



