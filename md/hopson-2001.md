---
collection: Papers
kind: article
title: Behavioral Game Design
authors: John Hopson
affiliation: Duke University (at time of writing); later Head of User Research, Bungie
published: Gamasutra (now Game Developer), April 27, 2001
year: "2001"
source_notes: https://www.gamedeveloper.com/design/behavioral-game-design
source_label: Game Developer
tags: [game-design, operant-conditioning, reinforcement-schedules, player-motivation, retention]
learning_outcomes:
  - Map the four reinforcement schedules onto concrete game mechanics.
  - See why fixed-ratio rewards create the pause that makes players walk away.
  - Read the primary text behind the "games are Skinner boxes" argument, and see what it does and does not claim.
provenance: Hopson's prose is transcribed verbatim from Game Developer, with his original section headings. Blocks marked "Added explanation" were written for this reader and are not Hopson's words.
---

::: added Two corrections before you read
This is **John Hopson**, not John Hobson. (J. Allan Hobson is a Harvard sleep and dream researcher with no connection to games, which is where the name collision probably comes from.)

Second, and more important: **this article is not about addiction.** Hopson never uses the word. It is a design primer applying [Skinner's](lecture.html?d=skinner-1948) reinforcement schedules to reward pacing, written by a psychology PhD student who later ran user research at Bungie. He explicitly frames it as descriptive: "What is being offered here is not a blueprint for perfect games, it is a primer to some of the basic ways people react to different patterns of rewards."

The addiction framing is **reception, not authorial intent**. This piece became the most-cited text in the "games are Skinner boxes" critique that peaked in the social and mobile era roughly a decade later, and Hopson has pushed back on that reading. There is a closing note on that below. Read the article for what it says, then judge the reception separately.

It is also a trade article, not a peer-reviewed paper, and it cites no sources.
:::

The techniques that I'll discuss in this article generally fall under the heading of behavioral psychology. Best known for the work done on animals in the field, behavioral psychology focuses on experiments and observable actions. One hallmark of behavioral research is that most of the major experimental discoveries are species-independent and can be found in anything from birds to fish to humans. What behavioral psychologists look for (and what will be our focus here) are general "rules" for learning and for how minds respond to their environment. Because of the species- and context-free nature of these rules, they can easily be applied to novel domains such as computer game design. Unlike game theory, which stresses how a player should react to a situation, this article will focus on how they really do react to certain stereotypical conditions.

What is being offered here is not a blueprint for perfect games, it is a primer to some of the basic ways people react to different patterns of rewards. Every computer game is implicitly asking its players to react in certain ways. Psychology can offer a framework and a vocabulary for understanding what we are already telling our players.

## Contingencies and Schedules

The concrete translation of "What are we asking of our players?" is "What are our contingencies?" A contingency is a rule or set of rules governing when rewards are given out. The anecdote about this discovery (as passed to me by one of his students) is that one day B. F. Skinner ran low on the small food pellets he gave the rats in his experiments. Rather than risk running out and having to stop work for the day, he began to provide the pellets every tenth time the rats pressed the lever instead of every time. Experimenting with different regimens of reward, he found that they produced markedly different patterns of response. From this was born a new area of psychology, and one that has some strong implications for game design.

Some common terms in behavioral psychology as they apply to game design considerations:

- **Reinforcer:** An outcome or result, generally used to refer to a reward. Examples: an experience point, winning a level, a bigger gun.

- **Contingency:** A rule or set of rules governing when reinforcers are given. Also referred to as a schedule of reinforcement. Examples: a level every 1,000 experience points, a bonus level that is only available if you kill a certain opponent.

- **Response:** An action on the part of the player that can fulfill the contingency. This could be killing a monster, visiting an area of the game board, or using a special ability.

The contingencies in computer games are more complex, but the analogy is clear enough. For example, players in an RPG earn experience points to gain levels or collect bonus items to gain extra lives. In an arcade-style game, power-ups appear at random intervals, or only when certain conditions are met. As in any contingency, there are actions on the part of the participant which provide a reward under specific circumstances. This is not to say that players are the same as rats, but that there are general rules of learning which apply equally to both.

## Ratios and Intervals

There are essentially two fundamental sorts of contingencies, ratios and intervals. Ratio schedules provide rewards after a certain number of actions have been completed. For example, a player might gain an extra life after killing 20 opponents. This would be called a "fixed ratio" schedule, because the same number of kills is required every time. Other types of ratios will be discussed later.

One of the most common contingencies found in games, fixed ratio schedules typically produce a very distinct pattern in the participant. First there is a long pause, then a steady burst of activity as fast as possible until a reward is given. This makes sense when one considers that the very first action never brings a reward, so there is little incentive to make that first kill. Once participants decide to go for the reward, they act as fast as they can to bring the reward quickly.

The distinct pause shown under a fixed ratio schedule can be a real issue for game designers. Having a period of time where there is little incentive to play the game can lead to the player walking away. Additionally, the length of the pause is a function of the size of the ratio (the number of actions required), so the more actions required the longer the pause. This means that if the ratio increases over time, such as the increasing number of experience points required to gain a level in Dungeons & Dragons, so does the pause. Eventually, the pause can become infinite, and the player simply decides it's not worth it and walks away.

On the plus side, during the pause other, less rewarding activities often come to the fore. For example, if players know it will take them a long time to gain their next level, they might take the time to test a new tactic or try out different aspects of the game.

There are also "variable ratio" schedules, in which a specific number of actions are required, but that number changes every time. A player might be required to shoot down approximately 20 enemy fighters to gain an extra ship, but the precise number is randomly generated each time. It's important to note that the player does not know how many actions are required this time, just the average number from previous experience.

Under variable ratio schedules, participants typically respond with a steady flow of activity at a reasonably high rate. While not quite as high a rate as the burst under a fixed ratio schedule, it is more consistent and lacks the pausing that can cause trouble. Since it's possible (though unlikely) that the player can gain a life for shooting down only one enemy, there's always a reason to go hunting.

In general, variable ratio schedules produce the highest overall rates of activity of all the schedules that I'll discuss here. This doesn't necessarily mean they're the best, but if what you're looking for is a high and constant rate of play, you want a variable ratio contingency.

On the other side of the coin there are interval schedules. Instead of providing a reward after a certain number of actions, interval schedules provide a reward after a certain amount of time has passed. In a "fixed interval" schedule, the first response after a set period of time produces a reward. For example, the game might introduce a power-up into the playing field 30 minutes after the player collected the last one.

Participants usually respond to fixed interval contingencies by pausing for a while after a reward and then gradually responding faster and faster until another reward is given. In our power-up example, the player would concentrate on other parts of the game and return later to see if the new power-up had appeared. If it hadn't, the player would wander off again. Gradually the checks would become more frequent as the proper time approached, until at about the right time the player is sitting there waiting for it.

As in the fixed ratio, there is a pause that can cause problems for a game designer. Unlike the fixed ratio, there is no sharp transition to a high rate of activity. Instead, there is gradual increase as the appropriate time approaches. The pause remains, a period where player motivation is low.

There are also "variable interval" schedules, where the period of time involved changes after each reward. A counterpart to the variable ratio schedules, these also produce a steady, continuous level of activity, although at a slower pace. As in the variable ratio schedule, there is always a reason to be active. The power-up mentioned in the earlier example could reappear immediately after being collected or an hour later. The motivation is evenly spread out over time, so there are no low points where the players' attention might wander. The activity is lower than in a variable ratio schedule because the appearance is not dependent on activity. If the player looks for the power-up 1,000 times during the interval, it will appear no faster. Experiments have shown that we are very good at determining which consequences are the results of our own actions and which are not.

These are the basic building blocks, but this is by no means an exhaustive list. Each contingency is an arrangement of time, activity, and reward, and there are an infinite number of ways these elements can be combined to produce the pattern of activity you want from your players.

## Special Cases

There are a few special cases in the study of contingencies that deserve special mention. First, there are "chain schedules," situations where there are multiple stages to the contingency. For example, players may have to kill 10 orcs before they can enter the dragon's cave, but the dragon may appear there at random points in time. These schedules are most commonly found in multi-stage puzzles and RPG quests, and people usually respond to them in a very specific way: they treat access to the next stage of the schedule as a reward in itself. In the example just mentioned, most players would treat the first part as a fixed ratio schedule, the reward being access to the subsequent variable interval schedule.

Secondly, there is the question of what happens when you stop providing a reward, which is referred to as "extinction." Say the player is happily slaying the dragon every time it appears, but after a certain number of kills it no longer appears. What will the player do? The answer is that behavior after the end of a contingency is shaped by what the contingency was. In a ratio schedule, the player will continue to work at a high rate for a long period of time before gradually trailing off. In a fixed interval schedule, their activity will continue to peak at about the time they expect to be rewarded for a few intervals before ceasing.

As a general rule, extinction involves a lot of frustration and anger on the part of the subject. We expect the universe to make sense, to be consistent, and when the contingencies change we get testy. Interestingly, this is not unique to humans. In one experiment, two pigeons were placed in a cage. One of them was tethered to the back of the cage while the other was free to run about as it wished. Every 30 seconds, a hopper would provide a small amount of food (a fixed interval schedule, as described earlier). The free pigeon could reach the food but the tethered one could not, and the free pigeon happily ate all the food every time. After an hour or so of this, the hopper stops providing food. The free pigeon continues to check the hopper every 30 seconds for a while, but when it's clear that the food isn't coming, it will go to the back of the cage and beat up the other pigeon. Now, the interesting thing is that the tethered pigeon has never eaten the food and the free pigeon has no reason to think the other is responsible for the food stopping. The frustration is irrational, but real nonetheless.

A related phenomenon, called "behavioral contrast," occurs in chimpanzees, among other species. A chimpanzee is doing a simple task such as pulling a lever and is being rewarded with pieces of lettuce, which they like to eat. After doing this for a while, one pull is rewarded with a grape, which they really love to eat. On the next pull, the chimp is given lettuce again and they get very upset, throwing the lettuce at the experimenter. They were perfectly happy with lettuce before, but the presentation of the grape creates new expectations and when those expectations aren't met, frustration and anger invariably results.

The moral here is that reducing the level of reinforcement is a very punishing thing for your players and can act as an impetus for them to quit the game. It needs to be done carefully and gradually, or there may be an undesirable backlash. This applies even to temporary reductions, such as when killing orcs stops producing points but the player has not yet discovered that trolls can be killed instead. Sudden loss of reward is very aversive and should be avoided when possible.

A final special case that bears mentioning is what is called "avoidance," contingencies where the participants work to keep things from happening. A simple laboratory example involves a rat in a cage with a small lever. Every so often, a small shock (on the order of a static discharge from a walking across a carpet) is given through the metal floor of the cage. However, if the rat presses the lever, the shock won't happen for at least 30 seconds. The rat quickly learns to press the lever at a slow, steady rate and thus prevent the shock from occurring.

The best game example of this I know of is in Ultima Online, where players who own castles or houses are required to visit them regularly or they'll start to decay. As in the laboratory example above, you have participants who are working to keep things from happening, to maintain the status quo. This is a relatively cheap strategy from the point of view of game developers, since they don't have to keep providing the player with new toys or rewards.

Contingencies have been a major tool in psychology for more than 50 years, so there are a wide variety of special cases and unusual schedules. These three are just a sample of some special cases that are particularly applicable to game developers.

## Recipes

To help drive home the ideas I've discussed, here are some simple formulas of what contingencies to use to achieve specific results. These are not the only ways to solve these problems, but they are simple, reliable, and very effective.

**How to make players play hard.** Translated into the language we've been using, how do we make players maintain a high, consistent rate of activity? Looking at our four basic schedules, the answer is a variable ratio schedule, one where each response has a chance of producing a reward. Activity level is a function of how soon the participant expects a reward to occur. The more certain they are that something good or interesting will happen soon, the harder they'll play. When the player knows the reward is a long way off, such as when the player has just leveled and needs thousands of points before they can do it again, motivation is low and so is player activity.

**How to make players play forever.** The short answer is to make sure that there is always, always a reason for the player to be playing. The variable schedules I discussed produce a constant probability of reward, and thus the player always has a reason to do the next thing. What a game designer also wants from players is a lot of "behavioral momentum," a tendency to keep doing what they're doing even during the parts where there isn't an immediate reward. One schedule that produces a lot of momentum is the avoidance schedule, where the players work to prevent bad things from happening. Even when there's nothing going on, the player can achieve something positive by postponing a negative consequence.

**How to make players quit.** In other words, under what circumstances do players stop playing, and how can you avoid them? I've discussed two main conditions under which players will stop playing. The first is pausing, where their motivation to do the next thing is low. Motivation is relative: the desire to play your game is always being measured against other activities. While they may have a high overall motivation to play your game, during play they're comparing their motivation to do the very next thing in the game to all the other next things they could be doing. If they've just gone up a level and know that they have an hour of play before anything interesting happens, their motivation will be low relative to all the other activities they could be doing.

One way around this problem is to have multiple activities possible at any given time. This means that even if killing monsters becomes unrewarding, there are other activities within the game that can take up the slack. If monsters are unprofitable, exploration may be better. The player could take some time to improve their equipment or to practice a new tactic. Note that this is the same phenomenon that led to quitting before, a drop in motivation in the main activity raising the motivation of lesser activities. In this case, the lesser activities are also part of the game, redirecting their attention within the game and maintaining a high level of play.

The other situation that can lead to quitting is the sharp drop in rate of reward which I discussed in the chimpanzee example. Just like motivation, reward is relative. The value of the current reward is compared to the value of the previous rewards. If the current reward is 10 times the last one, it will have a big impact on the participant. If the current reward is weaker than experience has led them to believe, the player will experience frustration and anger. Violation of expectations is perceived as an aggressive act, an unfair decision by the game's creators. While the game can get more difficult over time, it's best to avoid sharp changes in the rate of reward. This is particularly applicable to puzzle games, where the player may have to spend hours on the same problem before moving on to the next. If the current problem is sharply more difficult than previous puzzles, the player may simply walk away.

## Conclusion

The application of general rules to a specific case is always tricky, especially in situations where there is more than one type of contingency operating. Most experiments in behavioral psychology are designed to illuminate a single phenomenon, like an X-ray revealing the bones of an arm. The skin, muscles, and so on aren't shown, so the resulting picture is incomplete. But even with just the bones, we can make a good guess about how the arm works, its limitations and flexibilities. The behavioral principles discussed here should be understood to have similar benefits and limitations. There are numerous other things that influence players, but the basic patterns of consequences and rewards form the framework which enable all the rest. By understanding the fundamental patterns that underlie how players respond to what we ask of them, we can design games to bring out the kind of player we want.

::: added The afterlife of this article
Hopson wrote a design primer. It got read as a confession.

Once Facebook and mobile free-to-play games arrived around 2009, "Behavioral Game Design" became the standard exhibit in the argument that the industry was deliberately engineering compulsion. The phrase "Skinner box game" entered the vocabulary, aimed first at *FarmVille* and its relatives, later at loot boxes. Critics pointed at the Recipes section in particular: a section literally titled "How to make players play forever" reads very differently in a world of daily-login rewards and paid randomized crates than it did in 2001, when the reference points were *Ultima Online* and tabletop D&D.

Hopson has objected to that reading. In a 2011 retrospective interview with Gamasutra, marking the article's tenth anniversary, he argued that the piece describes how reward pacing works rather than prescribing exploitation, and that the same principles are what make a well-paced game feel good instead of tedious. Both things can be true: the mechanisms are morally neutral, and the recipes are usable in either direction.

Where this genuinely bites: the tools here describe **rate of activity**, not enjoyment, and not wellbeing. Hopson's own conclusion concedes the limitation, comparing behavioral principles to an X-ray that shows the bones and not the skin or muscle. A variable ratio schedule reliably produces the highest, steadiest, most extinction-resistant play of any schedule. Nothing in the framework tells you whether that player is having a good time, and nothing in it tells you when maximizing that number stops being design and starts being predation. That question is left entirely to the designer, which is precisely what the critics noticed.

Worth pairing with: Staddon and Simmelhag's 1971 challenge to Skinner's superstition interpretation (noted in the primer on the [Skinner paper](lecture.html?d=skinner-1948)), and the post-2018 regulatory literature on loot boxes, where these schedules stopped being a design question and became a gambling-law one.
:::
