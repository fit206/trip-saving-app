// Collection: users
/*
Fields:
- id (string): user ID
- password (string): hashed password
- role (string): "member"
- savings (number): 0
*/

// Collection: admin
/*
Fields:
- id (string): "admin"
- password (string): "888888"
*/

// Collection: transactions
/*
Fields:
- userId (string): member ID
- amount (number): transaction amount
- date (timestamp): transaction date
- type (string): "deposit"/"withdrawal"
*/