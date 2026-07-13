---
course: Harvard CS197
term: Fall 2022
lecture: "14–15"
title: Deep Learning on Cloud Nine
subtitle: "AWS EC2 for Deep Learning: Setup, Optimization, and Hands-on Training with CheXzero"
instructor: Pranav Rajpurkar
source_notes: https://docs.google.com/document/d/1HZroS7Q4qSazY3m1dZ5uy75FvN_ciYhVukLGnuEirxc/edit
course_site: https://cs197.seas.harvard.edu/
learning_outcomes:
  - Understand how to set up and connect to an AWS EC2 instance for deep learning.
  - Learn how to modify deep learning code for use with GPUs.
  - Gain hands-on experience running the model training process using a real codebase.
tags: [aws-ec2, gpu-training, cloud-computing, chexzero, deep-learning-infra]
provenance: Prose is the author's original lecture notes, transcribed. Blocks marked "Added explanation" were written for this reader and are not the author's words.
---

## Abstract

Once we start trying to work with and train complex models, developing locally on our own computers will not normally be a viable option. We will instead learn how to leverage solutions built by AWS. Specifically, we will be exploring and using EC2 instances. These lectures will take the form of a live demo / coding walkthrough. We will first go through AWS setup where we configure and connect to an instance. Several tools will be introduced that can help improve the development experience. The next step will be to adjust existing code so it can be used with GPUs which help drastically speed up computational processes (like training a model). This section will include a discussion of several ideas to speed up model training even more. Finally, we will do some hands-on work with the CheXzero codebase: we will add the code to our instance and make sure we can run the model training process.

**Learning outcomes:**
- Understand how to set up and connect to an AWS EC2 instance for deep learning.
- Learn how to modify deep learning code for use with GPUs.
- Gain hands-on experience running the model training process using a real codebase.

## AWS Setup

It is now very common for development to occur through AWS instead of locally on one's computer. In these two lectures we are going to follow suit by leveraging AWS EC2 instances.

We will begin by navigating to the AWS website and signing into the console. If you already possess an AWS account, sign in using your information and password. If not, follow the steps to create a new account.

### Create an Instance

As previously mentioned, we will be using Amazon EC2 (Elastic Compute Cloud). This service offers secure and resizable compute capacity for a wide range of workloads. Users are able to create, launch, and terminate virtual machines (aka instances) with ease.

Once logged into the AWS console, go to the EC2 service and then to the "Instances" page (which can be found on the side menu).

Click on the "Launch instances" button in order to configure and create a new instance. Once you have an existing instance it will become easier to launch another one, but the setup for the first time is a bit more complex.

Give your instance a name (we will use "cs197-lec"). Next you must select an Amazon Machine Image (AMI), which is a template that contains the software configuration required to launch the instance. Under "Quick Start" and "Amazon Linux" we will select Deep Learning AMI GPU PyTorch 1.12.1. This will make sure our instance comes preinstalled with PyTorch and is set up with other libraries for deep learning development. We select this version in particular since it will have a mismatch with our demo that we will have to fix.

The next thing you must do is select an instance type. The "Compare instance types" button will allow us to explore different options. In general you should care about two things: pricing and GPUs (or the lack thereof). Price comes down to memory, network, number of vCPUs, or size of GPU. Your goal should be to use the cheapest one until you get bottlenecked by other factors. You will want to filter by GPUs >= 1 and then the options under $1/hour are generally good.

