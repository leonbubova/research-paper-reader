---
course: Harvard CS197
term: Fall 2022
lecture: "8–9"
title: Experiment Organization Sparks Joy
subtitle: Organizing Model Training with Weights & Biases and Hydra
instructor: Pranav Rajpurkar
source_notes: https://docs.google.com/document/d/1kZCrACh8wHFFAinscHpbaHqMBKeErjOgXMVqKSUZIMU/edit
course_site: https://cs197.seas.harvard.edu/
learning_outcomes:
  - Manage experiment logging and tracking through Weights & Biases.
  - Perform hyperparameter search with Sweeps.
  - Manage complex configurations using Hydra.
tags: [experiment-tracking, weights-and-biases, hydra, hyperparameter-search, mlops]
provenance: Prose is the author's original lecture notes, transcribed. Blocks marked "Added explanation" were written for this reader and are not the author's words.
---

## Abstract

Once we go from training one model to training hundreds of different models with different hyperparameters, we need to start organizing. We're going to break down our organization into three pieces: experiment tracking, hyperparameter search, and configuration setup. We're going to use Weights & Biases to demonstrate experiment logging and tracking; we're then going to leverage Weights & Biases Sweeps to run a hyperparameter search over training hyperparameters, and finally, we will use Hydra to elegantly configure our increasingly complex deep learning applications. This lecture is structured to give you exposure and then some practice with incorporating these experiment organization tools into your model training workflows.

**Learning Outcomes:**
- Manage experiment logging and tracking through Weights & Biases
- Perform hyperparameter search with Sweeps.
- Manage complex configurations using Hydra.

## Installation

```
conda create --name l8 python=3.9
conda install -n l8 ipykernel --update-deps --force-reinstall
conda install -n l8 pytorch torchvision torchaudio -c pytorch-nightly
conda install -n l8 -c conda-forge wandb
conda install -c conda-forge hydra-core
```

## Experiment Tracking

I've encountered that without good experiment tracking tools, we can end up with a really well performing model that we don't remember the hyperparameter choices for, or launch 100 experiments without being able to easily track which of the models is doing best. Experiment tracking tools help us solve these problems, and have become more sophisticated over the years. Our lecture today will follow the usage of Weights and Biases with PyTorch.

### Logging

We're starting with a simulation of a training run, where we typically would print the hyperparameters we are using, and the loss + accuracy of the model as it is training.

Here's what that might look like:

```python
import random

def run_training_run_txt_log(epochs, lr):
   print(f"Training for {epochs} epochs with learning rate {lr}")
    offset = random.random() / 5
  
   for epoch in range(2, epochs):
       # simulating a training run
       acc = 1 - 2 ** -epoch - random.random() / epoch - offset
       loss = 2 ** -epoch + random.random() / epoch + offset
       print(f"epoch={epoch}, acc={acc}, loss={loss}")

# run a training run with a learning rate of 0.1
run_training_run_txt_log(epochs=10, lr=0.01)
```

We're now going to come out of the stone age for deep learning model development by embracing an experiment tracking tool. Our tool of choice will be Weights and Biases.

### Weights and Biases

Weights & Biases is:

> "the machine learning platform for developers to build better models faster. Use W&B's lightweight, interoperable tools to quickly track experiments, version and iterate on datasets, evaluate model performance, reproduce models, visualize results and spot regressions, and share findings with colleagues.

