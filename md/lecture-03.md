---
course: Harvard CS197
term: Fall 2022
lecture: 3
title: Shoulders of Giants
subtitle: Reading AI Research Papers
instructor: Pranav Rajpurkar
source_notes: https://docs.google.com/document/d/1bPhwNdCCKkm1_adD0rx1YV6r2JG98qYmTxutT5gdAdQ/edit
course_site: https://cs197.seas.harvard.edu/
learning_outcomes:
  - Conduct a literature search to identify papers relevant to a topic of interest.
  - Read a machine learning research paper and summarize its contributions.
tags: [research-methods, literature-review, reading-papers, image-captioning]
provenance: Prose and Notes/To-understand boxes are the author's original lecture notes, transcribed verbatim. Blocks marked "Added explanation" were written for this reader and are not the author's words.
---

::: figure portrait assets/l3/dalle-reader.png
DALL·E Generation: A voracious reader surrounded by papers around them, digital art.
:::

## Abstract

Maybe you're trying to get into AI research, maybe you are a graduate student that is considering joining a new research lab, maybe you're in industry trying to present the latest advances on an AI problem to your colleagues. Regardless, you'll be faced with the daunting task of understanding the state of progress on the problem topic, and the gaps that are left to fill. I go through this exercise continually in my career, and a structured approach to understanding the state and gaps in something can make the task less daunting. This lecture is set up as a real walkthrough of the steps you would take to learn about a new topic in AI. My hope is that by the end of the lecture, you will have a blueprint for the kind of workflow you can use while approaching the reading of AI research papers.

**Learning outcomes:**
- Conduct a literature search to identify papers relevant to a topic of interest
- Read a machine learning research paper and summarize its contributions

## Approach

I'm going to break down the process of reading AI research papers into two pieces: reading *wide*, and reading *deep*. When you start learning about a new topic, you typically get more out of reading *wide*: this means navigating through literature reading small amounts of individual research papers. Our goal when reading wide is to build and improve our mental model of a research topic. Once you have identified key works that you want to understand well in the first step, you will want to read *deep*: here, you are trying to read individual papers in depth. Both reading *wide* and *deep* are necessary and complimentary, especially when you're getting started.

I am going to walk you through how you would approach reading wide and reading deep very concretely using the example of "deep learning for image captioning" as the hypothetical topic we want to break into. Let's get started.

## Reading Wide

Let's start with a simple google search for "image captioning".

::: figure screenshot assets/l3/google-search.png
Google search results for "image captioning". The first result defines the task; the second link - Papers with Code - is the interesting one for us.
:::

We get a definition of image captioning from the first result that defines the task for us. It's the second link that's interesting for us: Papers with Code.

### Papers with Code

Papers with Code is a community project with the mission to create a free and open resource with Machine Learning papers, code, datasets, methods and evaluation tables. I like it a lot and use it quite frequently.

::: figure screenshot assets/l3/pwc-image-captioning.png
The Papers with Code Image Captioning task page: 382 papers with code, 27 benchmarks, 49 datasets. Most popular benchmarks are nocaps and COCO; models are typically evaluated with a BLEU or CIDEr metric.
:::

We're going to need to start making notes, so let's open up a Google Doc, and create an entry.

> **Notes — Image Captioning**
> https://paperswithcode.com/task/image-captioning
> - Task: describing the content of an image in words.
> - Methods: encoder-decoder framework — input image is encoded into an intermediate representation of the information in the image, and then decoded into a descriptive text sequence.
> - Datasets: nocaps and COCO
> - Evaluation: BLEU or CIDER metric.

Let's scroll to the benchmarks section on papers with code.

::: figure screenshot assets/l3/pwc-benchmarks.png
The Image Captioning leaderboards used to track progress. The words "COCO" and "nocaps" repeat across benchmarks.
:::

We see a few benchmarks, with the words "COCO" and "nocaps" repeating. Let's try to look at the top benchmark first: COCO captions.

