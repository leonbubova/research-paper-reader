---
course: Harvard CS197
term: Fall 2022
lecture: "2"
title: The Zen of Python
subtitle: Software Engineering Fundamentals
instructor: Pranav Rajpurkar
source_notes: https://docs.google.com/document/d/1z5ELxpTw_U01jUB6-D6ILqHRPg6SSiLE7VFQryH3LPU/edit
course_site: https://cs197.seas.harvard.edu/
learning_outcomes:
  - Edit Python codebases effectively using the VSCode editor.
  - Use git and conda comfortably in your coding workflow.
  - Debug without print statements using breakpoints and logpoints.
  - Use linting to find errors and improve Python style.
tags: [python, vscode, debugging, git, conda]
provenance: Prose is the author's original lecture notes, transcribed. Blocks marked "Added explanation" were written for this reader and are not the author's words.
---

## Overview

Welcome to Lecture 2 of CS 197 at Harvard. My hope with this lecture is to give you a sense of what a Python engineering workflow –– which is at the heart of many AI projects –– looks like. Nine years ago, I got much more efficient and effective with Python programming by challenging myself to improve using the editor, learn python style and debug without print statements – I try to sharpen these skills from time to time. So before we add the complexity of machine learning workflows, I want to take you through some of the powerful programming tools at your disposal. This lecture is set up in the format of a live code for a coding challenge. Getting comfortable with a programming workflow takes lots of time and practice, so while you won't be magically better at the end of this lecture (you may even be slower than when you started out in the short term), you will have a blueprint for an effective workflow.

**Learning outcomes:**
- Edit Python codebases effectively using the VSCode editor.
- Use git and conda comfortably in your coding workflow.
- Debug without print statements using breakpoints and logpoints.
- Use linting to find errors and improve Python style.

## Python Programming

All too often, we're tasked with reading code someone else has written, understanding it, and getting it to do what we want. I want to walk you through this exercise, and use the exercise as a way to go through debugging, linting, versioning, and environments all through the VSCode editor.

### VSCode

Why VSCode? According to StackOverflow's 2021 Developer Survey, it's the lead as an IDE of choice across all developers! Over half of developers I know use VSCode, so this is consistent with my own experience.

VSCode is quite a powerful tool. One of the arguments in programming faster is to minimize use of a mouse and increase use of the keyboard. You will find that VS Code provides an exhaustive list of commands in the Command Palette (⇧⌘P or Ctrl+Shift+P in Windows) so that you can run VS Code without using the mouse. Press ⇧⌘P then type a command name (for example 'git') to filter the list of commands.

A few of my colleagues make an active effort to memorize many of the commands VSCode provides; most of these shortcuts with keyboards are slower than using the mouse in the short-term: stick to them and believe that you will get faster in the longer term.

VSCode has some excellent tutorials. I would recommend going through these first:
1. https://code.visualstudio.com/docs/getstarted/tips-and-tricks
2. https://code.visualstudio.com/docs/editor/codebasics

It's totally normal to take multiple passes through these tutorials; they are dense, and you are unlikely to use all of the features you encounter regularly. You can return to it as you get comfortable with more and more features to push yourself. If you find yourself repeating a task too many times in a way that feels clunky, you're likely missing a good shortcut for it.

Because we're working in Python, we are going to use the Python extension for VS Code from the Visual Studio Marketplace. The Python extension is named Python and it's published by Microsoft. I would now work through these two tutorials:
1. https://code.visualstudio.com/docs/python/python-tutorial
2. https://code.visualstudio.com/docs/editor/intellisense

Okay next up, opening a new project on VSCode.

We're going to use the third option, clone git repository. First you will need to go to github, and fork this repository: https://github.com/rajpurkar/python-practice. Then clone your new github repository.

Our colleague needs our help. In `number_of_ways.py`, they have attempted a programming problem unsuccessfully. Now they've asked us to find out what's wrong with the code and help them fix it. Let's go ahead and open `number_of_ways.py`.

