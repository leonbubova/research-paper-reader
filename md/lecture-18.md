---
course: Harvard CS197
term: Fall 2022
lecture: "18"
title: Research Productivity Power-Ups
subtitle: Tips to Manage Your Time and Efforts
instructor: Pranav Rajpurkar
source_notes: https://docs.google.com/document/d/18TL9AQjKwJnYLVBydN94IB8vX6O_Ay4HWjFg_5zX5FA/edit
course_site: https://cs197.seas.harvard.edu/
learning_outcomes:
  - Learn how to use update meetings and working sessions to stay aligned and make progress on a project.
  - Understand how to use various tools and techniques to improve team communication and project organization.
  - Learn strategies for organizing your efforts on a project, considering the stage of the project and the various tasks involved.
tags: [research-productivity, time-management, team-communication, project-organization, technical-debt]
provenance: Prose is the author's original lecture notes, transcribed. Blocks marked "Added explanation" were written for this reader and are not the author's words.
---

*Notes commented by Isaac Robinson, and edited by Alyssa Huang.*

## Abstract

In this lecture, you will learn strategies for effective communication within a team and organizing your efforts on a project. You will be introduced to the use of update meetings and working sessions to maintain alignment and make progress on a project, as well as the importance of dedicating specific blocks of time on a calendar and using a project tracker for organization. You will also learn how to effectively organize your efforts on a project, taking into consideration the stage of the project and the various tasks that may be involved.

*StableDiffusion 2.1 Generation: "Person surrounded by clocks and ideas in expressionist style"*

**Learning outcomes:**
- Learn how to use update meetings and working sessions to stay aligned and make progress on a project.
- Understand how to use various tools and techniques to improve team communication and project organization.
- Learn strategies for organizing your efforts on a project, considering the stage of the project and the various tasks involved.

## How do I make short-term progress?

Let's break this down into two pieces: organization and effort.

**Organization:** My tool of choice for organization is a project tracker. A project tracker is a Google document in which you specify the progress you've made, the challenges you're encountering and the next steps that you are tackling.

