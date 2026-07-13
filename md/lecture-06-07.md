---
course: Harvard CS197
term: Fall 2022
lecture: "6–7"
title: Moonwalking with PyTorch
subtitle: Solidifying PyTorch Fundamentals
instructor: Pranav Rajpurkar
source_notes: https://docs.google.com/document/d/1dA8KmOTZePMRl3MixxM6Fb0H8IJhIyn_g-LUXbRHeqU/edit
course_site: https://cs197.seas.harvard.edu/
learning_outcomes:
  - Perform Tensor operations in PyTorch.
  - Understand the backward and forward passes of a neural network in context of Autograd.
  - Detect common issues in PyTorch training code.
tags: [pytorch, tensors, autograd, neural-networks, deep-learning]
provenance: Prose is the author's original lecture notes, transcribed. Blocks marked "Added explanation" were written for this reader and are not the author's words.
---

## Abstract

Last lecture, in our coding walkthrough, we saw how PyTorch was being used within a codebase, but we did not dive into the fundamentals of PyTorch. Today, we will solidify our understanding of the PyTorch toolkit. As part of this lecture, you will first read through linked official Pytorch tutorials. Then you will work through exercises on Tensors, Autograd, Neural Networks and Classifier Training/Evaluation. Some of the questions will ask you to implement small lines of code, while other questions will ask you to guess what the output of operations will be, or identify issues with the code. These exercises can be a great way of solidifying your knowledge of a toolkit, and I strongly encourage you to try the problems yourselves before you look them up in the referenced solutions.

Midjourney Generation: "a robot steps forward walking down a hill"

**Learning outcomes:**
- Perform Tensor operations in PyTorch.
- Understand the backward and forward passes of a neural network in context of Autograd.
- Detect common issues in PyTorch training code.

## PyTorch Exercises

As part of this lecture, in each of the sections, you will first read through the linked official Pytorch Blitz tutorial pages. Then you will work through exercises. We will cover Tensors, Autograd, Neural Networks and Classifiers.

There are 55 exercises in total. The exercises have solutions hidden through a black highlight – example. You can reveal the solution by highlighting it. You can also make a copy of the document and remove the highlights all at once. If you have any suggestions for improvement on any of the questions, you can send an email to the instructor.

### Installation

First, you'll need to make sure you have all of the packages installed. Here's my environment setup:

```bash
conda create --name lec6 python=3.9
conda activate lec6
# MPS acceleration is available on MacOS 12.3+
conda install pytorch torchvision torchaudio -c pytorch-nightly
conda install -c conda-forge matplotlib
conda install -n lec6 ipykernel --update-deps --force-reinstall
```

### Tensors

We'll start with the very basics, Tensors. First, go through the Tensor tutorial [here](https://pytorch.org/tutorials/beginner/blitz/tensor_tutorial.html). An excerpt:

Tensors are a specialized data structure that are very similar to arrays and matrices. In PyTorch, we use tensors to encode the inputs and outputs of a model, as well as the model's parameters.

Tensors are similar to NumPy's ndarrays, except that tensors can run on GPUs or other specialized hardware to accelerate computing. If you're familiar with ndarrays, you'll be right at home with the Tensor API. If not, follow along in this quick API walkthrough.

Think you know Tensors well? I'd like you to then attempt the following exercise. Create a notebook to solve the following exercise:

**1. Create an tensor from the nested list `[[5,3], [0,9]]`**

```python
data = [[5, 3], [0, 9]]
x_data = torch.tensor(data)
```

**2. Create a tensor 't' of shape (5, 4) with random numbers from a uniform distribution on the interval [0, 1)**

```python
t = torch.rand((5,4))
```

**3. Find out which device the tensor 't' is on and what its datatype is.**

```python
print(t.device) # cpu
print(t.dtype) # float32
```

**4. Create two random tensors of shape (4,4) and (4,4) called 'u' and 'v' respectively. Join them to make a tensor of shape (8, 4).**

```python
u = torch.randn((4,4))
v = torch.randn((4,4))
print(torch.concat((u,v), dim=0).shape) # torch.Size([8, 4])
```

**5. Join u and v to create a tensor of shape (2, 4, 4).**

```python
print(torch.stack((u,v), dim=0).shape) # torch.Size([2, 4, 4])
```

**6. Join u and v to make a tensor, called w of shape (4, 4, 2).**

```python
w = torch.stack((u,v), dim=2)
print(w.shape) # torch.Size([4, 4, 2])
```

**7. Index w at 3, 3, 0. Call that element 'e'.**

```python
e = w[3,3,0]
```

**8. Which of u or v would you find w in? Verify.**