It's some Python code to solve the leetcode problem:
https://leetcode.com/problems/number-of-ways-to-reach-a-position-after-exactly-k-steps/

We can see the programmers note on line 4! Let's see whether we can help our colleague fix this. First things first, we need to get the code to run. And for that, we need conda.

> **Exercise**
> Work in pairs to solve the leetcode problem by yourself first. Use VSCode for the editor. You won't need to install any packages.

## Conda Environment

We're going to create a conda environment to run the code.

Why an environment? From VSCode's guide:

> "By default, any Python interpreter installed runs in its own global environment. They aren't specific to a particular project. For example, if you just run python, python3, or py at a new terminal (depending on how you installed Python), you're running in that interpreter's global environment. Any packages that you install or uninstall affect the global environment and all programs that you run within it.
>
> To prevent such clutter, developers often create a virtual environment for a project. A virtual environment is a folder that contains a copy (or symlink) of a specific interpreter. When you install into a virtual environment, any packages you install are installed only in that subfolder. When you then run a Python program within that environment, you know that it's running against only those specific packages."

What is a conda environment?

> "A conda environment is a Python environment that's managed using the conda package manager (see Getting started with conda (conda.io)). Whether to use a conda environment or a virtual one will depend on your packaging needs, what your team has standardized on, etc."

People often get confused about how conda and pip are different from each other. Here's a short summary from the conda blog:

> "Conda is a cross platform package and environment manager that installs and manages conda packages from the Anaconda repository as well as from the Anaconda Cloud. Conda packages are binaries. There is never a need to have compilers available to install them. Additionally conda packages are not limited to Python software. They may also contain C or C++ libraries, R packages or any other software.
>
> This highlights a key difference between conda and pip. Pip installs Python packages whereas conda installs packages which may contain software written in any language. For example, before using pip, a Python interpreter must be installed via a system package manager or by downloading and running an installer. Conda on the other hand can install Python packages as well as the Python interpreter directly.
>
> Another key difference between the two tools is that conda has the ability to create isolated environments that can contain different versions of Python and/or the packages installed in them. This can be extremely useful when working with data science tools as different tools may contain conflicting requirements which could prevent them all being installed into a single environment. Pip has no built in support for environments but rather depends on other tools like virtualenv or venv to create isolated environments. Tools such as pipenv, poetry, and hatch wrap pip and virtualenv to provide a unified method for working with these environments."

Note that people still use conda and pip together for the following reason:

> "A major reason for combining pip with conda is when one or more packages are only available to install via pip. Over 1,500 packages are available in the Anaconda repository, including the most popular data science, machine learning, and AI frameworks. These, along with thousands of additional packages available on Anaconda cloud from channeling including conda-forge and bioconda, can be installed using conda. Despite this large collection of packages, it is still small compared to the over 150,000 packages available on PyPI. Occasionally a package is needed which is not available as a conda package but is available on PyPI and can be installed with pip. In these cases, it makes sense to try to use both conda and pip."

Go ahead and install Conda if you don't already have it.
https://docs.conda.io/en/latest/index.html

You have the option of installing Miniconda or Anaconda: https://docs.conda.io/en/latest/miniconda.html

It doesn't matter which one you use; I use Miniconda. Here's the difference, from this link:

> "Miniconda is a free minimal installer for conda. It is a small, bootstrap version of Anaconda that includes only conda, Python, the packages they depend on, and a small number of other useful packages, including pip, zlib and a few others. Use the conda install command to install 720+ additional conda packages from the Anaconda repository."

Once we have conda, we're going to create a new environment. There are many conda commands; here is the list of the most useful ones (full pdf link here).

At the least, you should memorize `conda activate`, `conda create`, `conda env list`. My friend creates flashcards to practice memorization of many of these.

It's time to work with conda. We can do this directly from the VSCode terminal – learn how to get started with VSCode terminal by reading the very first section of https://code.visualstudio.com/docs/terminal/basics.

We're first going to create our new environment:

