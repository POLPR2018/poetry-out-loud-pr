## Information

Website for Poetry Out Loud

### How to

1) Clone the project
2) cd into the project and run `npm install`
3) In the terminal run `nodemon app.js -e js, hbs, css` this will watch for any file changes.
4) Go to http://localhost:3000
5) Enjoy!

### When pushing to GitHub & heroku

1) To add the heroku remote run the following

```
git remote add heroku https://git.heroku.com/pol-development.git
```

2) To push to GitHub, heroku and to the production app all in one run

```
git push && git push heroku master && heroku pipelines:promote
```

`git push heroku master` links to the `pol-development` heroku application and because this is in staging in the pipeline we can run `heroku pipelines:promote` to push it to the production stage.

--

#### GitHub

1) `git status`
2) `git add .`
3) `git commit -am "commit message"`
