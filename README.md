# finalProject

To run this project you need to download the zip of the main branch.
Then unzip the zipped directory.

To compile the algorithm you need to have codon installed on your wsl:
https://github.com/exaloop/codon

than open the cmd in the project directory and run:
cd server/algorithm
codon build -release -exe algo2.py

To run the server open the cmd in the project directory and run:
cd server
npm install --force
npm start

To run the client open the cmd in the project directory and run:
cd client
npm install --force
npm start
