---
course: Harvard CS197
term: Fall 2022
lecture: "12–13"
title: Today Was a Fairytale
subtitle: Structuring a Research Paper
instructor: Pranav Rajpurkar
source_notes: https://docs.google.com/document/d/1pU9xLLCQI4X_Uaw_MTwjdIyCLuGQ4ojWP_9dkFqxdvI/edit
course_site: https://cs197.seas.harvard.edu/
learning_outcomes:
  - Deconstruct the elements of a research paper and their sequence.
  - Make notes on the global structure and local structure of the research paper writing.
tags: [research-paper-writing, paper-structure, scientific-writing, vision-language]
provenance: Prose is the author's original lecture notes, transcribed. Blocks marked "Added explanation" were written for this reader and are not the author's words.
---

## Abstract

Research papers have an expected structure to the writing: we start with an abstract and introduction and end with a conclusion or discussion. To effectively write a research paper, we can plan out its structure: the form and the structure both across and within sections. In this lecture, we'll go through machine learning research papers to understand how they are structured. We will pay particular attention to the global structure of paper (section organization), and also the local structure of the writing (sentence organization).

*DALL·E Generation: "oil painting of papers tied together in sequence"*

**Learning outcomes:**
- Deconstruct the elements of a research paper and their sequence.
- Make notes on the global structure and local structure of the research paper writing.

## Morphology of a Research Paper

In my second year of college, I took a course on narrative theory. The course was about stories, and more specifically about the characteristics that define a certain form of storytelling. One week, we read through some classic fairytales (think Cinderella, Snow White, The Little Mermaid), and then through a book that deconstructed their structure (Morphology). The experience felt akin to a reverse magic show – an unimpressive trick that becomes remarkable only after being revealed. Years later, I found myself drawing a parallel between fairytales and research papers, both forms willing to unabashedly skirt their structural rules, but not break them.

That parallel is the basis of the lecture today. The concept is simple: fairytales contain a limited number of elements, and they occur in an expected sequence. For example, "Villain attempts to deceive victim" is an element that might precede "Hero leave on mission." These structures can get quite intricate (some elements can be repeated, others only occur in pairs), but are thus able to express the structures of several traditional folktales, and many plots for modern movies. For an algorithmically minded person, the concept is quite the playground.

In this lecture, we are going to deconstruct three research papers. We will be able to identify and isolate the elements of the paper, and the sequence which connects them.

## Form follows Venue

Research papers can follow different structures. A biological science paper published in Nature has a different form to a computer science paper published at NeurIPS – see CheXzero for example. Our writing form is going to be based on where we intend to publish our paper. In machine learning, there are conference venues (more common) and journal venues (less common). Even within a venue (journal or conference), we're going to see variation in form between different kinds of papers: a paper proving something mathematical is going to look different to a paper evaluating different methods on a new dataset.

The approach I am going to take here is to teach you how you find the structure that is appropriate for the kind of paper you're writing for the kind of venue you are submitting to. When you read related work to your paper – and we've covered this in a previous lecture – you can pay attention to the venue it has been published in. This venue can likely also be a good one for your paper.

So I will ask you to begin this question by finding three papers that are closely related to the kind of paper you are writing or are interested in. For the remainder of this lecture, assume we are interested in proposing vision-language pretraining methods for vision-language tasks. We might have thus found three papers to use as closely related.

- VL-BEIT: Generative Vision-Language Pretraining
- FLAVA: A Foundational Language And Vision Alignment Model
- CoCa: Contrastive Captioners are Image-Text Foundation Models

Here are some notes we can make:

**VL-BEIT** — Recent preprint by Microsoft (at the time of this lecture). Formatted like an ICLR conference submission for 2023.

**FLAVA** — Recent publication at CVPR 2022 by Facebook AI Research.

**CoCa** — Recent publication at Transactions of Machine Learning Research by Google Research.

> **At-home exercise** — do this for any of Florence, BASIC, LiT, ALBEF, PaLI

## Sequence of the Sections

We'll next look at the structure of the paper at a global level. For this step, we are going to note the section headers and their organization.

