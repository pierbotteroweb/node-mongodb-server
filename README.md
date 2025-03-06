# Running a MongoDB database on Docker

If you have a mongodb database on your local machine and you want your doker mongodb to import the whole
database content on your local machine, copy the "data" folder thatis used onthemongodb installand paste it onthe rootfolder of this project. Then, the fllowing line will map the content of your local data folder with the folder that mongodb will use on Doker

      - G:/docker-mongodb/data:/data/db

By running 

      docker-compose up -d 
      
the database will be created using all the collections and documents of your local mongodb install. 

docker-compose down
docker system prune -a
docker-compose up -d

docker network create mongo-replica-net

docker exec -it mongo1 mongosh


rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017" },
    { _id: 1, host: "mongo2:27017" },
    { _id: 2, host: "mongo3:27017" }
  ]
})


Modify /etc/hosts (Linux/macOS) or Windows Hosts File
If you need to resolve mongo1, mongo2, and mongo3 from your local machine (outside Docker), you can manually add entries to your /etc/hosts file (for Linux/macOS) or C:\Windows\System32\drivers\etc\hosts file (for Windows).

127.0.0.1 mongo1
127.0.0.1 mongo2
127.0.0.1 mongo3

docker exec mongo1 mongodump --archive=/backups/mongodb_backup.archive
docker exec -i mongo1 mongorestore --archive=/backups/mongodb_backup.archive