Which experiment tracking tool you use is a stylistic preference: I like Weights and Biases aka wandb: you can pronounce it w-and-b (as they originally intended), wand-b (because it's magic like a wand), or wan-db (because it saves things like a database). Alternatives include Tensorboard, Neptune, and Tensorboard.

Let's start using wandb. You may be prompted to create an account and then add your token.

```python
# Log in to your W&B account
import wandb
wandb.login()
```

We're now going to modify our simulation function to make it work with wandb.

```python
import random


def run_training_run(epochs, lr):
     print(f"Training for {epochs} epochs with learning rate {lr}")

     wandb.init(
           # Set the project where this run will be logged
           project="example", 
           # Track hyperparameters and run metadata
           config={
           "learning_rate": lr,
           "epochs": epochs,
           })
     
     offset = random.random() / 5
     print(f"lr: {lr}")
     for epoch in range(2, epochs):
           # simulating a training run
           acc = 1 - 2 ** -epoch - random.random() / epoch - offset
           loss = 2 ** -epoch + random.random() / epoch + offset
           print(f"epoch={epoch}, acc={acc}, loss={loss}")
           wandb.log({"acc": acc, "loss": loss})

     wandb.finish()

run_training_run(epochs=10, lr=0.01)
```

We're using 3 functions here: `wandb.init`, `wandb.log`, and `wandb.finish` – what do each of them do?

- We call `wandb.init()` once at the beginning of your script to initialize a new job. This creates a new run in W&B and launches a background process to sync data.
- We call `wandb.log(dict)` to log a dictionary of metrics, media, or custom objects to a step. We can see how our models and data evolve over time.
- We call `wandb.finish` to make a run as finished, and finish uploading all data.

Let's see what we see on the wandb website. We should see our accuracy and loss curves.

In our information tab, we should also be able to see the config and a summary that tells us the last value of acc and of loss.

We are getting two nice functionalities here already:

1. We are able to see how the accuracy and loss changed over each step of the loop.
2. We're able to see the config (hyperparameters) associated with the run.
3. We're able to see the final acc and loss achieved by our run.

### Multiple experiments

We're now going to add a layer of complexity. When we're typically training models, we're trying out different hyperparameters. One of the most important hyperparameters we'll tune will be the learning rate, another one might be the number of epochs. How would we track multiple runs?

```python
def run_multiple_training_runs(epochs, lrs):
   for epoch in epochs:
       for lr in lrs:
           run_training_run(epoch, lr)

# Try different values for the learning rate
epochs = [100, 120, 140]
lrs = [0.1, 0.01, 0.001, 0.0001]
run_multiple_training_runs(epochs, lrs)
```

As you can see, this uses the function we've already written above, calling it multiple times with a different learning rate and epoch choice. Let's see what we get.

We can go on wandb's website and to the table tab.

We can see a few things:

1. We now have several different runs (each with interestingly assigned names).
2. We're able to see the epochs and learning rate settings for each, along with the final acc and loss that they achieve.
3. We're also able to see the state of the runs (and see that one of them is still running, which will be handy when we start running long jobs).

Let's switch to the Workspace tabs.

This is cool, we're now able to see the training performance of multiple models across time.

> **Notes — In class**
> Using https://github.com/rajpurkar/lec8/blob/master/example_1.ipynb as a starting point:
> - Exercise 1: Simulate evaluating on the validation set every 10 epochs. Log not only the training performance but also the validation performance (val_loss and val_acc). Hint: Use nested dictionaries and look up the documentation for wandb.log.
> - Exercise 2: Rather than show the last accuracy and last loss in the table tab, attempt to show the best accuracy (max) and loss (min) instead. Hint: use wandb.run.summary.

> **Notes — At home**
> Using https://github.com/rajpurkar/lec8/blob/master/exercise.py as a starting point,
> - Exercise 3: Modify the script to log the train loss, val loss, val accuracy.
> - Exercise 4: In validate_model, create a wandb Table to log images, labels and predictions. Hint: see https://docs.wandb.ai/guides/data-vis/log-tables

Once you are done, you can compare your solution with the solution here.

We can also track the parameters and gradients of a model by using `wandb.watch`. In pseudocode (because we're not showing the model):

```python
        model = get_model(config.dropout)
       wandb.watch(model, log="all", log_freq=100)
```

Here's what that allows us to see:

> **Notes — In class**
> - Exercise: What statements can you make about the progression of the parameters and gradients?
> - Exercise: Assuming they were generated using the following model architecture, what does each parameter (e.g. 5.bias) correspond to?

```python
def get_model(dropout):
   "A simple model"
   model = nn.Sequential(
       nn.Flatten(),
       nn.Linear(28*28, 256),
       nn.BatchNorm1d(256),
       nn.ReLU(),
       nn.Dropout(dropout),
       nn.Linear(256, 10)).to(DEVICE)
   return model
```

### Saving + Loading Models as Artifacts

It's great that we have models training well. We now decide that we want to use one of the models that was trained. We could now look up the config for that run on W&B, and then retrain the model and save it! But gee, it would have been nice if we would have just saved the model associated with a run, so we could directly load it right?

Well, we should be able to make this work! How?

We can use Weights & Biases Artifacts to track datasets, models, dependencies, and results through each step of your machine learning pipeline. Artifacts make it easy to get a complete and auditable history of changes to your files. From the documentation:

> Artifacts can be thought of as a versioned directory. Artifacts are either an input of a run or an output of a run. Common artifacts include entire training sets and models. Store datasets directly into artifacts, or use artifact references to point to data in other systems like Amazon S3, GCP, or your own system.

It's really easy to log wandb artifacts using 4 simple lines of code:

```python
wandb.init()
artifact = wandb.Artifact(<enter_filename>, type='model')
artifact.add_file(<file_path>)
wandb.run.log_artifact(artifact)
```

So if we had a model saving line for PyTorch:

```python
model_path = f"model_{epoch}.pt"
torch.save(model.state_dict(), model_path)
```

We could modify it to upload the artifact on wandb.

```python
# 🐝 Log the model to wandb
model_path = f"model_{epoch}.pt"
torch.save(model.state_dict(), model_path)
artifact = wandb.Artifact(model_path, type='model')
artifact.add_file(model_path)
wandb.run.log_artifact(artifact)
```

Now we can see our model checkpoints saving in W&B:

We can also see the associated metadata:

Exercise: Update the code so that you can save the top 3 best models while training. Hint: See here.

If we have a saved model, we can now load the model. Assuming our original loading procedure was to load from a locally saved checkpoint:

```python
model.load_state_dict(torch.load("model_9.pt"))
```

We can now use:

```python
run = wandb.init()
artifact = run.use_artifact('cs197/pytorch-intro/model_9.pt:v1', type='model')
artifact_dir = artifact.download()
model.load_state_dict(torch.load(artifact_dir + "/model_9.pt"))
```

## Hyperparameter Search

When we have several choices of hyperparameters, we want to 'sweep' over them: this means running models with different values of the hyperparameters.

### Search Options

We can decide how we sample values of the hyperparameters, including Bayesian, grid search, and random search.

- In grid search, we define a set of possible values for each hyperparameter, and the search trains a model for every possible combination of hyperparameter values.
- For example: with `epochs = [100, 120, 140]`, and `lrs = [0.1, 0.01, 0.001, 0.0001]`, our grid will be `list(itertools.product(epochs, lrs))`, which is `[(100, 0.1), (100, 0.01), (100, 0.001), (100, 0.0001), (120, 0.1), (120, 0.01), (120, 0.001), (120, 0.0001), (140, 0.1), (140, 0.01), (140, 0.001), (140, 0.0001)]`.
- In random search, we provide a statistical distribution for each hyperparameter from which values are sampled. Here, we typically control or limit the number of hyperparameter combinations used.
- In Bayesian optimization, the results of the previous iteration are used to decide the next set of hyperparameter values using a sequential model-based optimization (SMBO) algorithm. This doesn't scale well with the number of parameters.

### Weights & Biases Sweeps

As the documentation specifies:

> "There are two components to Weights & Biases Sweeps: a controller and one or more agents. The controller picks out new hyperparameter combinations. Typically the controller is managed on the Weights & Biases server. Agents query the Weights & Biases server for hyperparameters and use them to run model training. The training results are then reported back to the controller. Agents can run one or more processes on one or more machines."

Once we have our wanb training code, adding sweeps only takes 3 steps:

1. Define the sweep configuration
2. Initialize the sweep (controller)
3. Start the sweep agent

Let's look at it in action. Assume we have the following code:

```python
import wandb
def my_train_func():
   # read the current value of parameter "a" from wandb.config
   wandb.init()
   a = wandb.config.a

   wandb.log({"a": a, "accuracy": a + 1})
```

```python
sweep_configuration = {
   "name": "my-awesome-sweep",
   "metric": {"name": "accuracy", "goal": "maximize"},
   "method": "grid",
   "parameters": {
       "a": {
           "values": [1, 2, 3, 4]
       }
   }
}
```

Note that:

1. Grid search is being used
2. We're specifying the metric to optimize – this is only used by certain search strategies and stopping criteria. Note that we must log the variable accuracy (in this example) within our Python script to W&B, which we have done.
3. We've specified values for "a".

**Step 2: Initialize the sweep**

In this step, we start the aforementioned sweep controller:

```python
sweep_id = wandb.sweep(sweep=sweep_configuration, project='my-first-sweep')
```

**Step 3: Start the sweep agent**

Finally, we start the agent, providing the sweep id, the function to call, and optionally, the number of runs to run (count).

```python
wandb.agent(sweep_id, function=my_train_func, count=4)
```

Putting it all together, here's how our code might look:

```python
import wandb
sweep_configuration = {
   "name": "my-awesome-sweep",
   "metric": {"name": "accuracy", "goal": "maximize"},
   "method": "grid",
   "parameters": {
       "a": {
           "values": [1, 2, 3, 4]
       }
   }
}

def my_train_func():
   # read the current value of parameter "a" from wandb.config
   wandb.init()
   a = wandb.config.a

   wandb.log({"a": a, "accuracy": a + 1})

sweep_id = wandb.sweep(sweep_configuration)

# run the sweep
wandb.agent(sweep_id, function=my_train_func)
```

> **Notes — In class exercise**
> 1. Modify the following code so that you can run a sweep over it. Choose val_loss as the metric you want to optimize for. Select reasonable options for the sweep over batch_size, epochs and learning rate.
> 2. Now, for the learning rate, use a distribution which samples between exp(min) and exp(max) such that the natural logarithm is uniformly distributed between min and max.

Compare your solution to the solution here.

```python
import numpy as np 
import random

def train_one_epoch(epoch, lr, bs): 
 acc = 0.25 + ((epoch/30) +  (random.random()/10))
 loss = 0.2 + (1 - ((epoch-1)/10 +  random.random()/5))
 return acc, loss

def evaluate_one_epoch(epoch): 
 acc = 0.1 + ((epoch/20) +  (random.random()/10))
 loss = 0.25 + (1 - ((epoch-1)/10 +  random.random()/6))
 return acc, loss

def main():
   run = wandb.init(project='my-first-sweep')

   # this is key: we define values from `wandb.config` instead of 
   # defining hard values
   lr  =  wandb.config.lr
   bs = wandb.config.batch_size
   epochs = wandb.config.epochs

   for epoch in np.arange(1, epochs):
     train_acc, train_loss = train_one_epoch(epoch, lr, bs)
     val_acc, val_loss = evaluate_one_epoch(epoch)

     wandb.log({
       'epoch': epoch, 
       'train_acc': train_acc,
       'train_loss': train_loss, 
       'val_acc': val_acc, 
       'val_loss': val_loss
     })
```

At home exercise: update your previous solution to this to have a Weights & Biases sweep.

## Configuration with Hydra

We don't want to train deep learning pipelines with pathnames, model names, and hyperparameters that are hardcoded. We want to be able to use a configuration which we can modify depending on which dataset, model, or configuration we are using.

### The bad ways to do this

First, let's start with some bad ways to configure our deep learning runs. Let's say we wanted to control the batch_size of our dataset from the command line. Maybe when you work on one machine, you can afford to have a large batch size, and on another, you can't.

The most basic thing you could do is to remember to change the hardcoded batch size.

```python
      batch_size = 128
        # batch_size = 4
```

This solution should not spark joy. It gets bloated really quickly.

A second solution is to pass the value of batch_size into a script when you run it. We can change it depending on which machine we're on. We can use command line arguments to do this via sys.argv.

```python
# main.py
import sys
batch_size = sys.argv[1]
```

We can call `python main.py 16`. If we're configuring multiple settings, then working with sys.argv is not very user-friendly, and we'll want to use a parser. The most popular of these is argparse:

> "The argparse module makes it easy to write user-friendly command-line interfaces. The program defines what arguments it requires, and argparse will figure out how to parse those out of sys.argv. The argparse module also automatically generates help and usage messages and issues errors when users give the program invalid arguments."

Here's a simple usage.

```python
# main.py
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('batch_size', metavar='B', type=int,
                   help='batch_size for the model')

args = parser.parse_args()
print(args.batch_size)
```

Exercise: have this take in batch_size, learning_rate, dropout, using the appropriate types for each, and using defaults for each if they are not supplied except learning_rate, which must be supplied.

This could work fine, but once we have a hundred arguments, it's going to be hard to explicitly specify each of them that we want to be different from the default! If only there were a way to store it in a configuration file.

### Hydra

We're going to use Hydra:

> Hydra is an open-source Python framework that simplifies the development of research and other complex applications. The name Hydra comes from its ability to run multiple similar jobs - much like a Hydra with multiple heads.

We're going to follow the Hydra tutorial, but with some of my own spin on it.

```python
from omegaconf import DictConfig, OmegaConf
import hydra

@hydra.main(version_base=None)
def run(cfg: DictConfig) -> None:
   print(OmegaConf.to_yaml(cfg)) # {}

if __name__ == "__main__":
   run()
```

In this example, Hydra creates an empty config (cfg) object and passes it to the hydra.main decorator.

Pro tips:

> "OmegaConf is a YAML based hierarchical configuration system, with support for merging configurations from multiple sources (files, CLI argument, environment variables) providing a consistent API regardless of how the configuration was created."

> "Decorators are a significant part of Python. In simple words: they are functions which modify the functionality of other functions. They help to make our code shorter and more Pythonic. Most beginners do not know where to use them so I am going to share some areas where decorators can make your code more concise."

We can add new config values via the command line using "+".

```
# should return "batch_size: 16"
python run.py +batch_size=16 
```

Here's where Hydra starts to shine. Because it is tedious to type command line arguments, we can start working with configuration files. Hydra configuration files are yaml files and should have the .yaml file extension.

We create a config.yaml file in the same directory as run.py, and populate it with our configuration.

```yaml
# config.yaml
batch_size: 16
```

Now, we have to tell Hydra where to find the configuration. Note that the config_name should match our filename, and the config_path is relative to the application.

```python
@hydra.main(version_base=None, config_path=".", config_name="config")
```

We can now run run.py with `python run.py`, and should see the batch_size printed. One of the cool things here is that we can override the config using the command line (this time, we leave out the "+" because the config value is not new:

```
 python run.py batch_size=32 # should print 32
```

Let's start making our config a little more useful:

```yaml
loss: cross_entropy
batch_size: 64
num_workers: 4
name: ??? # Missing value, must be populated prior to access

optim: # Config is hierarchical
  name: adam
  lr: 0.0001
  weight_decay: ${optim.lr} # Value interpolation
  momentum: 0.9
```

There are a few new things here:

1. We are using a hierarchy (e.g. cfg.optim.name)
2. We are using value interpolation (e.g. cfg.optim.weight_decay)
3. We are specifying a missing value that must be populated

Let's see it in action:

```python
from omegaconf import DictConfig, OmegaConf
import hydra

@hydra.main(version_base=None, config_path=".", config_name="config")
def run(cfg: DictConfig):
   assert cfg.optim.name == 'adam'          # attribute style access
   assert cfg["optim"]["lr"] == 0.0001      # dictionary style access
   assert cfg.optim.weight_decay == 0.0001  # Value interpolation
   assert isinstance(cfg.optim.weight_decay, float) # Value interpolation type

   print(cfg.name)                       # raises an exception

if __name__ == "__main__":
   run()
```

We should get the "omegaconf.errors.MissingMandatoryValue: Missing mandatory value: name" error. We can fix this by specifying a name when calling the program.

```
python run.py name=exp1 # Should print 'exp1'
```

Now let's add a little bit of complexity. Say we want to create an optimizer class.

```python
class Optimizer:
   """Optimizer class."""
   algo: str
   lr: float

   def __init__(self, algo: str, lr: float) -> None:
       self.algo = algo
       self.lr = lr
   
   def __str__(self):
       return str(self.__class__) + ": " + str(self.__dict__)
```

Now we can instantiate the optimizer class using our current config.

```python
@hydra.main(version_base=None, config_path=".", config_name="config")
def run(cfg: DictConfig):
   opt = Optimizer(cfg.optim.name, cfg.optim.lr)
   print(str(opt))
```

We should see `<class '__main__.Optimizer'>: {'algo': 'adam', 'lr': 0.0001}`

Could we directly instantiate the optimizer with hydra though? Hydra provides `hydra.utils.instantiate()` (and its alias `hydra.utils.call()`) for instantiating objects and calling functions. Prefer instantiate for creating objects and call for invoking functions.

We can use a simple config:

```yaml
# config2.yml
optimizer:
 _target_: run.Optimizer
 algo: SGD
 lr: 0.01
```

And we can instantiate as such:

```python
from hydra.utils import instantiate
@hydra.main(version_base=None, config_path=".", config_name="config2")
def run(cfg: DictConfig):
   opt = instantiate(cfg.optimizer)
   print(opt)
```

Pro tip from the docs:

> Call/instantiate supports:
> - Named arguments : Config fields (except reserved fields like _target_) are passed as named arguments to the target. Named arguments in the config can be overridden by passing a named argument with the same name in the instantiate() call-site.
> - Positional arguments : The config may contain a _args_ field representing positional arguments to pass to the target. The positional arguments can be overridden together by passing positional arguments in the instantiate() call-site.

We can even do a recursive instantiation.

```yaml
# config3.yaml
trainer:
 _target_: run.Trainer
 optimizer:
   _target_: run.Optimizer
   algo: SGD
   lr: 0.01
 dataset:
   _target_: run.Dataset
   name: Imagenet
   path: /datasets/imagenet
```

The following code can instantiate our Trainer, instantiating our Dataset and Optimizer at the same time.

```python
from omegaconf import DictConfig, OmegaConf
import hydra
from hydra.utils import instantiate

class Dataset:
   name: str
   path: str

   def __init__(self, name: str, path: str) -> None:
       self.name = name
       self.path = path

class Optimizer:
   """Optimizer class."""
   algo: str
   lr: float

   def __init__(self, algo: str, lr: float) -> None:
       self.algo = algo
       self.lr = lr

   def __str__(self):
       return str(self.__class__) + ": " + str(self.__dict__)

class Trainer:
   def __init__(self, optimizer: Optimizer, dataset: Dataset) -> None:
       self.optimizer = optimizer
       self.dataset = dataset

@hydra.main(version_base=None, config_path=".", config_name="config3")
def run(cfg: DictConfig):
   opt = instantiate(cfg.trainer)
   print(opt)
```

Exercise: Show the config.yaml file and train.py files you would use to instantiate a torch.nn.Sequential object with two linear layers.

Solution for the yaml file (from here; remove highlighting below to see it):

```yaml
_target_: torch.nn.Sequential
_args_:
 - _target_: torch.nn.Linear
   in_features: 9216
   out_features: 100

 - _target_: torch.nn.Linear
   in_features: ${..[0].out_features}
   out_features: 10
```

### Config Groups

Rather than a single configuration file, we often want multiple configuration files. In ML, these are used to specify different datasets, or models, or logging behaviors we might want to use. We thus typically use A Config Group, which will hold a file for each dataset/model configuration option.

Your config groups for an ML application might look something like:

```
configs/
├── dataset
│   ├── cifar10.yaml
│   └── mnist.yaml
├── defaults.yaml
├── hydra
│   ├── defaults.yaml
│   └── with_ray.yaml
├── model
│   ├── small.yaml
│   └── large.yaml
├── normalization
│   ├── batch.yaml
│   ├── default.yaml
│   ├── group.yaml
│   ├── instance.yaml
│   └── nonorm.yaml
├── train
│   └── defaults.yaml
└── wandb
    └── defaults.yaml
```

Read through the config groups docs, and defaults docs to understand config_groups and defaults. Overall, here's what we do:

1. We'll create a directory, sometimes called confs/ or configs/, that contains all our configs.
2. We can specify which configuration to use. For example, if we wanted to use cifar10.yaml in datasets, we would use `python run.py dataset=cifar10`

```yaml
# cifar10.yaml
---
name: cifar10
dir: cifar10/
train_batch: 32
test_batch: 10
image_dim:
    - 32
    - 32
    - 3
num_classes: 10
```

3. The defaults.yaml specifies which dataset or model to use by default.

```yaml
# defaults.yaml
---
defaults:
    - dataset: mnist
    - model: ${dataset}
    - train: defaults
    - wandb: defaults
    - hydra: defaults
    - normalization: default
model:
    num_groups: -1
```

Exercise: Have a configuration for a small model and a large model. The large model instantiates a torch.nn.Sequential object with three linear layers, the small model with 2 linear layers. Make the small model the default.

Pro-tip: Integrating Hydra with W&B: We've looked at two tools today, W&B and Hydra. How do we get the two to work together? There are a couple of usage patterns to know about. Refer to this tutorial to see example code for how to put the two together.
