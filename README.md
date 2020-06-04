# ProjetWeb
Projet Web du groupe D - Amérique du nord
## Managing our git
### Preliminary steps
1. Make sure you downloaded git

2. Go to the folder where you want to add our group's repository

3. Write `git clone https://github.com/alexis-delorme/ProjetWeb.git` in terminal. This will create a local repository in the folder you chose that will be linked to the remote repository on github

4. Our github remote repository is public and can be found on the following link https://github.com/alexis-delorme/ProjetWeb. Here you can find info for when people have made changes, what changes they made, make pull requests etc.

### Working on the code 

1. Go to master-branch `git checkout master`. 
2. Pull latest changes `git pull`. Gets the latest version of the current(master) branch from github
3. Create a new branch `git checkout -b my-branch-name`. Replace my-branch-name with the name of your branch. **CANNOT** have spaces in its name and make sure the branch name is **unique**. We want to work in specific branches and **not** in the default branch (master) because we dont want to change the code that other people might be working from. If conflicts still occur we can atleast track them easier and solve them in each branch seperately.
4. You are now working in the branch you created. Add some code. If you are ever unsure which branch you are working in type `git status` in your terminal.
5. Commit your changes with `git commit -am "description of commit"`. These commits will appear in the branch you're currently in (my-branch-name), this way you don't bother anyone else working with another feature. Commit as many times as you want in your branch. **Careful** to check your branch with `git status` if you are unsure what branch you are in.
6. Push your commit `git push origin my-branch-name`. This pushes/saves your local commit to github and everyone else can see your changes. The part with `origin my-branch-name` is only needed for the first time you push your branch, however if you are unsure, write it out anyway.
7. Go to our repository on github (https://github.com/alexis-delorme/ProjetWeb) and create a Pull request with your changes to master. What the pull request does is that it sends a request to merge the changes you have made in a branch (my-branch-name) into the default branch (master). The people in the group can accept the request if they like and you can then merge into the master branch. If there are no conflicts (for example when having created a new file in the repository with a unique name) you can merge with no problem.
8. Repeat steps 1-7 for each feature, bug-fix, testing etc.