```
conda create -n cs197lec2 python=3.9
```

It's very important that we specify the Python interpreter so that VS Code then shows in the list of available interpreters. Now we can activate the environment from the terminal:

```
conda activate cs197lec2
```

Depending on your settings, we still have to tell VSCode where to find the Python interpreter to use for the program we want to run. We want to use the environment we just created. Use the Command Palette (⇧⌘P or Ctrl+Shift+P on Windows) to select the interpreter. We want the `cs197lec2` environment.

Okay, now we're ready to execute our program and help out our colleague. Using the command palette again, we can now run the program:

And so it runs...

It came back with an error! Alright, it looks like we're missing a module. We're in our conda environment so we can install the package. A quick google search tells us how to install tqdm (prefer the conda installation over the pip installation when possible):

After the installation is successful, we can run the program again.

We have an error, but it's not a module error. That's good.

We may want to share your environment with more colleagues. To allow them to quickly reproduce our environment, with all of its packages and versions, we're going to give them a copy of our `environment.yml` file.

We do this by exporting the conda environment. If we say:

```
conda env export --from-history --file environment.yml
```

Expert user caveat: The above command is not going to work when you use pip to install anything, but it'll allow you to have environment files that work across platforms if you stick to using conda for installs.

You can learn more about exporting environments here. If you want to make your environment file work across platforms, you can use the `conda env export --from-history` flag. This will only include packages that you've explicitly asked for, as opposed to including every package in your environment.

It's time to get to the next step here.

## Git

We're going to use Git and Github for collaboration. What's the difference? Why don't we ask GPT3 (see lecture 1 for more information of how we do that):

That's correct. I think it's possible to do lots of software engineering without understanding the basics of Git, but I think it's worth spending the time. I would first read through this page (https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F). I want to highlight in particular the three main states that your files can reside in: modified, staged, and committed.

The basic Git workflow goes something like this:
1. You modify files in your working tree.
2. You selectively stage just those changes you want to be part of your next commit, which adds only those changes to the staging area.
3. You do a commit, which takes the files as they are in the staging area and stores that snapshot permanently to your Git directory.

Git is a powerful tool, and it's worth giving it some attention to get the fundamentals down. I would encourage you to read the following 3 chapters:
1. Chapter 2: https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository
2. Chapter 1: https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control
3. Chapter 3: https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell

Here's the cheat sheet you want to have: https://training.github.com/downloads/github-git-cheat-sheet.pdf

Let's put the above in action. We just created a file `environment.yml`: we're going to track the new file in a new branch. VSCode has some useful features for using directly from within the editor: https://code.visualstudio.com/docs/editor/versioncontrol

On the left sidebar, you can see the source control icon. We're going to create a new branch here, called 'fix'.

Now we're in the fix branch, we're going to track the `environment.yml` file. I click on it, and then click the '+' button to stage changes.

We now see the `environment.yml` under the staged changes. Let's go ahead and add a commit message. How do we compose a Git commit message?

Here are seven rules for a proper git message, from this guide:
1. Separate subject from body with a blank line
2. Limit the subject line to 50 characters
3. Capitalize the subject line
4. Do not end the subject line with a period
5. Use the imperative mood in the subject line
6. Wrap the body at 72 characters
7. Use the body to explain what and why vs. how

I've found that the use of the imperative mood in the subject line is the one that most surprises new programmers. A nice aid here is that a properly formed Git commit subject line should always be able to complete the following sentence:

If applied, this commit will *your subject line here*

For example:
- If applied, this commit will refactor subsystem X for readability
- If applied, this commit will update getting started documentation
- If applied, this commit will remove deprecated methods
- If applied, this commit will release version 1.0.0

Here's the example we have:

