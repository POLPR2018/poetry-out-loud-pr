## Information

Website for Poetry Out Loud https://poetryoutloudpr.org/

### How to

1) Install node.js https://nodejs.org/en/
2) Clone the project
3) cd into the project and run `npm install`
4) In the terminal run `nodemon app.js -e js, hbs, css` this will watch for any file changes.
5) Go to http://localhost:3000
6) Enjoy!

**Before pushing to GitHub in the "whats-new" page make sure you update the git commit count, and include any significant changes to the application.**

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