Think of the project tracker as your journal or diary or a log. It can remind you of the progress that you're making, and the direction you're headed. Every entry in the project tracker is marked by the date. In addition, Bullet points are organized and in sufficient detail such that a search that a future version of you project team member will be able to understand. The project tracker often links to important reference documents including a related work document, a working manuscript document, and an experimental results report (such as a google sheet or a Weights and Biases table.

While the project tracker can be helpful even when you're working as an individual it is super helpful when working in a group. In particular everyone in the group can know what the other members of the group are working on. When working in a group, It's useful to annotate the team member responsible for each of the upcoming tasks.

On organizing your readings: It helps to have a related word document where you can keep a list of all of the papers you are reading. One of the things I like to do is to annotate papers with one, two or three stars. One star papers are irrelevant (but you found out only after reading); two stars are relevant; three stars are highly relevant. What makes a paper relevant is that it might be the work that you're building on in terms of methodology or following in terms of the experimental set up or using as the dataset for your work. You should aim to have about 3-5 papers in the three star category. Finding important papers is a continuous process so it's something that you should continue to come back to and iterate over time. Something you can do is set up google scholar alerts for articles that are related to the topic for your project and that way you get an email notifying you when there's a new paper that triggers your search criteria. You can either organize your related works into a spreadsheet or in a word document – when you're working with an a team you're often dividing up the papers to read. This is an effective strategy to cover a lot of ground and notes are a useful way to share learnings with the rest of your team. The exception is that with three star papers, everyone in the group should read and make notes on.

**Effort:** In my experience, the ability to commit quality time to a project has been the most distinguishing feature of a successful outcome. My tool of choice is a google calendar. On a calendar, you can specify chunks of time that are dedicated to working on a project. A recurring weekly time reduces the overhead associated with planning. Some of the calendar events will be for communication with your team and we will discuss that in the next section.

> **Exercise (5 mins discuss):** How does this compare to industry practices for effective team communication? Anonymized examples for industry practices outlined below:
> - It's common to have daily, biweekly, or weekly standups, where the team checks in on each member's progress. These standups typically serve to sync up all members and unblock and/or readjust goals if necessary.
> - At the start of each week, team members plan out what they want to get done for the week. This may also occur on a daily basis.
> - Many companies often have company-specific sprint boards/task managers that are linked to your work product. Most of the employees' work is tracked using these tools. Some popular tools for task management include:
>   1. Notion
>   2. Tableau Task Manager
>   3. GitHub Issues

> **Exercise (5 mins discuss):** Argue: Is a document or a slide deck better suited for a project tracker – why? Arguments for each copied here.
> - Pro Slide Deck
>   1. Slide decks are typically shorter and require less overhead to compile. Especially for jotting down initial project ideas when the details might be fleshed out yet, slide decks may be more effective.
>   2. Slide decks are better for presentation purposes. If you plan to be frequently pitching and/or presenting your project to others, a slide deck may be a better format.
>   3. Slide decks are better suited for highlighting big ideas. Readers can quickly grasp the high level ideas of your project by going through a slide deck.
> - Pro Document
>   1. Documents are typically longer than slide decks text-wise, and they force more clarity and specificity. In a final version of a document, all the ideas are typically expected to be more fleshed out and complete.
>   2. It's easier to search for key terms in a document (just use "command f").
>   3. Documents are easier to convert into wikis that can later be easily accessed by multiple people since they're already in written form.

> **Exercise (10 mins; 5 mins discuss):** Come up with a template for your project tracker. Fill it out for your progress over the last fortnight. Best template for each copied here.

**Notion Template:**
- Consider using a project tracker template from online or creating one from scratch such as the one below
- You can also toggle between different views for your project tracker, as well as add external links to your project drive and github repository!
- You can also link other notion pages within your notion page!

**Project Tracker in Google Docs Template:**

Week of November 6-12
- Meeting Objective Description
- Progress Updates (per person)
  - Code
  - PRs
  - Text Descriptions
- Current Issues/Blockers
  - What has been done to address
  - What still needs to be attended to
- Next Steps (with assignments per person)

> **At home exercise:** Come up with a best practice to organize your experiments, and organize your writing. Support your best practice suggestions with evidence from literature or your own experience. Estimated word Count: 300-400 words

## How do I communicate with my team?

Effective communication within a team is key to the success of a project. Because of the uncertain nature of research, it's important to create and maintain alignment in the project direction between the members of the team. One effective strategy is to have recurring meeting times. Meetings are of two types: a sync and a working session.

**Update meeting:** I have update meetings for projects once or twice a week for the duration of 30 minutes to 1 hour. The purpose of the update meeting is to discuss solutions to challenges encountered and to realign on next steps. If your project has a research mentor, this is typically the type of meeting you will have with them.

For an effective update meeting, It makes sense to have structure. Personally I like to spend the first five minutes asking team members about life in general and sharing things about my life. This adds often much needed human touch to the conversation. Then, everyone reads through the latest entries in the project tracker by the team members. Then each of the team members take turns expanding upon their progress. As team members share challenges they need help with, other team members can offer solutions or decide to have a follow up working session. It helps to update the project tracker itself with the solutions, or add next steps that may be of higher priority than the ones specified.

**Working session:** Another type of a meeting is a working session. These are typically longer chunks of time that are reserved for working together (1 hour - 3 hours): You might be working on separate tasks in the remote company with your team or working together on solving one task. I often get together with my teams for working sessions to collaboratively iterate on the structure and argument of a paper. Another effective model for working sessions is pair-coding or pair-writing. In the set up you get together with a team member to do a common task, where one person takes the lead on writing a piece of code or a paragraph while screen sharing, and the other person validates the logic or correctness or style. After an hour or so you can flip roles. This is often an effective way of observing and learning from different styles of coating in writing. This is most effective when both individuals in the pair have a similar skill level in coding or similar writing style. It can also be effective to have working sessions to have your code reviewed by other team members.

In addition to meetings, offline communication is often necessary. I encourage my teams to use a project specific slack channel for communication, and Private DM's on Slack for questions that might only be relevant to one of their team members. Having a public channel encourages transparency between members of the group minimizing potential for misalignment. Communication however does come at a price: Ideally the update meeting and recurring working sessions should provide sufficient clarity for individuals or substitute the team members to make progress without requiring communication on a more frequent basis. Jeff Bezos quote is that communication is a sign of dysfunction A famous Jeff Bezos quote: "Communication is a sign of dysfunction. It means people aren't working together in a close, organic way. We should be trying to figure out a way for teams to communicate less with each other, not more."

> **Exercise (5 mins discuss):** How does this compare to industry practices for effective team communication? Anonymized examples for industry practices outlined below:
> - In industry, many standups are at least partially asynchronous. The standup may begin by having everybody write down their updates and read others' updates in silence. This speeds up the meeting because you can read faster than listen.
> - Public slack channels are used for messages that need to be disseminated to many parties. Public Q&A channels, as well as debugging Q&As (similar to stack overflow), can also be helpful.
> - In person meetings are primarily used to align team members. Many people find that in person meetings are a lot more efficient than Zoom meetings since a lot of times people are checked out on zoom meetings.

> **Exercise (5 mins prepare; 5 mins discuss):** Argue: Should offline communication be minimized or does it have its place – why? Best argument for each copied here.
> - Arguments for Online Communication:
>   - It's self-annotating — we have a clear log of messages we can look back on.
>   - Wikipedia is a decentralized, highly successful project all done through online communication.
> - Arguments for Offline Communication:
>   - It can be quicker to talk through new ideas at the beginning when in person.
>   - Easier to develop rapport with team members.

> **Exercise (10 mins; 5 mins discuss):** Come up with best practices for your team for online and offline communications.
> - Teams could use in-person meeting times to set milestones and divide tasks among members. This step should minimize the need for constant communication moving forward.
> - To decrease online communication, groups can encourage the following processes:
>   - Update/planning meetings
>   - Individual working hours
>   - Group working hours (i.e. pair-programming or debugging)
> - Teams can use project management tools such as Linear or Jira to track which tasks have/haven't been completed, as well as keep track of who's in charge of what.
> - It could be helpful to set up frequent times to meet with the professor in order to have more internal deadlines. Blockers can also be more easily resolved with a professor present.

> **At-home Exercise:** What learnings from literature can we apply to build effective communication (online and offline) for teams in research? Estimated word Count: 300-400 words

## How do I organize my efforts on a project?

The nature of tasks will change a lot depending on the state of the project. Over the course of a project, this might vary between making notes on related works, iterating on a proposal for a methodology or experimental setup, writing code to implement a method, compiling and presenting results and iterating on writing and figures. The stage of the project is thus a big determiner of how you are spending your time. [add note about starting to write on the paper as soon as possible]

### What organization principles should I follow?

Regardless of where you are on the project, it's useful to have good organization and documentation principles. If you are reading, then maintain notes on what you are reading. If you are setting up an experimental design or proposing a method, then writing down the details at a level of detail that would make it possible to have a straightforward translation to code or such that another person can pick it up. If you are compiling results, then make the process of processing the output of each experiment into a visual depiction as a table or figure as automated as possible. A good litmus test on documentation is that if a new person joined your team, how quickly could you ramp them up to be a useful contributor on your project. The easier you make it for this person, the easier you make it for your future self.

In software engineering, there is a concept of technical debt. This is the "implied cost of additional rework caused by choosing an easy (limited) solution now instead of using a better approach that would take longer." This applies to more than just software engineering – it applies to how related work is organized and maintained – it applies to how experiments are tracked – to how the papers are written. Sometimes, technical debt is not a bad thing – a quick proof of concept in research might require trying out two codebases to see which works better; or a traditional experiment tracking setup in which you copy-paste accuracy values from print statements into google spreadsheets. As with other debt, technical debt will incur interest, making it harder and harder over time to have correct, functional and easily extensible code or experiments.

I've picked some of the most important examples of technical debt in software which I see (sourced from here):
1. Lack of software documentation, where code is created without supporting documentation. The work to create documentation represents debt.
2. Lack of knowledge, when the developer doesn't know how to write elegant code.
3. Deferred refactoring; As the requirements for a project evolve, it may become clear that parts of the code have become inefficient or difficult to edit and must be refactored in order to support future requirements. The longer refactoring is delayed, and the more code is added, the bigger the debt.
4. Parallel development on multiple branches accrues technical debt because of the work required to merge the changes into a single source base. The more changes done in isolation, the more debt.
5. Postponing pushing local changes to the upstream project (Github) is a form of technical debt

> **Exercise (5 mins discuss):** What are practices you have encountered for minimizing technical debt, as part of your internships / work. Three anonymized examples for each copied here.
> - Frequently documenting your code. This can be done through docstrings, in-line comments, commit messages, or the README. Design decisions should be communicated through this documentation.
> - Frequently refactoring code after getting a working version out to facilitate future development.
> - Having smaller commits and smaller branches in order to ensure that each group member has a relatively updated version of the repository.

> **Exercise (10 mins; 5 mins discuss):** Come up with best practices to minimize technical debt for your group. If you were responsible for setting a standard for your team, what would you propose for your workflow?

> **At home exercise:** Come up with best practices for minimizing technical debt for non-coding parts of your project. For instance, you could comment on tracking experiments and iterating on writing. Support your best practice suggestions with evidence from literature or your own experience. Estimated word count: 300-400 words