```
Summarize changes in around 50 characters or less

More detailed explanatory text, if necessary. Wrap it to about 72
characters or so. In some contexts, the first line is treated as the
subject of the commit and the rest of the text as the body. The
blank line separating the summary from the body is critical (unless
you omit the body entirely); various tools like `log`, `shortlog`
and `rebase` can get confused if you run the two together.

Explain the problem that this commit is solving. Focus on why you
are making this change as opposed to how (the code explains that).
Are there side effects or other unintuitive consequences of this
change? Here's the place to explain them.

Further paragraphs come after blank lines.

 - Bullet points are okay, too

 - Typically a hyphen or asterisk is used for the bullet, preceded
   by a single space, with blank lines in between, but conventions
   vary here

If you use an issue tracker, put references to them at the bottom,
like this:

Resolves: #123
See also: #456, #789
```

In reality, you don't have most commit messages being this long, but let's try to get into the habit of following the git style rules.

We should be happy with this commit message (you can verify it follows all 7 rules). We can publish the branch to github to see the new branch with changes on github. Note that if you try to push to my repository, it won't work; make sure you have forked your own repo and then push to it.

Expert User Tip: There's a VSCode extension (GitHub.vscode-pull-request-github) that also allows you to do pull requests within VSCode.

Our push to remote was successful. Here we can see the new commit in the fix branch.

> **Exercise**
> Fork a public repo. Make a small change to the README, create a new branch and make a commit message that follows the aforementioned rules, and push it to your fork.

## Debugging

We are now ready to help our colleague with their code. Last we were left with the following error:

Using print statements to debug is fairly common, especially among beginner programmers. If I am not familiar with a debugging configuration, print is the first thing I would use too. However, I would like to show you how to debug without relying on print statements. We're going to use the Debug start view (on the left).

Before diving into the following, it would be useful for you to read https://code.visualstudio.com/docs/editor/debugging

Now we hit the 'Run and Debug' Button. We can also get to it using F5.

Let's select the "Python file" debug configuration.

We're now presented with the above view. It looks like we have an error where we were trying to copy the path. Path should be a list, not an integer. From the left panel of local variables, we see that's not the case. `paths` should have been initialized using `[[startPos]]`. We can test whether we would then be able to use `path.copy()` using the debug console in the Panel bottom of screen.

Looks like that would work; so now we modify the code.

It looks like the code ran – hurrah! We have solved the attribute error. At this point, we want to git commit the change we made. So we can go ahead and do that.

We shouldn't be too happy yet though. We've gotten the code to run, but is the output what we expect?

From our test docstring itself, it doesn't look like it. We should have returned 3, not 0! So what happened? Let's go back to the debugger.

### Breakpoint

To understand what's going on, I am going to see what 'paths' looks like after we have finished populating it. Rather than add a print statement there, we're going to add a breakpoint.

Now we hit run and debug.

You can see that execution has stopped and on the right that we get to see into the paths variable. In addition, we have the debug toolbar which has appeared on top.

What do the colors and shapes in the editor margin mean? From https://code.visualstudio.com/docs/editor/debugging#_breakpoints:

> Breakpoints can be toggled by clicking on the editor margin or using F9 on the current line. Finer breakpoint control (enable/disable/reapply) can be done in the Run and Debug view's BREAKPOINTS section.

- Breakpoints in the editor margin are normally shown as red filled circles.
- Disabled breakpoints have a filled gray circle.
- When a debugging session starts, breakpoints that cannot be registered with the debugger change to a gray hollow circle. The same might happen if the source is edited while a debug session without live-edit support is running.

The debug toolbar has 5 options:
- Continue / Pause F5
- Step Over F10
- Step Into F11
- Step Out ⇧F11
- Restart ⇧⌘F5
- Stop ⇧F5

Why google them when you can simply ask GPT3?

A little more detail on the difference between Step Over, Into, and Step Out.
- If the current line contains a function call, Step Over runs the code and then suspends execution at the first line of code after the called function returns.
- On a nested function call, Step Into steps into the most deeply nested function. For example, if you use Step Into on a call like `Func1(Func2())`, the debugger steps into the function Func2.
- Step Out continues running code and suspends execution when the current function returns. The debugger skips through the current function.

