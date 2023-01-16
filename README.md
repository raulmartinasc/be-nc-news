## Clone this repository

We'll have two databases in this project. One for real looking dev data and another for simple test data.
In order to succesfully connect to the two databases locally you will need to create these two .env files :

- .env.test
- .env.development

Once the files have been created add the following to .env.test file :

- PGDATABASE=nc_news_test

And finally add the following to your .env.development file:

- PGDATABASE=nc_news

Now you shold be able to run this repository locally, if you have any problems you can always contact me at raulmartinascanio@gmail.com