::: figure chart assets/l3/coco-leaderboard.png
Image Captioning on COCO Captions. As recently as mid-2022 the state-of-the-art is a method called mPLUG, at rank 1 with BLEU-4 46.5, CIDEr 155.1, METEOR 32.0, SPICE 26.0.
:::

This shows us that as recently as in mid 2022, there has been a state-of-the-art (you might hear SOTA (pronounced like soda with a 't') with a method called mPLUG. The leaderboard is quite useful: it shows us metrics including BLEU-4, CIDER, METEOR, SPICE, and similar variants. Soon, we'll need to understand what these are. Let's click on the mPLUG paper link:

::: added evaluation metrics
These are automatic scores for comparing a generated caption to human reference captions - higher is better. **BLEU-4** measures overlap of 4-word sequences (precision-oriented, borrowed from machine translation). **METEOR** also rewards synonyms and word order. **ROUGE** is recall-oriented overlap. **CIDEr** was designed specifically for captioning - it weights words by how informative they are across the dataset (TF-IDF style). **SPICE** compares the *scene graph* (objects, attributes, relations) rather than surface words, so it tracks meaning more than phrasing. You don't need the formulas yet; the lecture's point is only to note the names and come back to them.
:::

### The mPLUG paper

::: figure screenshot assets/l3/mplug-card.png
The mPLUG paper: "Effective and Efficient Vision-Language Learning by Cross-modal Skip-connections" (24 May 2022), Chenliang Li et al., DAMO Academy, Alibaba Group.
:::

> **Abstract — mPLUG (quoted from the paper)**
> Large-scale pretrained foundation models have been an emerging paradigm for building artificial intelligence (AI) systems, which can be quickly adapted to a wide range of downstream tasks. This paper presents mPLUG, a new vision-language foundation model for both cross-modal understanding and generation. Most existing pre-trained models suffer from the problems of low computational efficiency and information asymmetry brought by the long visual sequence in cross-modal alignment. To address these problems, mPLUG introduces an effective and efficient vision-language architecture with novel cross-modal skip-connections, which creates inter-layer shortcuts that skip a certain number of layers for time-consuming full self-attention on the vision side. mPLUG is pre-trained end-to-end on large-scale image-text pairs with both discriminative and generative objectives. It achieves state-of-the-art results on a wide range of vision-language downstream tasks, such as image captioning, image-text retrieval, visual grounding and visual question answering. mPLUG also demonstrates strong zero-shot transferability when directly transferred to multiple video-language tasks.


Let's read the abstract. We are new to image captioning, so don't expect to understand most of the sentences. I am going to make note of key information here in our Google Doc.

> **Notes — mPLUG: Effective and Efficient Vision-Language Learning by Cross-modal Skip-connections**
> https://arxiv.org/pdf/2205.12005v2.pdf
> - mPLUG is a new vision-language foundation model for both cross-modal understanding and generation.
> - Solves problem that pre-trained models suffer from the problems of low computational efficiency and information asymmetry brought by the long visual sequence in cross-modal alignment.
> - Solves problem by introducing an effective and efficient vision-language architecture with novel cross-modal skip-connections.
> - Achieves top performance on at least COCO.

Again, it's okay that we don't understand what this all means just yet; this is simply an attempt to extract the key idea first.

I am going to go back to Papers with Code and repeat this exercise for the winner on 2 more benchmarks: I picked nocaps-in domain and nocaps near-domain because they both had very recent submissions that had high performance. Thus we come across the GIT method.

::: figure screenshot assets/l3/git-card.png
The GIT paper: "A Generative Image-to-text Transformer for Vision and Language" (27 May 2022), Jianfeng Wang et al.
:::

> **Abstract — GIT (quoted from the paper)**
> In this paper, we design and train a Generative Image-to-text Transformer, GIT, to unify vision-language tasks such as image/video captioning and question answering. While generative models provide a consistent network architecture between pre-training and fine-tuning, existing work typically contains complex structures (uni/multi-modal encoder/decoder) and depends on external modules such as object detectors/taggers and optical character recognition (OCR). In GIT, we simplify the architecture as one image encoder and one text decoder under a single language modeling task. We also scale up the pre-training data and the model size to boost the model performance. Without bells and whistles, our GIT establishes new state of the arts on 12 challenging benchmarks with a large margin. For instance, our model surpasses the human performance for the first time on TextCaps (138.2 vs. 125.5 in CIDEr). Furthermore, we present a new scheme of generation-based image classification and scene text recognition, achieving decent performance on standard benchmarks.


You can follow my above example to make similar notes using this abstract. Note that we haven't yet opened the papers: that's intentional. Here are the notes I made:

> **Notes — GIT: A Generative Image-to-text Transformer for Vision and Language**
> https://arxiv.org/pdf/2205.14100v4.pdf
> - Generative Image-to-text Transformer, GIT, unifies vision-language tasks such as image/video captioning and question answering.
> - Solves the problem that existing work typically contains complex structures (uni/multi-modal encoder/decoder) and depends on external modules such as object detectors/taggers and optical character recognition (OCR).
> - Solves problem by simplifying the architecture as one image encoder and one text decoder under a single language modeling task
> - GIT establishes a new state of the arts on 12 challenging benchmarks with a large margin. including surpassing human performance for the first time on TextCaps.

I haven't used any external knowledge here; it's simply organizing key information from the abstract.

> **Exercise:** Perform a similar summarization of the abstract for another method using the benchmarks. Look for active image captioning benchmarks where you see recent submissions, especially if the recent submissions are setting new SOTA.

Now that we've got an understanding of a couple of methods, let's try to understand the datasets a little better. We can still stick to papers with code. Let's find our way to the image captioning datasets:

::: figure screenshot assets/l3/pwc-datasets.png
Papers with Code datasets filtered to Image Captioning - 49 dataset results, including COCO, Flickr30k, Conceptual Captions and COCO Captions.
:::

We'll look into the 2 datasets we have come across before: nocaps, and COCO captions. Let's start with nocaps. We can click the link to get to the abstract of the paper introducing the dataset.

::: figure screenshot assets/l3/nocaps-card.png
The nocaps dataset paper: "nocaps: novel object captioning at scale" (ICCV 2019), Harsh Agrawal et al. 166,100 human-generated captions describing 15,100 images from the Open Images validation and test sets.
:::

> **Abstract — nocaps (quoted from the paper)**
> Image captioning models have achieved impressive results on datasets containing limited visual concepts and large amounts of paired image-caption training data. However, if these models are to ever function in the wild, a much larger variety of visual concepts must be learned, ideally from less supervision. To encourage the development of image captioning models that can learn visual concepts from alternative data sources, such as object detection datasets, we present the first large-scale benchmark for this task. Dubbed 'nocaps', for novel object captioning at scale, our benchmark consists of 166,100 human-generated captions describing 15,100 images from the OpenImages validation and test sets. The associated training data consists of COCO image-caption pairs, plus OpenImages image-level labels and object bounding boxes. Since OpenImages contains many more classes than COCO, nearly 400 object classes seen in test images have no or very few associated training captions (hence, nocaps). We extend existing novel object captioning models to establish strong baselines for this benchmark and provide analysis to guide future work on this task.


As we did for the models, we can similarly make notes for the datasets.

> **Notes — nocaps: novel object captioning at scale**
> https://arxiv.org/pdf/1812.08658v3.pdf
> - Dubbed 'nocaps', for novel object captioning at scale, benchmark consists of 166,100 human-generated captions describing 15,100 images from the OpenImages validation and test sets.
> - Introduced to encourage the development of image captioning models that can learn visual concepts from alternative data sources, such as object detection datasets.
> - The associated training data consists of COCO image-caption pairs, plus OpenImages image-level labels and object bounding boxes.
> - Nearly 400 object classes seen in test images have no or very few associated training captions.
>   - *I came across nocaps out-of-domain and nocaps in-domain earlier; maybe that's associated with above?*

Notice that I am leaving myself comments to come back to in my notes. Like for the methods, some words here might be new, but most words here are in typical English, so it's more easy to understand. We can do the same for the other dataset, COCO captions.

::: figure screenshot assets/l3/coco-card.png
The COCO Captions paper: "Microsoft COCO Captions: Data Collection and Evaluation Server" (1 Apr 2015), Xinlei Chen et al.
:::

> **Abstract — Microsoft COCO Captions (quoted from the paper)**
> In this paper we describe the Microsoft COCO Caption dataset and evaluation server. When completed, the dataset will contain over one and a half million captions describing over 330,000 images. For the training and validation images, five independent human generated captions will be provided. To ensure consistency in evaluation of automatic caption generation algorithms, an evaluation server is used. The evaluation server receives candidate captions and scores them using several popular metrics, including BLEU, METEOR, ROUGE and CIDEr. Instructions for using the evaluation server are provided.


> **Notes — Microsoft COCO Captions: Data Collection and Evaluation Server**
> https://arxiv.org/pdf/1504.00325v2.pdf
> - Dataset (hopefully now done) contains over one and a half million captions describing over 330,000 images.
> - For the training and validation images, five independent human generated captions are provided.
> - Uses an evaluation server – *not sure what that means?*
> - Server scores captions using several popular metrics, including BLEU, METEOR, ROUGE and CIDEr.

::: added what an "evaluation server" is
The self-comment above gets answered later in the lecture by reading on. An evaluation server hides the ground-truth reference captions for the test set: you upload your model's captions and the server returns the scores. Because you never see the answers, you can't (accidentally or deliberately) tune your model to the test set - it keeps the leaderboard honest.
:::

At this point, we have a good collection of 4 papers: 2 recent SOTA methods and 2 datasets. Looking at SOTA methods might especially be useful if we're looking to improve on the methods, but if we're trying to understand a problem domain more broadly, we need to pick up some more mature and influential works here.

### Google Scholar

We're going to turn next to Google Scholar. Let's start by entering our search term: image captioning:

::: figure screenshot assets/l3/scholar-imagecaptioning.png
Google Scholar results for "image captioning". Scholar sorts by relevance and shows citation counts; a comprehensive survey sits at the top (cited 455).
:::

Google scholar sorts by relevance and includes a few useful details, including the number of citations that the paper has received. We're in luck – we have a survey paper at the top of our search results. A survey paper typically reviews and describes the state of a problem space, and often includes challenges and opportunities. Reviews/Surveys may not always be up-to-date, comprehensive, or completely accurate, but especially if we're new to a space, can get us up to speed.

We might suspect that since we've seen some fairly recent papers achieve SOTA (2022), we might not want to look at a 2019 survey. Let's see if we can find a more recent one by explicitly searching for a survey and using the left timeline sidebar to filter results at least as recent as 2021.

::: figure screenshot assets/l3/scholar-survey.png
Filtering Google Scholar to "image captioning deep learning survey" and recent years. The first result - "From Show to Tell: A Survey on Deep Learning-based Image Captioning" - is the one we open.
:::

Let's hit the first result.

::: figure screenshot assets/l3/survey-abstract.png
The survey abstract. Connecting Vision and Language plays an essential role in Generative Intelligence; since 2015 the task has been addressed with pipelines of a visual encoder and a language model. The survey compares many state-of-the-art approaches across visual encoding, text generation, training strategies, datasets and evaluation metrics.
:::

> **Abstract — From Show to Tell (survey) (quoted from the paper)**
> Connecting Vision and Language plays an essential role in Generative Intelligence. For this reason, large research efforts have been devoted to image captioning, i.e. describing images with syntactically and semantically meaningful sentences. Starting from 2015 the task has generally been addressed with pipelines composed of a visual encoder and a language model for text generation. During these years, both components have evolved considerably through the exploitation of object regions, attributes, the introduction of multi-modal connections, fully-attentive approaches, and BERT-like early-fusion strategies. However, regardless of the impressive results, research in image captioning has not reached a conclusive answer yet. This work aims at providing a comprehensive overview of image captioning approaches, from visual encoding and text generation to training strategies, datasets, and evaluation metrics. In this respect, we quantitatively compare many relevant state-of-the-art approaches to identify the most impactful technical innovations in architectures and training strategies. Moreover, many variants of the problem and its open challenges are discussed. The final goal of this work is to serve as a tool for understanding the existing literature and highlighting the future directions for a research area where Computer Vision and Natural Language Processing can find an optimal synergy.


You might find that for survey papers, the abstract does not typically provide the same level of specificity as a typical research article. Survey papers, however, are typically more accessible (at least in some parts) because they include more background about a topic. Let's open this one up.

::: figure diagram assets/l3/survey-fig1-taxonomy.png
Survey Figure 1: an overview of the image captioning task and taxonomy of the most relevant approaches. Visual Encoding (non-attentive / additive attention / graph-based attention / self-attention) feeds Language Models (LSTM-based / CNN-based / Transformer-based / image-text early fusion), with Training Strategies (cross-entropy loss, masked language model, reinforcement learning, VL pre-training).
:::

How should we read through a 15-page 2 column review article? In this stage, where we're reading *wide*, we will be very selective in what we read. For this paper, I read:
- Figure 1 on page 2 of the review. This typically gives a good visual organization of the key point of the review. Organization of section headings in this paper.
- The "Contributions" on the second page. I didn't find this super useful in this paper, since it didn't make clear the takeaways. On other papers, I would try to find the takeaways.
- The "Conclusions and Future Directions" on the last page.

These rather short pieces of the paper should be sufficient for now. Take some time on your own to read through these sections and see if you can come up with 8-10 bullet points of notes. Here are the notes I made using the above sections.

> **Notes — From Show to Tell: A Survey on Deep Learning-based Image Captioning**
> https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=9706348
> - Divided into visual encoding, training strategies, language models. Attention shows up a lot in visual encoding.
> - Variety of visual encoding strategies (pre-training from scratch, using detections, using features from multi-modal models) all appear to be on par in terms of performance.
> - Training strategies have a recent advancement obtained by the pre-training paradigm and masked language model losses.
>   - Growing size of pre-training models is a concern for equality in the community.
>   - Growing dichotomy between early-fusion strategies and the encoder-decoder paradigm is an open issue.
> - Specializing in particular domains and generating captions with different styles and aims is still among the main open challenges for image captioning.
>   - variants such as novel objects captioning or controllable captioning, or subword-based tokenization techniques might handle issues.
> - Fairness and bias need for designing specific evaluation metrics and focusing on the robustness to unwanted correlations.
> - Development of scores that do not need reference captions for assessing the performance would be key for a shift towards unsupervised image captioning.

At this point in time, we already have 2 pages worth of notes! Your notes, like mine, probably contain many terms you are encountering for the first time… We've seen terms like "encoder-decoder architecture," "language modeling task," "cross-modal skip connections," or "subword-based tokenization techniques" that might be beyond our reach of current understanding, but that's okay because when we're reading *wide*.

::: added a few of those unfamiliar terms, briefly
So the vocabulary isn't a wall: an **encoder–decoder** turns the input (an image) into an internal vector representation (encode), then generates the output text from it (decode). A **language modeling task** trains a model to predict the next token given previous ones - the same objective behind GPT-style models. **Tokenization** splits text into units; **subword** tokenization uses word-pieces (e.g. "captioning" → "caption" + "ing") so rare words are still covered. **Cross-modal** just means "across two modalities" - here vision and language. These are exactly the entries that belong on a "to understand" list while reading wide.
:::

At this point, we can still put together a fairly neat summary of what we've learnt! Before you read mine, try to compile your learnings – from reading the 1 overview page, 2 methods paper abstracts, 2 datasets paper abstracts, and small sections from 1 survey paper – all into a summary paragraph.

> **Notes — Learnings**
> The task of image captioning is to describe the content of an image in words. Popular datasets to tackle this question include nocaps and coco, which each contain hundreds of thousands of images. Recent SOTA methods for image captioning include mPLUG and GIT. mPLUG proposes an effective and efficient vision-language architecture and GIT simplifies typically complex structures into one image encoder and one text decoder under a single language modeling task. Specializing image captioning for particular domains and generating captions with different styles and aims is possibly a big open challenge.

This is great!

## Between Wide and Deep

You may have noticed that your notes are likely already diverging from mine, especially towards the last paper! Even if we have read the same content, you are starting to develop your own mental model of the problem space, and your interest will be piqued by a different set of words. That's good – you're developing a taste for the kind of research questions you will find interesting.

At this point, I find myself particularly intrigued by the SOTA methods: Why are they achieving high performance? According to the review paper, it looks like "training strategies using pre-training" have been an advance. Maybe that's worth keeping an eye out for!

## Related Work

At this stage, I'll find it effective to read the related works sections of these papers: they often make it clear how researchers in the field have traditionally approached the problems and what the emerging trends are. It's important to pick papers that are recently published.

Let's dive in: both mPLUG (https://arxiv.org/pdf/2205.12005v2.pdf) and GIT (https://arxiv.org/pdf/2205.14100v4.pdf) are recently published methods that achieve SOTA.

The mPLUG related work starts towards the end of page 2. Let's read the related works subsection (I've only included one paragraph). I will focus particularly on the vision-language pre-training subsection. Now, attempt to update your previous notes of mPLUG with your understanding of this related work section. Here are my own notes, unfiltered: I've used shorthand and left in spelling/grammar errors :)

