---
course: Harvard CS197
term: Fall 2022
lecture: "16–17"
title: Make Your Dreams Come Tuned
subtitle: Fine-Tuning Your Stable Diffusion Model
instructor: Pranav Rajpurkar
source_notes: https://docs.google.com/document/d/1GnYZvXtYkzdQKtnG2djc29XERJO6QTRyLuXnO2BJBYY/edit
course_site: https://cs197.seas.harvard.edu/
learning_outcomes:
  - Create and fine-tune Stable Diffusion models using a Dreambooth template notebook.
  - Use AWS to accelerate the training of Stable Diffusion models with GPUs.
  - Work with unfamiliar codebases and use new tools, including Dreambooth, Colab, Accelerate, and Gradio, without necessarily needing a deep understanding of them.
tags: [stable-diffusion, dreambooth, fine-tuning, aws, generative-ai]
provenance: Prose is the author's original lecture notes, transcribed. Blocks marked "Added explanation" were written for this reader and are not the author's words.
---

_Notes taken by Howie Guo, Benji Kan, Kostas Tingos, Max Nadeau, and compiled by Kayla Huang._

## Abstract

In this lecture, you will learn how to create and fine-tune your own Stable Diffusion models using a Dreambooth template notebook. You will also learn how to use AWS to significantly accelerate the training process with the use of GPUs. Through hands-on experimentation with fine-tuned diffusion, you will become proficient in working with unfamiliar codebases and using new tools without necessarily needing a deep understanding of them, including Dreambooth, Google Colab, Accelerate, and Gradio. This is a valuable skill that can help you navigate and build upon unfamiliar code and technologies.

_StableDiffusion2.1 Generation: "Nuts and bolts on a machine"_

## Learning outcomes

- Create and fine-tune Stable Diffusion models using a Dreambooth template notebook.
- Use AWS to accelerate the training of Stable Diffusion models with GPUs.
- Work with unfamiliar codebases and use new tools, including Dreambooth, Colab, Accelerate, and Gradio, without necessarily needing a deep understanding of them.

## Fine-tuned Diffusion