**VL-BEIT**
1. Abstract
2. Introduction
3. Methods
4. Experiments
5. Related Work
6. Conclusion

**FLAVA**
1. Abstract
2. Introduction
3. Background
4. FLAVA: A Foundational Language And Vision Alignment Model
5. Experiments
6. Conclusion

**CoCa**
1. Abstract
2. Introduction
3. Related Work
4. Approach
5. Experiments
6. Broader Impacts
7. Conclusion

> **Notes — Some commonalities**
> - 6-7 Sections (inclusive of abstract).
> - An abstract, introduction to start the paper, and conclusion to end it.
> - Related Work / Background is either the section after the introduction or before the conclusion.
> - The Methods or Approach section describing the approach is next.
> - Experiments come after the methods section.

> **At-home exercise** — do this for any of Florence, BASIC, LiT, ALBEF, PaLI

## Sequence of the Figures

We next look at the sequence and the content of the figures.

**VL-BEIT**
1. Method overview diagram
2. Comparison to other models on 2 tasks
3. Comparison to other models on 2 other tasks
4. Comparison to other models on 1 more task
5. Comparison to ablations

**FLAVA**
1. Method overview diagram
2. Comparison of capabilities recent models in different modalities
3. Lower level overview of model
4. Representative examples from various subsets of our pretraining dataset
5. Datasets used for pre-training
6. Comparison to ablations
7. Comparing to different eval settings
8. Comparing to previous models
9. Performance difference to one model on different tasks

**CoCa**
1. Overview of the method
2. Illustration of the architecture and objectives
3. Ablation analysis of size
4. Illustration of method for video recognition
5. Comparison of model performance with other models across tasks (x 2)
6. Image classification scaling performance of model sizes.
7. Comparison of model performances on some tasks (x5)
8. Curated samples of input and output predictions
9. Comparison to ablations

> **Notes — Some commonalities**
> - 5-15 figures
> - Starts with a method overview diagram. Sometimes has more illustrations of the method for different tasks, or a lower level illustration.
> - Shows results comparing models across different tasks, with a table/figure for different sets of tasks. These comparisons are typically to previous models.
> - Shows results comparing method ablations.
> - Sometimes shows examples of the input and output predictions.

> **At-home exercise** — do this for any of Florence, BASIC, LiT, ALBEF, PaLI

## Local Structure

The sequence of the sections and of the figures gives us an understanding of the global structure of the paper. Now, we're going to look at each of the individual sections and break down their structure – we're going to call this the local structure.

### Structure of the Abstract

Let's start with the abstract – I want us to go through the abstract, line by line, and write down the purpose of each sentence. In particular, we are going to write down the question each sentence answers.

**VL-BEIT**
1. What is the solution introduced in the paper?
2. What is the key idea of the solution at a high level?
3. What are the key components of the solution (x2)?
4. What are the strengths of the solution?
5. What are notable results (x2)?

**FLAVA**
1. What is the background for the class of models?
2. What is the key gap with previous models?
3. What is the key desiderata of a solution?
4. What is the solution introduced in the paper and what are notable takeaways?

**CoCa**
1. What is the significance of the research topic?
2. What is the solution introduced in the paper?
3. What are the key components of the solution that are different from previous approaches?
4. What are the components of the solution?
5. What are the strengths of the solution?
6. What are notable results, mentioning tasks and numbers?

> **Notes**
> - 116 words, 110 words and 254 words respectively.
> - Same 5-6 components, but no order except end with notable results/takeaways.

> **At-home exercise** — do this for any of Florence, BASIC, LiT, ALBEF, PaLI

### Structure of the Introduction

We're going to look at the introduction paragraph-by-paragraph. For each paragraph, let's write down the question that each sentence answers.

**VL-BEIT**
1. How successful has the class of approaches under consideration previously been? How do previous approaches in the class tackle the problem?
2. What is the solution introduced in the paper? What are the key components of the solution? What are the strengths of the solution?
3. What are the experiments that are performed? What do the experimental results demonstrate?
4. What are the main contributions, bulletted?
   1. What is the key idea of the solution?
   2. What is the strength of the solution?
   3. What do the results positively indicate?

