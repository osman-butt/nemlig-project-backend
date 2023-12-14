# Nemlig.com - 2nd semester project
Group project made by [Benjamin](https://github.com/Benjamin-Harris1), [Gustav](https://github.com/gustavwiese), [Osman](https://github.com/osman-butt) & [Sham](https://github.com/Kapalee).

## Deployed app
- See a live version of the app [https://nemlig.onrender.com/](https://nemlig.onrender.com/)
- Backend is deployed here [https://nemlig-shop.onrender.com](https://nemlig-shop.onrender.com)
- Frontend repository: [https://github.com/osman-butt/nemlig-project-frontend](https://github.com/osman-butt/nemlig-project-frontend)

## Create a MySQL database
* Download the database backup file from [here](https://github.com/osman-butt/nemlig-project-backend/tree/main/sql/backup)
* Open up a terminal and type
```bash
mysql -u [USERNAME] -p 
```

* When prompted, type in your password
```sql
CREATE DATABASE nemlig_db;
```

* Open up a new terminal and import the data:
```bash
mysqldump -u [USERNAME] -p nemlig_db < PATH_TO_FILE/backup.sql
```

## Installation
* Fork the repository by clicking the "Fork" button in the top right corner of the GitHub page.

or

* Clone the repository to your local machine using the following command in your terminal:
```bash
git clone https://github.com/osman-butt/nemlig-project-backend.git
```
* Install dependencies
```bash
npm install
```
* Create a .env file and paste the following
```javascript
DATABASE_URL="mysql://[mysql_user]:[mysql_password]@localhost:3306/nemlig_db"
NODE_ENV="dev"
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
```
* Running the backend
```bash
npm start
```

* Installation guide to the frontend can be found [here](https://github.com/osman-butt/nemlig-project-frontend)