> **Notes — mPLUG: Effective and Efficient Vision-Language Learning by Cross-modal Skip-connections**
> https://arxiv.org/pdf/2205.12005v2.pdf
> - mPLUG is a new vision-language foundation model for both cross-modal understanding and generation.
> - Solves problem that pre-trained models suffer from the problems of low computational efficiency and information asymmetry brought by the long visual sequence in cross-modal alignment.
> - Solves problem by introducing an effective and efficient vision-language architecture with novel cross-modal skip-connections.
> - Achieves top performance on at least COCO.
> - Related work:
>   - For vision language pre training, there are two approaches to how info from different modalities is aggregate: dual encoder, and fusion.
>     - Dual encoder uses 2 encoders, one vision, one text, and simple functions to model interaction between image and text.
>       - Plus: computationally efficient. Minus: can't handle complicated vision-language tasks. Examples: CLIP, ALIGN.
>     - Fusion encoders uses attention to model interaction between image and text.
>       - Plus: better capture association between image and text for vision-language understanding tasks. Minus: inference is slow, with exceptions e.x. PixelBERT. Examples: Single-stream: UNITER, two-stream: LXMERT.
>     - mPLUG enables the fusion to occur at disparate levels in the abstraction hierarchy across the modalities.

The examples we have collected will serve to populate our reading list when we start to read through individual papers.