**FLAVA**
1. How successful has the class of approaches under consideration previously been? Can you give a couple of examples?
2. What is wrong with a class of previous approaches (x3)?
3. What is another possible approach? What is wrong with that class of approach?
4. What is the key desiderata of a solution?
5. What is the key desiderata of a solution?
6. What is the solution introduced in the paper? What are the key components of the solution? What do the experimental results positively demonstrate? What are the strengths of the solution?

**CoCa**
1. How successful has the class of approaches under consideration previously been? What is their key disadvantage?
2. What is an approach to the problem? Why is it problematic? What is a solution to that problem or an alternative approach? What is wrong with that?
3. What is the solution introduced in the paper? What are the key components of the solution (x 6) ?
4. What is the strength of the solution? What do the experimental results positively demonstrate?

> **Notes**
> - 4-6 paragraphs.
> - Very similar starts and ends!
> - Includes how the previous class of approaches tackle the problem, and what's wrong with them.
> - Includes what the main components of the solution and its strengths are.

> **At-home exercise** — do this for any of Florence, BASIC, LiT, ALBEF, PaLI

### Structure of the Related work

We now repeat the exercise with the related work. This time, for each paragraph, we are going to write down the purpose of that paragraph. You could do this exercise at a sentence level too, but it is typically less structured than an intro, so we do this at the paragraph-level.

**VL-BEIT**
1. Overall related work approach description, hinting at each of the subsections
2. Categorization of approach types. Evolution to recent approaches. Comparison to the proposed solution.

**FLAVA**
1. Recent success with gaps in progress.
2. Overall related work approach description, hinting at each of the sections; highlighting gap.
3. Categorization of approach types. Evolution to recent approaches. Comparison of previous approaches to the proposed solution.

**CoCa**
1. Recent success with gaps in progress.
2. Overall related work approach description, hinting at each of the sections; highlighting gap
3. Categorization of approach types. Evolution to recent approaches. Comparison of previous approaches to the proposed solution

> **Notes**
> - 2 or 3 groups
> - Relatively consistent format
> - Headers are categories of approaches.

> **At-home exercise** — do this for any of Florence, BASIC, LiT, ALBEF, PaLI

### Structure of the Conclusion (+ Broader Impacts)

With the conclusion, we're going to find similarities with the abstract; in a bit, we'll also discover a key difference. We're going to look at the conclusion paragraph-by-paragraph. For each paragraph, once again, let's write down the question that each sentence answers.

**VL-BEIT**
1. What is the solution introduced in the paper?
2. What are the key components of the solution (x2)?
3. What are notable results (x2)?
4. What are interesting directions for future work?

**FLAVA**
1. What is the solution introduced in the paper?
2. What are the key components of the solution?
3. What are the strengths of the solution?
4. What does the solution point to for the future?

---

5. What does the solution motivate?
6. What are limitations of the work, including identified biases, and how effective are efforts to mitigate them?

**CoCa**
1. What is the solution capable of?
2. What are the possible concerns with the use of the models before they can be deployed x2?

---

3. What is the solution introduced in the paper?
4. What is the strength of the solution?
5. What do the experimental results positively demonstrate?
6. What does the solution motivate?

> **Notes**
> - 2 paragraphs.
> - Includes a broader impact paragraph.
> - Similar to abstract, but includes what the solution motivates.

> **At-home exercise** — do this for any of Florence, BASIC, LiT, ALBEF, PaLI

### Structure of the Methods & Experiments

Finally, the most challenging of the sections: the methods and experiments. These have more flexibility in their structure, and grouping them together allows us to see how some of the same elements are reorganized in different ways by papers between the two sections. For each paragraph, we are going to write down the purpose of that paragraph.

**VL-BEIT**

Methods
1. Overall approach description, hinting at each of the sections
2. Describe the architecture and flow of input to output
3. Describe each objective / loss function