The comparison also shows us vCPUs which are virtual CPUs. Each vCPU is a thread of a CPU core. For the sake of this lecture, we will select the g5.4xlarge instance type (feel free to select the g5.2xlarge instance type if your settings don't allow for the former option).

The next step is to create a new key pair (or leverage an existing key pair if you have created it in the past). This key pair is what we use to authenticate through AWS. Give your key pair a new name (we will use "inclass197") and then leave the default options of RSA and .pem.

Once you create the key it will be downloaded to your computer. Save it in a safe place since this is how you will connect to the server. We will place it in a folder called "aws" within our "Documents" folder.

The rest of the instance settings, (i.e. Network Settings, Configure storage, Advanced details) can be left as the default values. Finally, clicking the "Launch instance" button will create your instance.

At this point it is much easier to create a new instance using the one you have already created as a starting point. To do this you must first create an image of your current instance. An image maintains the state of your machine and all its associated data. While on your current instance's page, click on "Actions," "Image and Templates," and "Create Image."

Now the next time you are launching a new instance, you select the image you created as your AMI under the "My AMIs" section. These images can also be shared with others which makes collaboration a lot easier.

### Connect to the Instance

In order to connect to our instance we can start it using the AWS EC2 terminal.

In order to connect to the AWS instance we will first need to make changes to our /.ssh/config file. In this file we will specify the configuration of the ssh-instance and give it a connection name. We want to add a connection to an IP based on our instance's IP. Therefore, the following steps can only be done after initialization of an instance.

Open your VSCode setup as follows:

CMD ⌘ + Shift ⇧ + P

Then type into the prompt: Remote-SSH: Open SSH Configuration File . . .

The following is an example of an ssh-configuration.

```
Host aws-ec2-197
    HostName <IP-Here>
    User ec2-user
    IdentityFile ~/.ssh/secure.pem
```

At this point if you tried to connect to the instance from your shell manually like so:

```bash
ssh -i "inclass197.pem" root@ec2-44-211-91-200.compute-1.amazonaws.com
```

Then you would run into issues with the command because of permissions issues. In order to correct this we must first change @root to be @ec2-user.

Then we can run:

```bash
chmod 400 inclass197.pem
```

This removes unnecessary permissions from the file that can prevent malicious attacks to your security key and therefore allow AWS-CLI to trust it when opening an SSH connection. Now you can run the following command to connect to your instance with your terminal:

```bash
ssh -i "inclass197.pem" ec2-user@ec2-XX-XXX-XX-XXX.compute-1.amazonaws.com
```

Moreover you can CMD ⌘ + Shift ⇧ + P inside of your VS code window and type Remote-SSH: Connect to Host . . . and select the option for the name that you inserted into your configuration.

You can check the hostname of the remote instance and whether or not it was loaded with GPUs using the following commands:

```bash
$ hostname
$ nvidia-smi
```

The second command is very useful because it can show whether your GPU is actually being utilized which can help with debugging ML programs.

## Useful Tools

### Screenrc

A .screenrc file is a config file for your terminal. It allows extra features such as bold colors. A good starter config is the first result for "screenrc cool" on Google. You can place this file in your home directory, and your terminal will use this file to check your preferences whenever it starts up.

### Zsh

Zsh is an alternative to bash that allows you to use automatic cd, recursive path expansion, and plugin and theme support. You can install zsh on AWS with the command

```bash
sudo yum install zsh
```

And you can open zsh by typing

```bash
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

You can install "oh my zsh" to manage the zsh configuration

```bash
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

You can make zsh your default shell with the commands

```bash
sudo yum install util-linux-user
sudo chsh -s $(which zsh)
```

## Converting to Using GPUs

### Environment Setup

The "conda list env" command lists all the conda environments that are available immediately on your instance. At this time we will leverage the "pytorch" environment that comes with our AMI. To activate the preinstalled environment, use the following command in your terminal.

```bash
source activate pytorch
```

We use "source activate" as opposed to "conda activate" since conda needs to be initialized when the instance is first connected to. Thus the following commands produce the same effect:

```bash
conda init
conda activate pytorch
```

### Code Setup

We will work with some starter code that can be found here. Clone the repository onto your instance by using the VS Code terminal. Make sure to use HTTPS instead of SSH since we have not added ssh keys to the instance.

Specifically, we will work with the main.py file which trains a model. We will want to compare how long it takes to run an epoch in different situations. As a result, the first step will be to modify the code to include timing. We will import time, use the time.time() function to monitor how long each epoch takes, and then print out the result. This will take place in the loop inside the main function.

```python
for epoch in range(1, args.epochs + 1):
      t0 = time.time()
      train(args, model, train_loader, optimizer, epoch)
      t_diff = time.time() - t0
      print(f"Elapsed time is {t_diff}")
      test_loss, test_acc = test(model, test_loader)
      scheduler.step()
```

### Adding Wandb Logging

Just as we have done in previous lectures, we will also incorporate Weights and Biases into the code base for the sake of good practice. The conda environment does not already include the library so we will have to install it (by typing "conda install wandb" in the terminal). In main.py we will import wandb, initialize wandb with the train and test arguments in the configurations, and then log the relevant information.

```python
wandb.init(config={"train_args": train_kwargs, "test_args": test_kwargs})
for epoch in range(1, args.epochs + 1):
      t0 = time.time()
      train(args, model, train_loader, optimizer, epoch)
      t_diff = time.time() - t0
      print(f"Elapsed time is {t_diff}")
      test_loss, test_acc = test(model, test_loader)
      scheduler.step()
         wandb.log({"test_loss": test_loss, "test_acc": test_acc, "time_taken": t_diff}, step=epoch)
```

We want to make sure to add a logging finish command as well at the end of our loop.

```python
wandb.finish()
```

Once we have added this we can run with wandb logging. At this point you can also add a login statement at the beginning of the code base or use the wandb-CLI to login from beforehand.

### GPU Adjustments

If we were to run our code right now we would experience a rather slow training time. Running nvidia-smi in our terminal can be useful to investigate this.

Despite the fact that our instance possesses GPUs, we are still not using them. The code itself has to be set up in a way that makes use of the GPUs. To do so, we will adjust the existing starter code in the main.py file.

Side Note: If we run the nvidia-smi command on an instance with no GPUs, like a t2.micro instance type, then it will throw an error at us.

The first thing we need to do is check if CUDA is available. We will perform this check in the main function after the parser and arguments are created and configured. If cuda is available, the device needs to be defined accordingly, the number of workers and shuffle values need to be set, and the train and test arguments need to be updated.

```python
use_cuda = torch.cuda.is_available()
  if use_cuda:
      device = torch.device("cuda")
      cuda_kwargs = {'numworkers': 1, 'shuffle': True}
      train_kwargs.update(cuda_kwargs)
      test_kwargs.update(cuda_kwargs)
  else:
      device = torch.device("cpu")
```

The next thing we must do is load the model and data, both train and test, onto the device. This is done with the ".to(device)" function. We can move the model onto the device when it is defined.

```python
model = Net().to(device)
```

The train and test data can be moved onto the device when they are processed in the loops of the train and test functions respectively. We will also need to update the functions to take the device as an input and include the device in the arguments of the function calls in the loop of the main function.

```python
def train(args, model, train_loader, optimizer, epoch, device):
  model.train()
  for batch_idx, (data, target) in enumerate(train_loader):
         data, target = data.to(device), target.to(device)
      ...

def test(model, test_loader, device):
  model.eval()
  test_loss = 0
  correct = 0
  with torch.no_grad():
      for data, target in test_loader:
             data, target = data.to(device), target.to(device)
          ...

def main():
  ...
  for epoch in range(1, args.epochs + 1):
      t0 = time.time()
      train(args, model, train_loader, optimizer, epoch, device)
      t_diff = time.time() - t0
      print(f"Elapsed time is {t_diff}")
      test_loss, test_acc = test(model, test_loader, device)
      scheduler.step()
      wandb.log({"test_loss": test_loss, "test_acc": test_acc, "time_taken": t_diff}, step=epoch)
        ...
```

Now that we are on the GPUs the code runs much faster than it did before. Each epoch should take approximately 10 seconds to run.

### Improving the Speed

At this point we should be asking ourselves: how can we make it even faster? We will discuss several possible ideas.

**Idea 1: More GPUs**

If we are using up all of our GPU capacity then it might be beneficial to choose a new instance type with more GPUs. However, this is not the case here.

**Idea 2: Increase the batch size to use more of the GPU**

Maybe we should try doubling the batch size to 128 from the default of 64. The rationale is that we are only using up ~20% of our GPU storage, so we might as well use more of it per step. We can try this by running the file with the following command.

```bash
python main_working.py -batch-size=128
```

It turns out that this change likely will not have a significant effect on the training speed (might have a larger effect on smaller/slower GPU instances like P2s). Because the model here is so small, the bottleneck is not in model compute, but rather a memory bottleneck, leading us to our final idea.

**Idea 3: Change the number of workers**

Earlier when we had established our cuda arguments, we set the number of workers to 1. We can try increasing this number. If we set the number of workers to something too high, like 100, then it might not work. Instead, we should try the recommended optimal number for this instance which is 16.

The rationale behind increasing the number of workers is that more workers will help you load the data faster, i.e., after the GPU finishes the forward and backwards pass for a minibatch, a worker will already be ready with the next batch to hand over to the GPU, rather than only starting to load the data once the previous batch completely finishes. We can see that this impacts the data loader because the number of workers gets passed into it as an argument. It turns out that this change is effective at shrinking the memory bottleneck and reducing our training time. On another note, it is possible to multi-thread the training process in addition to optimizing the data loading.

## Getting Started with CheXzero

Now we will transition to working with the CheXzero codebase. Our goal will be to get the run_train.py file to run successfully. We can continue using the previous instance but we will have a new environment, code base, etc.

In order to install CheXzero we can clone the github directory with HTTPS (not using SSH) because we did not add ssh-keys to the new virtual AWS instance.

Clone from this Github directory

```bash
$ git clone https://github.com/rajpurkarlab/CheXzero.git
```

In order to get started with the repository code let us first cd CheXzero/ and install the necessary Python dependencies.

Because the AMI has just been initialized we cannot access conda as the path for the conda environment has not been established on the virtual instance. For this reason we use source first every time. We can then run the following commands in order to set up our new environment.

```bash
$ source activate base
$ conda create -n <new_env_name> python=3.9
$ conda activate  <new_env_name>
```

Once we have activated our new environment inside our AMI, we can proceed with installing the dependencies we need with pip.

```bash
$ pip install -r requirements.txt
```

An error that we encountered in class was the following: "No matching distribution found for opencv-python-headless". The problem is the requirements.txt file has the following line which specified a version that is not available with the PyPI registry: opencv-python-headless==4.1.2.30

We can fix this error by getting rid of the version specification: "opencv-python-headless" Note that this can cause issues with package compatibility because of module dependency issues.

> **Notes — Repository state**
> The repository might be changed in the future such that this error no longer occurs. If this is the case, do not worry! This can still serve as an example of how to deal with dependency issues in the future.

## How to Train with CheXzero

We can get access to the training dataset: MIMIC-CXR Database here. In order to get access to the dataset itself, please scroll down to the "Files" section for access requirements. This possess will take time for approval so one may want to do this earlier rather than later.

Once we have access to the image database we can start by running the wget command for the following link. https://physionet.org/content/mimic-cxr-jpg/2.0.0/

Note that due to the file size, the download will take approximately 12 hours or more. We can get started with a sample of images to show how training works. Let us first look at p1000032 in the parent directory. We can also get this sample without having to download the entire dataset by specifying wget the folder we want and giving it the correct path.

If you downloaded the whole folder structure then you will already have a file called mimic-cxr-reports.zip. Otherwise you can get this file from the root directory using wget by specifying the file path. For the structure of file paths you can always check the physionet.org path layout.

We can unzip the downloaded file of text report like so:

```bash
unzip mimic-cxr-reports.zip
```

Let us now copy the dataset into data/ directory for convenience. In order to preprocess the data we need to give the pre_process.py file some command line arguments.

We find that we need to give it the path to the chest x-ray images and the path to the reports.

```bash
$ python run_preprocess.py --chest_x_ray_path= data/physionet.org/files/mimic-cxr-jpg/2.0.0/files --radiology_reports_path= data/physionet.org/files/mimic-cxr/2.0.0/files
```

This process should take a long time for the full-data and will take a very short time if just processing the mini-sample. The outputted files will be data/cxr_path.csv, data/cxr.h5, data/mimic_expressions.csv

Note that the mainstay of the data is stored in cxr.h5: HDF5 file format for storing data efficiently. This file helps cache the image and file path memory that is being fed into the model in batches. Having an h5 file can lead to a 10-100x speed-up.

### Exploring the h5 File

Now, let's inspect the generated h5 file and see how the chest x-rays have all been stored inside of it. We can start by navigating to the notebooks/ directory with the CheXzero repository and making a new notebook called test_h5_file.ipynb. Then, we select the correct conda environment by clicking "Select Kernel" in the top right corner of the screen and choosing the new environment you created for CheXzero. In our case we named our environment chexzero-demo. You also may need to install certain extensions for Jupyter and Python.

Now, from the new CheXzero environment, run the following command:

```bash
$ conda install -n new ipykernel -update-deps -force-reinstall
```

This will install ipykernel which will allow us to run a jupyter notebook from VSCode. Now, we can open the h5 file and inspect its contents with the following code:

```python
import h5py
import numpy as np

f1 = h5py.File('../data/cxr.h5', 'r+')
list(f1.keys())
f1['cxr']
```

This should output the following:

```
<HDF5 dataset "cxr": shape (7, 320, 320), type "<f4">
```

Here, we can see the name of the data is "cxr", and that the shape of the data is (7, 320, 320). We can interpret this as our h5 file containing 7 chest x-rays each stored as a 320-by-320 array. You can try to explore the contents of the array and the values of the pixels further on your own!

### Running Training

Now, it's time to train! Navigate out to the repo root directory ("cd .." if within the notebooks folder). We can try to run training:

```bash
$ python run_train.py --cxr_filepath "./data/cxr.h5" --txt_filepath "data/mimic_impressions.csv"
```

However, this will likely error if the copy of the repository is the same as the current copy. Here are the necessary fixes to various errors you might encounter:

1. Error: name 'Tuple'' is not defined: The Tuple import might be missing initially from zero_shot.py. Open zero_shot.py and change line 9 to "from typing import List, Tuple".
2. Error: Unable to open file: We cannot have concurrent access to the h5 file, so either stop the kernel in "notebooks/test_h5_file.ipynb" or run "f1.close" from within the notebook.
3. Error: Unable to open object ______: Open train.py, and change line 42 from "cxr_unprocessed" to "cxr", which is the name of our key
4. Error: No kernel image is available for execution on the device
   1. This is a CUDA error, and more specifically, CUDA and our pytorch installation are mismatched. We can see what CUDA version we need with the following:

      ```bash
      $ nvidia-smi
      ```

      In our case, we get CUDA Version 11.6.
   2. In our requirements.txt file, we can see our pytorch version is 1.10.2. Is there a release of 1.10.2 that works with CUDA 11.6? We can try to uninstall the relevant pytorch packages:

      ```bash
      $ pip uninstall torch torchvision torchaudio
      ```
   3. Now, we can try to install a matching Pytorch distribution:

      ```bash
      $ pip install torch==1.10.2+cu113 torchvision==0.11.3+cu113 torchaudio==0.10.2 --extra-index-url https://download.pytorch.org/whl/cu113
      ```

Now, we can try running training again, and it should work! The quotations in the line below might need to be replaced and typed naturally.

```bash
python run_train.py --cxr_filepath "./data/cxr.h5" --txt_filepath "data/mimic_impressions.csv"
```

Once the model trains, you can try to use zero_shot.ipynb and the CheXzero README to run zero shot evaluations of the trained models!