Back to our debugger output; something is suspicious. Our paths should only get longer; how is it that they're getting shorter? Before stepping through the whole function, I'd like to know what the variable 'paths' looks like at the end of every iteration.

### Logpoint

I could do this by manually inspecting paths by setting a breakpoint within the outer for loop; but it's a good opportunity for us to learn about another debugging tool – logpoints. See https://code.visualstudio.com/blogs/2018/07/12/introducing-logpoints-and-auto-attach

A Logpoint is a breakpoint variant that does not "break" into the debugger but instead logs a message to the console.

Logpoints allows you to "inject" on-demand logging statements into your application logic, just like if you had added logging statements into your application before starting it. Logpoints are injected at execution time and not persisted in the source code, so you don't have to plan ahead but can inject Logpoints as you need them. Another nice benefit is that you don't have to worry about cleaning up your source code after you are finished debugging.

Here's a good example GIF of how to use logpoints:

Back to our code. We're going to add a logpoint before we add the `new_path_left` and `new_path_right`. Here we will print the loop counter i, paths, new_path_left, new_path_right in that loop iteration.

Now we hit restart (notice the editor margin will now have a red diamond corresponding to our logpoint):

We can now open the debug console to find the logging.

Are you impressed? We've been able to add logging without making our code clunky with print statements everywhere.

> **Exercise**
> Take a few minutes to think about what the expected outputs here should have been. How many issues do you see in the above output?

I can see four issues here:
1. Left and Right are the same in the first iteration; we would have wanted it to be Left: [1, 0], and Right: [1, 2].
2. i = 0 repeats thrice, but we should be at i = 0 just once, because the length of paths when we start should be 1.
3. All paths towards the end of an iteration should be the same length, not different lengths. We're not removing the paths.
4. i = 1 is where our iteration stops. We should be getting to i of 2.

My workflow is going to be the following: I am going to fix each issue by fixing the lines of code corresponding to it, rerun to see the output, and if solved, commit my change to git.

1. Left and Right are the same in the first iteration; we would have wanted it to be Left: [1, 0], and Right: [1, 2].

We should be able to fix this by fixing the line so that the minus is a plus:

```python
            new_path_right = new_path + [last_position - 1]
```

Let's rerun now:

Woah! We have a program that keeps logging: it's not stopping now, so we're going to need to hit the pause button. But we have the clue we need: we're always at iteration 0! Why would paths never be ending?

Pro tip: It's tempting to get started at solving the next problem, but you should instead take time to commit the fix you made (we're not going to show this). Then we come back to fixing the next problem!

We're making a classic python error: modifying a list when iterating over it. We're going to implement the following solution:

This takes care of both (1) only iterating over the subset of the list that exists at the start of the iteration, and (2) removing the path of interest from the list.

We can now debug this:

The good news is: all of our previous 4 errors are now no longer! However, the output isn't quite what we expect. We see that the [1,0] branch has been lost even though we could do [1,0,1,2] in the next step. It could be something to do with our 'continue' statement. We're going to set a breakpoint there:

We're going to add both sides of the condition to the 'watch list': here, variables and expressions can be evaluated and watched in the Run and Debug view's WATCH section.

Now that we have added these expressions to the watch list, we can see that the condition is not quite right.

We can fix the error: the Right Hand Side of the expression should be 'k - i', not 'k - i - 1'. Let's fix it, disable the breakpoint, and rerun debug.

We see something good here! In the inner loop, we're running through the i=0 iteration once, the i=1 iteration 2 times, and the i=2 iteration 3 times. Importantly, at the end, we're ending up with 6 possible paths, 3 of which end in 2. That sounds right.

Rather than debug, why don't we hit 'run'?

Another error, but at least we've fixed the last one; we should commit that change.

Back to the above error, let's look at what's happening in code.

That's a really easy error to fix! I'm surprised we didn't find it before? Could we have caught that even before execution? Great questions, and the answer lies in linting.

## Linting

At this point, we're going to get pretty used to just asking GPT-3 for definitions.