Experiments
1. Describe the data used
2. Describe the implementation details.
3. Describe usage of model for different tasks
4. For every task type, what results are achieved
5. Describe the ablation experiment and result

**FLAVA**

Methods
1. Overall approach description, hinting at each of the sections
2. Describe the architecture and flow of input to output
3. Describe each objective / loss function
4. Describe the implementation details.
5. Describe Datasets used.

Experiments
1. Overall experiment task setup
2. For every task type, what results are achieved

**CoCa**

Methods:
1. Overall approach description, hinting at each of the sections
2. Describe each objective / loss function
3. Describe the architecture and flow of input to output
4. Describe usage of model for different tasks

Experiments
1. Overall experiment task setup
2. Describe Datasets used.
3. Describe the implementation details.
4. Describe usage of model for different tasks
5. For every task type, what results are achieved
6. Describe the ablation experiment and result

> **Notes**
> - Most elements are the same between papers, but might be found in either methods or experiments.
> - Methods include the overall approach description, architecture, flow of input to output, loss function.
> - Experiments sections end with describing what results are achieved for different tasks followed by ablations.

Your turn to make a few more notes. Read through the methods and sections to answer the following questions:

1. What is the relationship between paragraphs within a section? Hint: think across space and time
2. Are any results referenced in the methods, preliminary or not?
3. When do results make references to the figures?
4. How are previous approaches compared to?
5. Can you come up with a checklist for implementation details?
6. How many papers are referenced in methods and experiments?
7. How are experimental results described?

## Resulting Template

Let's now put it all together. Below, you will find a checklist that we can use when we're writing a paper that is similar in flavor to the three we have read. You can choose to redo this for any paper you are writing, using your choice of three most related papers. The choice of the following structure is intended to capture the commonalities between the papers we have seen – where I observed difference, I made a judgment call based on my stylistic preference.

- Format: Do you know which venue you are formatting the paper for?
- Figures:
  - Method overview diagram
  - Lower-level methodology diagram
  - Comparison of models to other models broken down by task (between 3-5)
  - Comparison to ablations
- Abstract
  - What is the background for the class of models?
  - What is the key gap with previous models?
  - What is the key desiderata of a solution?
  - What is the solution introduced in the paper and what are notable takeaways?
  - What are the components of the solution?
  - What are the strengths of the solution?
  - What are notable results, mentioning tasks and numbers?
- Introduction
  - How successful has the class of approaches under consideration previously been? How do previous approaches in the class tackle the problem?
  - What is a solution to the possible approach? What is wrong with that class of approach? What is the key desiderata of a solution?
  - What is the solution introduced in the paper? What are the key components of the solution (x 6) ?
  - What are the experiments that are performed? What do the experimental results demonstrate? What are the strengths of the solution?
- Methods
  - Overall approach description, hinting at each of the sections
  - Describe each objective / loss function
  - Describe the architecture and flow of input to output
  - Describe the implementation details.
- Experiments
  - Overall experiment task setup and usage of models for different tasks
  - Describe Datasets used.
  - Describe the implementation details.
  - For every task type, what results are achieved
  - Describe the ablation experiment and result
- Related Work
  - Recent success with gaps in progress.
  - Overall related work approach description, hinting at each of the sections highlighting gap
  - Categorization of approach types. Evolution to recent approaches. Comparison of previous approaches to the proposed solution
- Broader Impact and Limitations
- Conclusion
  - What is the solution introduced in the paper?
  - What are the key components of the solution (x2)?
  - What are notable results (x2)?
  - What is the strength of the solution?
  - What does the solution point to for the future?
  - What are limitations of the work, including identified biases, and how effective are efforts to mitigate them?
  - What are interesting directions for future work?

> **At-home exercise** — now do this using three of Florence, BASIC, LiT, ALBEF, PaLI.

## Conclusion

I hope this walkthrough of the deconstruction of the structure of machine learning papers gives you the confidence to structure your own research paper. Noting the global structure and the local structure allows us to lay out the purpose of each of the sections, the figures, and the paragraphs within the sections! You can then apply the resulting template to help write your own paper.