```python
in u
w[3,3,0] == u[3,3] # True
```

**9. Create a tensor 'a' of ones with shape (4, 3). Perform element wise multiplication of 'a' with itself.**

```python
a = torch.ones((4,3))
a * a # tensor([[1., 1., 1.],[1., 1., 1.],[1., 1., 1.],[1., 1., 1.]])
```

**10. Add an extra dimension to 'a' (a new 0th dimension).**

```python
print(torch.unsqueeze(a, 0).shape) # torch.Size([1, 4, 3])
```

**11. Perform a matrix multiplication of a with a transposed.**

```python
a @ a.T # tensor([3., 3., 3., 3.],[3., 3., 3., 3.],[3., 3., 3., 3.],[3.,
```

**12. What would `a.mul(a)` result in?**

An elementwise multiplication, same as #9

**13. What would `a.matmul(a.T)` result in?**

A matrix multiplication aka dot product, same as #11

**14. What would `a.mul(a.T)` result in?**

An error; the sizes won't match.

**15. Guess what the following will print. Verify**

```python
t = torch.ones(5)
n = t.numpy()
n[0] = 2
print(t)
```

`tensor([2., 1., 1., 1., 1.])` Changes in the NumPy array reflect in the tensor.

**16. What will the following print?**

```python
t = torch.tensor([2., 1., 1., 1., 1.])
t.add(2)
t.add_(1)
print(n)
```

`[3. 2. 2. 2. 2.]`. Changes in the Tensor array reflect in the NumPy array. Note that only `add_` does the operation in place.

### Autograd and Neural Networks

