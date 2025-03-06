# INSTRUCTIONS TO RUN THE APPLICATION

## PREREQUISITES

1. Docker  
2. Node.js (Any of these versions: 18, 20, 22)  
3. Install Angular CLI globally:  
   ```sh
   npm install -g @angular/cli

## STEP BY STEP

Steps to run Docker along with PostgreSQL and Django:

1. Open a terminal to run the backend.


2. Navigate to the backend folder:
```
    cd backend
```

3. Build and start the Docker containers:
```
    docker-compose up --build
```

4.  Start the containers:
```
    docker compose up
```

This will start the database and Django on port 8000.

5. Open a second terminal to run the frontend (Angular).

6.  Navigate to the frontend folder:
```
    cd frontend
```

7. Install the necessary dependencies:
```
    npm i
```

8. Start the Angular application and open in browser:
```
    ng s -o
```