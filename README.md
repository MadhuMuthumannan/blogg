# Clone the project
## install git 
then run the following command:

`git clone https://github.com/MadhuMuthumannan/blogg.git` in terminal

## Install some packages globally

1. nodejs 
1. npm
1. mongodb
1. nodemon (to automatically restart the server when changes are made in code)
1. robomongo (optional: to view databases and collections in UI)


Import the databases from the .bson files included in the blog-dump folder using the command:
It's very simple to import a .bson file:

mongorestore -d db_name -c collection_name path/file.bson
Incase only for a single collection.Try this:

mongorestore --drop -d db_name -c collection_name path/file.bson

### Getting into project

To install dependencies cd to the project directory here say blogg folder where package.json is present and run the following command:

` npm install`

> Now run the server by running the command

` nodemon server.js`

In case if you want to change the port change the port number in the file _config.js_ line number 2


**'port': process.env.PORT || 8080**

-----------------------------------------------------------------

## Summary about the project and functionality:

           ```This project is primarily a blog that contains posts. There are two different kind of privileges here one is user and another is admin. Whereas both of them login in same page. It is just that the admin will have few other extra priveleges added to user ones. 
               An user can create edit and delete the posts created by them. They can also change the Name and password in their profile. User created posts will only appear in the posts tab only after the admin approves. 
               Admin can create, edit the posts that he has created, approve or delete the posts created by others. Admin has also have the authority to delete users from the users list.```

> How to use or try the application?

1. Sign up by giving name, username and password
1. Create post by clicking on the **create post** tab and giving necessary details (it is optional to upload a relevant image, but you can only upload one picture per post which you can later edit if you want).
1. Click on the **edit post** tab. 
1. The number of views and comments are displayed on hover of the image in posts page. 
1. To view the post in full screen click the image title or image or click view full screen text on the page.
1. There is an option for you to comment on the posts. (But, which you cannot delete them later as of now, we are going to add delete comment feature in future)