Next, we go through the [Autograd tutorial](https://pytorch.org/tutorials/beginner/blitz/autograd_tutorial.html) and the [Neural Networks tutorial](https://pytorch.org/tutorials/beginner/blitz/neural_networks_tutorial.html). A few relevant (slightly modified) excerpts:

Neural networks (NNs) are a collection of nested functions that are executed on some input data. These functions are defined by parameters (consisting of weights and biases), which in PyTorch are stored in tensors. Neural networks can be constructed using the `torch.nn` package.

Training a NN happens in two steps:
- **Forward Propagation:** In forward prop, the NN makes its best guess about the correct output. It runs the input data through each of its functions to make this guess.
- **Backward Propagation:** In backprop, the NN adjusts its parameters proportionate to the error in its guess. It does this by traversing backwards from the output, collecting the derivatives of the error with respect to the parameters of the functions (gradients), and optimizing the parameters using gradient descent.

More generally, a typical training procedure for a neural network is as follows:
- Define the neural network that has some learnable parameters (or weights)
- Iterate over a dataset of inputs
- Process input through the network
- Compute the loss (how far is the output from being correct)
- Propagate gradients back into the network's parameters
- Update the weights of the network, typically using a simple update rule: `weight = weight - learning_rate * gradient`

Equipped with these tutorials, we are ready to attempt the following exercise! Assume we have the following starter code:

```python
import torch
from torchvision.models import resnet18, ResNet18_Weights
model = resnet18(weights=ResNet18_Weights.DEFAULT)
data = torch.rand(1, 3, 64, 64)
labels = torch.rand(1, 1000)
```

Create a notebook to solve the following exercises:

**17. Run a forward pass through the model with the data and save it as preds.**

```python
preds = model(data)
```

**18. What should the shape of preds be? Verify your guess.**

It should be 1 x 1000

```python
preds.shape # torch.Size([1, 1000])
```

**19. Save the weight parameter of the conv1 attribute of resnet18 as 'w'. Print w because we will need it for later**

Note that my 'w' won't be the same as yours

```python
w = model.conv1.weight
print(w) # tensor([[[[-1.0419e-02,...
```

**20. What should the 'grad' attribute for w be? Verify.**

Should be None. That's because we haven't run backward yet.

```python
print(w.grad) # None
```

**21. Create a CrossEntropy loss object, and use it to compute a loss using 'labels' and 'preds', saved as 'loss'. Print loss because we will need it for later.**

```python
ce = torch.nn.CrossEntropyLoss()
loss = ce(preds, labels)
print(loss) # tensor(3631.9521, grad_fn=<DivBackward1>)
```

**22. Print the last mathematical operation that created 'loss'.**

```python
print(loss.grad_fn) # <DivBackward1>
```

**23. Perform the backward pass.**

```python
loss.backward()
```

**24. Should 'w' have changed? Check with output of #3**

No

**25. Will the 'grad' attribute for w be different than #4? Verify.**

Yes

```python
p(w.grad) # tensor([[[[ 7.0471e+01,  5.9916e+00,...
```

**26. What should 'grad' attribute for loss return for you? Verify.**

None because loss is not a leaf node, and we hadn't set `loss.retain_grad()`, which enables a non-leaf Tensor to have its grad populated during backward().

**27. What should the requires_grad attribute for loss be? Verify.**

True

```python
print(loss.requires_grad) # True
```

**28. What should requires_grad for labels be? Verify.**

False

```python
print(labels.requires_grad) # False
```

**29. What will happen if you perform the backward pass again?**

Runtime Error because saved intermediate values of the graph are freed when we call `.backward()` the first time if we don't specify `retain_graph=True`.

**30. Create an SGD optimizer object with lr=1e-2 and momentum=0.9. Run a step.**

```python
sgd = torch.optim.SGD(model.parameters(), lr=1e-2, momentum=0.9)
sgd.step()
```

**31. Should 'w' have changed? Check with output of #3**

Yes (step changes the parameters)

**32. Should 'loss' have changed? Check with output of #5**

No (because it's not a parameter that is part of model parameters)

**33. Zero the gradients for all trainable parameters.**

```python
model.zero_grad()
```

**34. What should the 'grad' attribute for w be? Verify.**

Zero

**35. Determine, without running, whether the following code will successfully execute.**

```python
data1 = torch.zeros(1, 3, 64, 64)
data2 = torch.ones(1, 3, 64, 64)

predictions1 = model(data1)
predictions2 = model(data2)

l = torch.nn.CrossEntropyLoss()
loss1 = l(predictions1, labels)
loss2 = l(predictions2, labels)

loss1.backward()
loss2.backward()
```

Yes! loss2.backward() wouldn't work when intermediate values of the graph are freed; however, we are not using the same intermediate values for loss2, so it will work.

**36. As above, determine whether the following code will successfully execute.**

```python
data1 = torch.zeros(1, 3, 64, 64)
data2 = torch.ones(1, 3, 64, 64)

predictions1 = model(data1)
predictions2 = model(data1)

l = torch.nn.CrossEntropyLoss()
loss1 = l(predictions1, labels)
loss2 = l(predictions2, labels)

loss1.backward()
loss2.backward()
```

Yes! loss2.backward() wouldn't work when intermediate values of the graph are freed; however, we are not using the same intermediate values for loss2, so it will work.

**37. As above, determine whether the following code will successfully execute.**

```python
data1 = torch.zeros(1, 3, 64, 64)
data2 = torch.ones(1, 3, 64, 64)

predictions1 = model(data1)
predictions2 = model(data2)

l = torch.nn.CrossEntropyLoss()
loss1 = l(predictions1, labels)
loss2 = l(predictions1, labels)

loss1.backward()
loss2.backward()
```

No! loss2.backward() won't work when intermediate values of the graph are freed; here, predictions1 will have been freed.

**38. For one(s) that don't execute, how might you modify one of the .backward lines to make it work?**

Change the first `.backward()` call to use `retain_graph=True`

**39. What will the output of the following code?**

```python
predictions1 = model(data)
l = torch.nn.CrossEntropyLoss()
loss1 = l(predictions1, labels)
loss1.backward(retain_graph=True)

w = model.conv1.weight.grad[0][0][0][0]
a = w.item()

loss1.backward()
b = w.item()

model.zero_grad()
c = w.item()

print(b//a,c)
```

2.0, 0.0

**40. What will be the output of the following code?**

```python
predictions1 = model(data)
l = torch.nn.CrossEntropyLoss()
loss1 = l(predictions1, labels)
loss1.backward(retain_graph=True)

a = model.conv1.weight.grad[0][0][0][0]

loss1.backward()
b = model.conv1.weight.grad[0][0][0][0]

model.zero_grad()
c = model.conv1.weight.grad[0][0][0][0]

print(b//a,c)
```

`tensor(nan) tensor(0.` Because a, b, c are all references to the same data. Without the item()

**41. What is wrong with the following code?**

```python
learning_rate = 0.01
for f in net.parameters():
   f.data.sub(f.grad.data * learning_rate)
```

The sub call should be `sub_`, which will correctly perform the expected in-place operation.

**42. Order the following steps of the training loop correctly (there are multiple correct answers, but one typical setup that you would have seen in the tutorial):**

`optimizer.step(), optimizer.zero_grad(), loss.backward(), output = net(input), loss = criterion(output, target)`

There are multiple correct solutions, including:

```python
optimizer.zero_grad()
output = net(input)
loss = criterion(output, target)
loss.backward()
optimizer.step()
```

**43. What will be the output of the following code?**

```python
net = resnet18(weights=ResNet18_Weights.DEFAULT)
data = torch.rand(1, 3, 64, 64)
target = torch.rand(1, 1000)
optimizer = torch.optim.SGD(net.parameters(), lr=0.001, momentum=0.9)
criterion = torch.nn.CrossEntropyLoss()
orig = net.conv1.weight.clone()[0, 0, 0, 0]
weight = net.conv1.weight[0, 0, 0, 0]
# 1
optimizer.zero_grad()
print(f"{weight == orig}")

# 2
output = net(data)
loss = criterion(output, target)
print(f"{weight == orig}")

# 3
loss.backward()
print(f"{weight == orig}")

# 4
optimizer.step()
print(f"{weight == orig}")
```

```
True
True
True
 False
```

**44. We're going to implement a neural network with one hidden layer. This network will take in a grayscale image input of 32x32, flatten it, run it through an affine transformation with 100 out_features, apply a relu non-linearity, and then map onto the target classes (10). Implement the initialization and the forward pass completing the following piece of code. Use nn.Linear, F.relu, torch.flatten**

```python
import torch
import torch.nn as nn
import torch.nn.functional as F


class Net(nn.Module):

   def __init__(self):
       super(Net, self).__init__()
       # your code here

   def forward(self, x):
       # your code here
       return x
```

```python
class Net(nn.Module):

   def __init__(self):
       super(Net, self).__init__()
       self.fc1 = nn.Linear(32 * 32, 100)
       self.fc2 = nn.Linear(100, 10)

   def forward(self, x):
       x = torch.flatten(x, 1)
       x = F.relu(self.fc1(x))
       x = self.fc2(x)
       return x
```

**45. Using two lines of code, verify that you're able to do a forward pass through the above network.**

```python
net = Net()
preds = net.forward(torch.randn(1, 1, 32, 32))
```

**46. Without running the code, guess what would the following statement yield?**

```python
net = Net()
print(len(list(net.parameters())))
```

4

**47. Get the names of the net parameters**

```python
print([name for name, _ in net.named_parameters()]) # ['fc1.weight', 'fc1.bias', 'fc2.weight', 'fc2.bias']
```

**48. What network layer is the following statement referring to? What will it evaluate to?**

```python
print(list(net.parameters())[1].size())
```

Fc1.bias. `torch.Size([100])`

**49. The following schematic has all of the information you need to implement a neural network. Implement the initialization and the forward pass completing the following pieces of code. Use nn.Conv2d, nn.Linear, F.max_pool2d, F.relu, torch.flatten. Hint: the ReLUs are applied after the subsampling operations and after the first two fully connected layers.**

```python
import torch
import torch.nn as nn
import torch.nn.functional as F


class Net(nn.Module):

   def __init__(self):
       super(Net, self).__init__()
       # your code here

   def forward(self, x):
       # your code here
       return x
```

```python
    def __init__(self):
       super(Net, self).__init__()
       # your code here
       self.conv1 = nn.Conv2d(1, 6, 5)
       self.conv2 = nn.Conv2d(6, 16, 5)
       self.fc1 = nn.Linear(16 * 5 * 5, 120)
       self.fc2 = nn.Linear(120, 84)
       self.fc3 = nn.Linear(84, 10)

   def forward(self, x):
       x = self.conv1(x)
       x = F.max_pool2d(x, 2)
       x = F.relu(x)
       x = self.conv2(x)
       x = F.max_pool2d(x, 2)
       x = F.relu(x)
       x = torch.flatten(x, 1)
       x = self.fc1(x)
       x = F.relu(x)
       x = self.fc2(x)
       x = F.relu(x)
       x = self.fc3(x)
       return x
```

**50. Modify the above code to use nn.MaxPool2d instead of F.max_pool2d**

```python
    def __init__(self):
       super(Net, self).__init__()
       # your code here
       self.conv1 = nn.Conv2d(1, 6, 5)
       self.conv2 = nn.Conv2d(6, 16, 5)
       self.fc1 = nn.Linear(16 * 5 * 5, 120)
       self.fc2 = nn.Linear(120, 84)
       self.fc3 = nn.Linear(84, 10)
       self.maxpool = nn.MaxPool2d(2, 2)

   def forward(self, x):
       x = self.conv1(x)
       x = self.maxpool(x)
       x = F.relu(x)
       x = self.conv2(x)
       x = self.maxpool(x)
       x = F.relu(x)
       x = torch.flatten(x, 1)
       x = self.fc1(x)
       x = F.relu(x)
       x = self.fc2(x)
       x = F.relu(x)
       x = self.fc3(x)
       return x
```

**51. Try increasing the width of your network by increasing the number of output channels of the first convolution from 6 to 12. What else do you need to change?**

```python
    def __init__(self):
       super(Net, self).__init__()
       self.conv1 = nn.Conv2d(1, 12, 5)
       self.conv2 = nn.Conv2d(12, 16, 5) # we also have to change the input channels here
       self.fc1 = nn.Linear(16 * 5 * 5, 120)
       self.fc2 = nn.Linear(120, 84)
       self.fc3 = nn.Linear(84, 10)
       self.maxpool = nn.MaxPool2d(2, 2)
```

### Classifier Training

Next, we go to the final tutorial in the Blitz: the [Cifar10 tutorial](https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html). This tutorial trains an image classifier going through the following steps in order:

- Load and normalize the CIFAR10 training and test datasets using torchvision
- Define a Convolutional Neural Network
- Define a loss function
- Train the network on the training data
- Test the network on the test data

Once you have gone through the tutorial above, answer the following questions:

**52. The following dataset loading code runs but are there mistakes in the following code? What are the implications of the errors? What are the fixes?**

```python
import torch
from torchvision import datasets, transforms

transform = transforms.Compose(
  [transforms.ToTensor(),
   transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))])

batch_size = 4

trainset = datasets.CIFAR10(root='./data', train=False,
                                      download=True, transform=transform)
trainloader = torch.utils.data.DataLoader(trainset, batch_size=batch_size,
                                        shuffle=False, num_workers=2)

testset = datasets.CIFAR10(root='./data', train=True,
                                     download=True, transform=transform)
testloader = torch.utils.data.DataLoader(testset, batch_size=batch_size,
                                       shuffle=False, num_workers=2)
```

There are two mistakes. First, we're not shuffling the train data loader. Second, we're loading up the CIFAR train data in the testset, and the CIFAR test set in the train set.

**53. Write 2 lines of code to get random training images from the dataloader (assuming errors above are fixed).**

```python
dataiter = iter(trainloader)
images, labels = next(dataiter)
```

**54. The following training code runs but are there mistakes in the following code (mistakes include computational inefficiencies)? What are the implications of the errors? What are the fixes?**

```python
    running_loss = 0.0
   for i, data in enumerate(trainloader, 0):
       # get the inputs; data is a list of [inputs, labels]
       inputs, labels = data

       # forward + backward + optimize
       outputs = net(inputs)
       loss = criterion(outputs, labels)
       loss.backward()
       optimizer.step()

       # print statistics
       running_loss += loss
       if i % 2000 == 1999:    # print every 2000 mini-batches
           print(f'[{epoch + 1}, {i + 1:5d}] loss: {running_loss / 2000:.3f}')
           running_loss = 0.0
           break
```

There are two mistakes. First, there should be an `optimizer.zero_grad()` in the loop. Without this, the gradients will accumulate. Second, running_loss should be incremented using `loss.item()`; otherwise, each loss will still be part of the computational graph; this takes up memory, as the individual losses would have otherwise been garbage-collected.

**55. The following evaluation code runs but are there mistakes in the following code (mistakes include computational inefficiencies)? What are the implications of the errors? What are the fixes?**

```python
correct = 0
total = 0
# since we're not training, we don't need to calculate the gradients for our outputs
for data in testloader:
   images, labels = data
   # calculate outputs by running images through the network
   outputs = net(images)
   # the class with the highest energy is what we choose as prediction
   _, predicted = torch.max(outputs.data, 1)
   total += labels.size(0)
   correct += (predicted == labels).sum()

print(f'Accuracy of the network on the 10000 test images: {100 * correct // total} %')
```

There are two mistakes. First, there should be a `torch.no_grad()` encapsulating the loop; this will deactivate the autograd engine, reducing memory usage and speed up computations but you won't be able to backprop (which you don't want in an eval script). Second, once again, we're missing the `.item()` call after the sum(), which would mean that we would have the tensor(s) be part of the computational graph, eating memory.

## Cheatsheet

It may take you some time to feel comfortable with PyTorch, and that's okay! PyTorch is a powerful tool for deep learning development. After the above exercises, you can go through the [Quickstart tutorial here](https://pytorch.org/tutorials/beginner/basics/quickstart_tutorial.html), which will cover more aspects including Save & Load Model, and Datasets and Dataloaders. As you learn the API, you may find it useful to remember key usage patterns; a [PyTorch cheatsheet I like is found here](https://pytorch.org/tutorials/beginner/ptcheat.html).

And that covers our fundamentals of PyTorch! Congratulations – you're now equipped to start tackling more complex deep learning code that leverages PyTorch.