In class we will have some fun and finetune stable diffusion for our own creative purposes. Specifically, we look at the Hugging Face Finetuned Diffusion Model: [Finetuned Diffusion - a Hugging Face Space by anzorq](https://huggingface.co/spaces/anzorq/finetuned_diffusion). Note that we are using a HuggingFace Space, which allows us to switch between different models.

### Starter and References

Before we start, for this lecture, I recommend going through the following resources (or coming back to them as references for this lecture):

- the Hugging Face Stable Diffusion model (https://huggingface.co/blog/stable_diffusion)
- The Dreambooth github (https://dreambooth.github.io/)
- Two notebooks which give an introduction to using Google Colab (https://colab.research.google.com/notebooks/basic_features_overview.ipynb and https://colab.research.google.com/notebooks/io.ipynb)
- An introduction to accelerate (https://huggingface.co/docs/accelerate/quicktour)
- A tutorial for gradio (https://gradio.app/getting_started/).

And other resources that will be used to run an example in this lecture.

- https://huggingface.co/spaces/anzorq/finetuned_diffusion
- https://colab.research.google.com/github/huggingface/notebooks/blob/main/diffusers/sd_dreambooth_training.ipynb

### Testing out the Model

We choose a Model (e.g. Modern Disney) and give a sample prompt (e.g. Lincoln eating ice cream). Our in class example produces this result:

In this model, there are several options with scales to tune on:

1. Guidance: how much to weight the prompt
2. Steps: number of iterations before convergence

## Dreambooth

Dreambooth is a research paper dealing with isolating objects and re-contextualization. More information can be read at this link: https://dreambooth.github.io/.

_Credit: Dreambooth Github_

### Dreambooth and Stable Diffusion Example

This is extended in the Colab notebook Dreambooth fine-tuning for Stable Diffusion using d🧨ffusers. Here, using 3-5 images, we teach new concepts to Stable Diffusion and personalize the model. There is a unique identifier associated with the concept we want to make, and we can use that identifier in our prompts. The model usually uses one concept, and the model will modify that specific concept. In total, training takes about 20 minutes.

### Instructions for Use

**Step 1: Pick a creative concept**

Some ideas from class: an eye-popping watermelon, Tom Cruise's jean jacket from Top Gun on different people, Christ the Redeemer in different poses to dance, Chenwei traveling the world, Michael Scott from The Office everywhere

**Step 2: Walk-through of the notebook up until the training block**

Log in to HuggingFace Hub to get token with write-access for Colab notebook

- Make sure to agree and accept terms of use https://huggingface.co/CompVis/stable-diffusion-v1-4

The log in page should look like this. Make sure to use a token with write access.

You will know if a token has write access by the presence of this flag.

We first import the required packages and define an image grid (under "Import required libraries"). Then, we only need to modify the list of urls to point to images of the new concept. In the directory on the left, we have the four images saved as {0,1,2,3}.jpeg under my_concept. Here are some examples of Big Bird training images.

- https://cdn.britannica.com/67/128667-050-5A8BD17D/Big-Bird-storybook-taping-Sesame-Street-2008.jpg
- https://static.wikia.nocookie.net/muppet/images/5/5c/Bigbirdseaworldorlando.jpg
- https://static.independent.co.uk/s3fs-public/thumbnails/image/2015/05/08/16/bigbird.jpg
- https://cdn.britannica.com/33/172433-050-DF812575/Michelle-Obama-Big-Bird-White-House-kitchen-2013.jpg

Loaded into the notebook, this looks like:

The images are then downloaded to the notebook and, running the next cell, we see the images in a grid.

We also need to initialize the token to fine-tune, call it "sks". If we also give the name of the superclass (e.g. "cartoon character"), it will work better. The prior preservation retains the class of the object; we'll keep it false unless we also have collected images of the super class. This is the example given in the notebook:

For Big Bird, we will use the following tokens:

**Step 3: Walk-through of Training Code and Starting Training**

Note that it might be necessary to upgrade to Colab Pro if training the model runs out of memory.

1. Setup the Classes: first initializes dataset class
   1. Setting paths, dynamically crops and resizes images for batch training. Size is determined as input (512), and normalizes to mean of 0.5 and standard deviation of 0.5 for all channels
   2. `__get_item__` returns a dictionary of an image and the corresponding tokenized prompt (which we set earlier), and if we set the prior preservation class, those images and prompts.
   3. PromptDataset simply contains the prompts and their indices
2. If we have prior preservation, generate images for the Class
   1. Creates a directory and if the number of given images is too few, use stable diffusion to generate more images as samples (which we later use to fine-tune stable diffusion)
3. Initialize the training arguments
4. We load the four pieces of the Stable Diffusion model, and fine-tune just one of them for our purposes

## Lecture 19: Connecting to AWS

The goal for the second half is to get the Dreambooth notebook (the same notebook from last lecture) running on AWS.

### Instructions on Connecting to AWS

- Connect to AWS via ssh in VSCode (see many other lectures)
   - Select SSHconnection in Command Palette
   - Connect to ec2 instance as we have done in previous classes
   - Clone this git repo
- Store the Colab as a Github Gist (there's a menu option to do this in Colab), then git pull from the AWS machine
   - If you encounter an error caused by leaving out a num_processes argument in notebook_launched, fix with `numprocesses=1`.
- Using the AWS GPU rather than Colab cuts training from 20 min to 7!
- How to move files from our computer to the AWS machine?
   - Easy solution: drag and drop from Mac Finder into the directory list in VSCode
   - There are more legit solutions that use AWS CLI
- Note: Make sure you have jupyter notebook extensions installed on your VS code

### Question: Why would we use a Python script instead of a notebook?

There are a few positives. For one, it is slightly easier to run/pass arguments, though this is not that hard in Colab. The better answer is that it is easier to run a script from another script, perhaps with different arguments, or on different GPUs. Scripts also allow us to run multiple models in parallel.

### Converting between Python scripts and notebooks using VSCode commands

You can convert a notebook to a Python script! Any markdown will be put in comments. You can also run some highlighted subsection of your Python format in the interpreter (also in VSCode). A highlighted subsection in an interactive Jupyter terminal can be run in a new panel of VSCode. Finally, if you put `# %%` comments in your Python script to delimit sections of your script, you can run the delimited sections in the Jupyter terminal—after hitting run cell, it opens up in a new interactive window and uses the previous context in the script.

### Make sure to install scripts for one-time installations

We make a .sh file that has:

- A bunch of pip installs
- conda installs (for things like huggingface_hub)
- huggingface-cli login

You can run this shell script with chmod then ./, or you can use zsh/bash. `Source install.sh` or `bash install.sh` will help you run the file.

After doing this you can go back to the script and hit "run below" at the top. Make sure things are still working and you can address the errors as they come up.

- If you encounter the error: "You have to specify the number of GPUs you would like to use…"
   - Thrown by accelerator.notebook_launcher line
   - Google the line throwing the error and the error message itself to investigate
   - Solve by changing the GPU instance

### Changes to the notebook to make it work for images of Pranav's bike

This was a change made to the notebook in class to demonstrate how we can make it work for images of Pranav's bike.

- Clearly we should be making these changes more systematically, with variables we set at the top of the file.
   - We'll use concept-name ("psr-bike" in this case)
   - A save-path ("./{concept-name}")
   - human_interpretable_name ("bike")
   - human_class_name ("black and red bike")
- We want the files to be pulled from the save_path, rather than from URLs. We can set a boolean for "use urls"
- The instance prompt should be "a photo of sks {human_interpretable_name}"
- The class prompt should be "a photo of {human_class_name}"

To expand on this, instead of running the following cell as is:

We instead create a new cell and define some global variables:

This way, in the next cell, we can change the code to call these variables instead

The advantage here is that, if we want to feed in another concept (i.e. a scarf or a pumpkin), we do not have to go through the code and find all the areas we need to edit. Instead, all the variables and paths are centralized and can be easily changed all at once. Note that it is important to make sure to put these variables early enough in the script, before the urls are defined.

Additionally, make sure the notebook is not still downloading images from the urls. This edit is reflected here.

### Speeding up iteration time in our notebook

We want to lower max_training_steps from 450 to 5 means that we can train faster. We'll keep the default args around and then use 5 instead of 450 if we're not using default arguments.

To do so, add the following two lines regarding dev_run below the instance prompt lines.

Also make sure to set max_train_steps equal to max_train_steps in the arguments.

### HF Accelerator

What is this? The Hugging Face Accelerator, as its name suggests, makes training and inference faster. How do we use it?

```python
from accelerate import Accelerator
accelerator = Accelerator()
```

Make sure to do `accelerator.to(device)` if applicable. Then, pass everything relevant to training (as long a list as you want) into `accelerator.prepare()`, things like model, optimizer, scheduler, data. This will handle the movement of these objects to the relevant device.

Then, replace `loss.backward()` with `accelerator.backward(loss)`.

Take a look at the doc to further understand Accelerator.

### More Details on Accelerator in the Dreambooth Script

In the dreambooth script, they initialize their accelerator with a value of gradient_accumulation_steps and mixed_precision. We set the text_encoder and vae to be on `accelerator.device`. It is unclear why we wouldn't just pass them to prepare with the other objects.

To run training, we're using the `accelerate.notebook_launcher` function, which takes in a training function and some args for it and runs them in a machine-optimized way

### Other changes & Gradio

We'll replace the `os.listdir("my_concept")` with our concept_name instead. Then, to save using Gradio, you pass in a function, some inputs types, some output types, and it will make a GUI in your jupyter script or at localhost.