How do we enable a linter to do work within an editor? VSCode has great linting integration: https://code.visualstudio.com/docs/python/linting

Linting can detect "use of an uninitialized or undefined variable, calls to undefined functions, missing parentheses, and even more subtle issues such as attempting to redefine built-in types or functions."

Let's use command palette to enable linting. Let's first use flake8 linting (you may have to use the prompt to complete installation):

We're now going to be able to see a squiggly line underneath `new_ways`, and a problems status (Keyboard Shortcut: ⇧⌘M).

We can fix these issues now, and commit the changes. After that we can try out the pylint linter as well. This might pick up other style recommendations for us.

It does. I will show one fix here, and leave the rest as an exercise for the reader. Let's say we wanted to rename `startPos` to `start_pos` to make it conform to snake_case naming. We can use a VSCode Refactor functionality called Renaming (https://code.visualstudio.com/docs/editor/refactoring#_rename-symbol):

> Renaming is a common operation related to refactoring source code and VS Code has a separate Rename Symbol command (F2). Some languages support rename symbol across files. Press F2 and then type the new desired name and press Enter. All usages of the symbol will be renamed, across files.

Note that it won't change our docstring, but that's okay, and may be better than a string find and replace in cases where the string might be a substring of other strings. Let's fix the rest of the issues.

Now, we can see there are no more problems in the code. We'll make a commit.

We can see it finally works.

You can pick up Python style using these linters as you go. But it is useful to just know about many of these rules in the first place. I suggest the following three guides:
1. https://docs.python-guide.org/writing/style/
2. https://peps.python.org/pep-0008/
3. https://google.github.io/styleguide/pyguide.html

> **Exercise**
> Challenge yourself with the arguments startPos=264, endPos=198, k=68. See whether you can implement the solution using recursion and make it fast. Pass the leetcode submission test!

> **Exercise**
> Try another problem from leetcode. For example, https://leetcode.com/problems/merge-k-sorted-lists/
>
> You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.
> Merge all the linked-lists into one sorted linked-list and return it.

We've been given the following example (I'm going to ignore the other provided examples):

```
Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]
Explanation: The linked-lists are:
[
 1->4->5,
 1->3->4,
 2->6
]
merging them into one sorted list:
1->1->2->3->4->4->5->6
```

Try an iterative solution first (for loop), and then a recursive solution (using recursion). Do turn Github Co-pilot off.

## Limitations

Alas, we haven't had the chance to cover testing, and a couple of very useful VSCode features like Live Sharing. Maybe we'll get to these in a future lecture, but I want to link them here for now.
- https://code.visualstudio.com/docs/python/testing
- https://realpython.com/advanced-visual-studio-code-python/

## Contributing to this doc

Some of the keyboard shortcuts used in the lecture may not work for Windows users. In that case, please suggest additions + modifications directly on the document.

## The Zen of Python

This lecture is titled the Zen of Python. These are a collection of 19 "guiding principles" for writing Pythonic code, written by one of the core Python Programmers, Tim Peters, who posted it on the Python mailing list in 1999.

::: added seeing the Zen for yourself
The full 19 aphorisms print out if you run `import this` in any Python interpreter. A few that echo this lecture: "Readability counts," "Explicit is better than implicit," and "There should be one - and preferably only one - obvious way to do it." They are the spirit behind the style and linting conventions above.
:::

## Conclusion

My hope with this lecture was to give you a sense of what a Python engineering workflow –– which is at the heart of many AI projects –– looks like. You have now seen a combination of tools: VSCode (Editing, Debugging, Linting), Conda, Git/Github, and I hope that you challenge yourselves to get better at these tools. It's a continual investment in learning, and becoming a master of the tool makes you more efficient over time, especially as the project sizes grow. My recommendation to you when coding is to maintain a curiosity for learning! Think about the tasks that you are doing which are repetitive and feel unnecessarily manual or slow – they likely don't have to be. You will see effective software engineering translate into effective AI engineering and research.