> **Exercise:** Repeat this process, this time for the GIT paper.

## Reading Deep

We've identified a few key works for our topic in the first stage and gotten a mental model of the space of image captioning. We're now going to compliment wide reading with deep reading, covering the way to read an individual paper. Most papers are written for an audience that shares a common foundation: that's what allows for the papers to be relatively concise. Building that foundation takes time, in the span of months, if not years. Thus reading a first paper on a topic can easily take over 10 hours (some papers have definitely taken me 20 or 30 hours) and leave one feeling overwhelmed.

So I would like you to take an incremental approach here. Understand that, in your first pass, you will not understand more than 10% of the research paper. The paper may require us to read another more fundamental paper (which might require reading a third paper and so on; it could be turtles all the way down)! Then, in your second pass, you might understand 20% of the paper. Understanding 100% of a paper might require a significant leap, maybe because it's poorly written, insufficiently detailed, or simply too technically/mathematically advanced. We thus want to aim to build up to understanding as much of the paper as possible – I'll bet that 70-80% of the paper is a good target.

We will go through the mPLUG paper, and I'll walk you through my first read of it. It's a good idea to be able to highlight papers as you go through them: or make comments. You can use Adobe or Preview (on Mac) to highlight PDFs (or a web-based solution like https://hypothes.is/ for the annotation).

I'm going to read the Introduction section first. In a later lecture, I will share with you how to write good introductions. Introductions are a good way to start a paper because they are typically written for a more general audience than the rest of the paper.

::: figure screenshot assets/l3/mplug-intro-highlights.png
The mPLUG introduction with highlights. Yellow = problems/challenges, pink = solutions to the challenges, orange = the main contributions. Notice the alternating yellow/pink: a general problem, a solution to that problem, then a problem with the solution, and another solution. Four levels deep, the paper specifies the problem it solves.
:::

I have highlighted what I found to be important parts of the introduction. The yellow highlights are the problems/challenges, the pink highlights are the solutions to the challenges, and the orange highlights are the main contributions of the work we're reading.

Notice the alternating yellow/pink highlights. The paper is introducing a general problem, talking about a solution to that problem, then a problem with the solution, and another solution to that problem. Four levels deep, the paper specifies the problem it solves.

Notice then that the contribution of the paper is a specific solution for a specific problem of a more general solution to a more general problem of an even more general solution to an even more general problem etc. This is typical. We can summarize our understanding of this problem-solution chain:

> **Notes — Introduction**
> - Problem 1: How to find alignment between image and text modalities?
> - Solution 1: Pre-trained object detectors to find salient regions from images.
> - Problem 2: Limited by power of object detector & available annotations.
> - Solution 2: Direct alignment without object detectors
> - Problem 2a: Efficiency because of lot of computation of self-attention on visual sequences
> - Problem 2b: information asymmetry because text is short compared to info in image.
> - Solution 2a: connected attention network, using single transformer for early fusion. Has problems 2a and 2b.
> - Solution 2b: cross attention network, does fusion on both modalities independently. No longer has problem 2b, but still has 2a.
> - Solution 3 (proposed solution): cross-modal skip connections. Solves problem 2a and 2b.

This is neat – we've built a mental model of how the different pieces fit in. A well written introduction should allow you to extract such a problem–solution chain, but not every paper will make this explicit. We can often refer to the figure 1 to understand the main idea of the paper better:

::: figure diagram assets/l3/mplug-fig1-architecture.png
mPLUG Figure 1: two conventional cross-modal fusion networks - (a) connected-attention and (b) co-attention - versus (c) the proposed cross-modal skip-connected network (solutions 2a and 2b in our notes). Running time is markedly lower (~410ms vs ~1650/1860ms per 100 samples) while matching or beating performance.
:::

We can see the proposed solution (c), and the comparison to solutions in (a) and (b), which correspond to solutions 2a and 2b in our notes.

What's next? We've already read the abstract previously, we've read the introduction, we've seen Figure 1. On this paper, we've also had the opportunity to read the related work. Now we read the methods, right?

::: figure figure assets/l3/mplug-methods-fig2.png
mPLUG methods sections 3.1 (Model Architecture) and 3.2 (Cross-modal Skip-connected Network), with Figure 2 and Python pseudocode. Figure 2 gives a simpler description of the architecture and objectives; the pseudocode makes the operations and flow easier to work through.
:::

As you can see, I have made no highlights on sections 3.1, and 3.2. We're missing the context of 10-20 papers that we will need to read to fill in the gaps. That's okay: this is the 20-30% of the paper we are not going to have an in-depth understanding of. We can still squeeze out some understanding from the methods section using Figure 2, which presents a simpler description of the architecture and objectives of mPlug. We also have python pseudocode that actually makes it easier to work through the operations and flow of the model. In general, well constructed figures and algorithm pseudocode can be of huge help to us!

What we can do for the methods section is maintain a list of concepts that we haven't quite understood: if there's a link to the paper references, we'll copy it over. Here's what that might look like:

> **To understand — From mPLUG**
> - Self-attention + Cross-attention? (Detail: Layer normalization?)
> - Image-Text Contrastive (ITC): follows "Align before fuse: Vision and language representation learning with momentum distillation"
> - Prefix Language Modeling (PrefixLM): task follows Palm: Pre-training an autoencoding & autoregressive language model for context-conditioned generation.
> - From related work, "Vlmo: Unified vision-language pretraining with mixture-of-modality-experts" using dual encoder and fusion encoder modules.
> - Cross modal interaction example: "An empirical study of training end-to-end vision-and-language transformers."

You would have thus created a list of concepts you need to learn about, and the relevant paper for each, if the paper specifies any.

Let's continue reading, making our way through the methods sections, and the experiments section, highlighting the parts that we consider relevant to our understanding of the method as it relates to image captioning.

::: figure screenshot assets/l3/mplug-tables-1-2.png
The data setup, the main table of results (Table 1, corresponding to image captioning), and the image captioning section highlighted. Table 1 includes both methods and evaluation metrics that may be unfamiliar to us - note them in the "To understand" list.
:::

Here, I have highlighted the data setup, the main table of results (Table 1) corresponding to image captioning, and the image captioning section. Table 1 includes both methods and evaluation metrics that may be unfamiliar to us, and we can make not of that in our "To Understand" list.

> **To understand — From mPLUG**
> - Methods:
>   - Self-attention + Cross-attention? (Detail: Layer normalization?)
>   - Image-Text Contrastive (ITC): follows "Align before fuse: Vision and language representation learning with momentum distillation"
>   - Prefix Language Modeling (PrefixLM): task follows Palm: Pre-training an autoencoding & autoregressive language model for context-conditioned generation.
>   - From related work, "Vlmo: Unified vision-language pretraining with mixture-of-modality-experts" using dual encoder and fusion encoder modules.
>   - Cross modal interaction example: "An empirical study of training end-to-end vision-and-language transformers."
> - Experiments:
>   - What are BLEU-4, METEOR, CIDEr, SPICE?
>   - Method comparisons: SimVLM is a competitive method. Read "SimVLM: Simple visual language model pretraining with weak supervision"

We continue reading through the rest of the experiments section.

::: figure screenshot assets/l3/mplug-tables-3-5.png
Further result tables - image-text retrieval on Flickr30k/COCO, visual grounding on RefCOCO, and reasoning on NLVR2/SNLI-VE - plus the analysis of the stride S in the cross-modal skip-connected network. The instructor ignores highlighting the tasks other than image captioning.
:::

While we can read through the results on tasks other than "image captioning," I have ignored highlighting them. When reading papers, we are often being presented with a firehose of information, and it's useful to be selective in what we pay attention to. Let's continue reading.

::: figure screenshot assets/l3/mplug-tables-6-9.png
Training throughput, zero-shot image captioning on nocaps (feed a prefix prompt "A picture of" to improve decoded captions), zero-shot image-text retrieval on Flickr30K, and zero-shot transfer to video-language tasks.
:::

You can now see that we have found another section of experiments. Zero-shot transferability may not be a concept we're familiar with, so we likely will have to add that to our "to understand" list.

::: added what "zero-shot" means
**Zero-shot** means the model is evaluated on a task or dataset it was *never trained on* - no fine-tuning, no examples from that dataset. Here, mPLUG is pretrained on image-text pairs and then asked to caption nocaps images directly; feeding the prefix prompt "A picture of" nudges the decoder toward a caption-like output. Strong zero-shot performance is evidence that a model has learned general, transferable structure rather than memorising one dataset.
:::

Finally, let's read the conclusion of the paper.

::: figure screenshot assets/l3/mplug-conclusion.png
The mPLUG conclusion (highlighted). It presents mPLUG as an effective and efficient VLP framework, introducing a new asymmetric vision-language architecture with novel cross-modal skip-connections to address information asymmetry and computation efficiency in cross-modal alignment; pretrained on large-scale image-text pairs, it reaches SOTA across many vision-language tasks and shows strong zero-shot transfer to video-language tasks.
:::

You might notice that although the conclusion was similar to the abstract and to the introduction, we already have a much better understanding of these words than we did towards the start of reading this paper. As I mentioned before, reading the paper the first time, we expect to really only understand ~10% of it, especially if we don't have the background of the papers which are being built on. With this same approach, we can start making our way through our "To Understand" list.

## Conclusion

I hope this walkthrough of a first read of an AI paper in a new topic gives you the confidence to dive into a new problem topic. Both the process of reading wide and reading deep are iterative: we often need to re-search and re-read, and the act of making notes as you go can significantly help in building and cross-checking your mental model.
