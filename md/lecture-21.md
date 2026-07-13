---
course: Harvard CS197
term: Fall 2022
lecture: "21"
title: Model Showdown
subtitle: Statistical Testing to Compare Model Performances
instructor: Pranav Rajpurkar
source_notes: https://docs.google.com/document/d/1JkME4O_DOmPhvepwG07aVxeVOCOtMNTyd_KXN4rIcms/edit
course_site: https://cs197.seas.harvard.edu/
tags: [statistical-testing, model-evaluation, mcnemars-test, bootstrap, confidence-intervals]
learning_outcomes:
  - Understand the different statistical tests that can be used to compare machine learning models, including McNemar's test, the paired t-test, and the bootstrap method.
  - Be able to implement these statistical tests in Python to evaluate the performance of two models on the same test set.
  - Be able to select an appropriate test for a given research question, including tests for statistical superiority, non-inferiority, and equivalence.
provenance: Prose is the author's original lecture notes, transcribed. Blocks marked "Added explanation" were written for this reader and are not the author's words.
---

_An earlier version of these notes was created by Xiaoli Yang and Elaine Liu._

## Abstract

This lecture will cover statistical testing in the context of comparing the performance of two machine learning models on the same test set. We will begin by discussing McNemar's test, which is a statistical test specifically designed for comparing the performance of two models on dichotomous outcomes. We will then move on to the paired t-test, which is a parametric test that can be used to compare the performance of two models on continuous outcomes. Next, we will discuss the bootstrap method, which is a non-parametric method that can be used to estimate the distribution of the performance difference between two models. We will provide coding examples to illustrate how to implement these tests in Python. We will then discuss how to select an appropriate test for your data and research question, including tests for statistical superiority, non-inferiority, and equivalence. Finally, we will cover confidence intervals, which provide a measure of precision or uncertainty for statistical estimates and can be used to interpret the results of statistical tests.

> **Notes — StableDiffusion 2.1 Generation**
> "Making a pot in style of cubism"

### Learning outcomes

1. Understand the different statistical tests that can be used to compare machine learning models, including McNemar's test, the paired t-test, and the bootstrap method.
2. Be able to implement these statistical tests in Python to evaluate the performance of two models on the same test set.
3. Be able to select an appropriate test for a given research question, including tests for statistical superiority, non-inferiority, and equivalence.

## Statistical Testing

Suppose we have developed two machine learning models for diagnosing a particular disease. We want to know whether the models have different performances. Statistical testing can help us determine whether the difference between the models is significant or whether it could have occurred by chance.

Statistical testing can help us make more informed decisions about which model to use. If the difference in performance between the models is statistically significant and the model with the better performance is also more robust and generalizable, it might be the better choice for the problem at hand. On the other hand, if the difference in performance is not statistically significant, it might be more appropriate to use the model with the simpler structure or lower risk of overfitting.

So how do we do statistical testing? In statistical testing, we first form a hypothesis, known as the null hypothesis, which is a statement that there is no difference in the performance of the models or that the observed difference between the models is due to chance. If we're interested in a statistical difference, the null hypothesis might be that there is no difference in the accuracy of the two models for diagnosing disease.

We then collect a sample of data and use it to evaluate the performance of both models. Based on the results, we can use statistical techniques to evaluate the evidence provided by the data and determine whether the difference in performance between the models is statistically significant. If the evidence is strong enough to reject the null hypothesis, we conclude that there is a real difference in the performance of the models and that one of the models is more accurate at making the predictions. If the evidence is not strong enough to reject the null hypothesis, we conclude that there is no significant difference in the performance of the models and we cannot be confident that one model performs differently than the other.

Let's formalize this.

Suppose we have two machine learning models, A and B, that are being compared on a binary disease classification task. Let's denote the accuracy of model A on the task as pA and the accuracy of model B on the task as pB. We want to determine whether there is a significant difference in the accuracy of the two models.

Our statistical test will be based on the following hypothesis test:

```
H0: pA - pB = 0 (null hypothesis)
H1: pA - pB ≠ 0 (alternative hypothesis)
```

Here, H0 is the null hypothesis, which states that there is no difference in the accuracy of the two models. H1 is the alternative hypothesis, which states that there is a difference in the accuracy of the two models.

So how do we evaluate this statistical test?

There are many different statistical tests that can be used, depending on the type of data being collected and the research question being asked. We'll go through McNemar's test, the paired t-test, and then the bootstrap.

## McNemar's Test

We're first going to look at McNemar's test. This test is used to compare the performance of two binary classification models on the same dataset. It is based on a contingency table that compares the number of correct and incorrect predictions made by each model.

|                              | Model 1 Prediction: Correct | Model 1 Prediction: Incorrect |
| ---------------------------- | --------------------------- | ----------------------------- |
| **Model 2 Prediction: Correct**   | 30 | 10 |
| **Model 2 Prediction: Incorrect** | 5  | 15 |

In this table, the rows represent the predictions made by model 2 and the columns represent the predictions made by model 1. The left column represents the number of cases where model 1 correctly predicts the outcome and the right column represents the number of cases where model 1 incorrectly predicts the outcome. The top row represents the number of cases where model 2 correctly predicts the outcome and the bottom row represents the number of cases where model 2 incorrectly predicts the outcome.

The chi-square statistic is used in McNemar's test to evaluate the difference in accuracy between two binary classification models. The chi-square distribution is a continuous probability distribution that is commonly used in statistical tests to evaluate the goodness of fit of an observed distribution to an expected distribution. In McNemar's test, the chi-square statistic is calculated using the following formula:

```
χ^2 = (B - C)^2 / (B + C)
```

Here, B is the number of cases where model 1 correctly predicts the outcome and model 2 incorrectly predicts the outcome, and C is the number of cases where model 2 correctly predicts the outcome and model 1 incorrectly predicts the outcome.

Visually, this looks like:

|                              | Model 1 Prediction: Correct | Model 1 Prediction: Incorrect |
| ---------------------------- | --------------------------- | ----------------------------- |
| **Model 2 Prediction: Correct**   | – | C |
| **Model 2 Prediction: Incorrect** | B | – |

In our example, B = 5, and C = 10, so χ^2 = (B - C)^2 / (B + C) = 25 / 15 = 1.67.

How do we make sense of this chi-squared statistic? Enter p-values.

### p-value

The p-value is used to determine whether the difference in accuracy between the two models is statistically significant.

Formally, the p-value is a measure of the probability of obtaining the observed data or a more extreme result under the null hypothesis. If the p-value is small (usually less than 0.05), it means that the observed data are unlikely to have occurred by chance and the null hypothesis can be rejected. In our example, it means that the difference in performance between the models is unlikely to have occurred by chance and we can conclude that one of the models is better at diagnosing the disease. On the other hand, if the p-value is large, it means that the observed data are likely due to random variation and the null hypothesis cannot be rejected. In our example, it means that the difference in performance is likely due to random variation and we cannot be confident that one model is better than the other.

To calculate the p-value from the chi-square statistic in McNemar's test, we need to know the chi-square statistic and the degrees of freedom as input. The degrees of freedom in a statistical test is a measure of the number of independent observations or variables in the data. In McNemar's test, there are only two models being compared, so there is only one degree of freedom. The degrees of freedom determine the shape of the distribution.

The p-value is calculated by finding the area under the curve that is greater than or equal to the chi-square statistic, which allows us to determine the likelihood of the observed data occurring under the null hypothesis.

We can do this in code by using the chi2.cdf function, which calculates this area and subtracts it from 1 to give the p-value.

```python
from scipy.stats import chi2

# Calculate p-value
p_value = 1 - chi2.cdf(chi_square_statistic, degrees_of_freedom = 1)
```

### Limitations of McNemar's Test

There are several situations in which McNemar's test does not work.

One situation in which McNemar's test does not work is when the two models are being evaluated on different datasets. This is because McNemar's test compares the number of cases where the two models agree and disagree on the classification of a particular example. If the models are being evaluated on different datasets, it is not meaningful to compare the number of cases where they agree or disagree, since the examples in the two datasets may not be the same.

Another situation in which McNemar's test does not work is when the two models have very different accuracies and there are a large number of cases where they agree. In these cases, McNemar's test is not as powerful as the t-test at detecting a significant difference in accuracy between the two models.

Finally, McNemar's test is a statistical test that is commonly used to compare the performance of two binary classification models on metrics like accuracy. It is not typically used to compare other types of statistical measures. An example might be the BLEU score, which is a metric used to evaluate the quality of machine translation.

A better situation in all of these situations might be a statistical test like the paired-t test.

## Paired T-Test

The paired t-test is a statistical test that is commonly used to compare the means of two related samples and determine whether they are significantly different.

Okay, but, what does it mean to have 'related samples'?

In the context of comparing machine learning models, two samples are considered related if they are evaluated on the same test set or on datasets that are related in some way.

For example, suppose you have trained two different machine learning models on a dataset and want to determine whether one model is significantly more accurate than the other. You can use the paired t-test to compare the accuracy of the two models on the same test set and determine whether the difference in accuracy is statistically significant. In this case, the two samples are the accuracy of the two models on the test set, and they are related because they are both evaluated on the same test set.

Alternatively, you may want to compare the performance of two models on different datasets that are related in some way. For example, you could compare the accuracy of two models on parallel datasets, where each dataset contains translations of the same set of sentences in different languages. In this case, the two samples are the accuracy of the two models on the different datasets, and they are related because they are both evaluated on translations of the same set of sentences.

Overall, when comparing machine learning models, two samples are considered related if they are evaluated on the same test set or on datasets that are related in some way. The paired t-test is a powerful tool for comparing the performance of two models on related samples, such as the accuracy of two models on the same test set or the BLEU scores of two machine translation systems on parallel datasets.

One reason the paired t-test is used is that it can be applied to a wide range of statistical measures, not just accuracy. This makes it a flexible and widely applicable statistical test that is more powerful than McNemar's test in certain situations.

Suppose we have two machine translation systems, A and B, that we want to compare on a dataset of 100 sentences. We evaluate both systems and record the number of errors each system makes on each sentence. Here is a sample of the data:

| Sentence | Errors (System A) | Errors (System B) | Difference |
| -------- | ----------------- | ----------------- | ---------- |
| 1        | 5   | 3   | 2   |
| 2        | 4   | 2   | 2   |
| 3        | 6   | 5   | 1   |
| ...      | ... | ... | ... |
| 100      | 3   | 2   | 1   |

To perform the paired t-test:

1. Collect the data from both samples. In this case, we have already done that and recorded the number of errors for each system on each sentence.
2. Calculate the difference between the pairs of samples. For each sentence, we subtract the number of errors for System A from the number of errors for System B. These differences are shown in the "Difference" column in the table above.
3. Calculate the mean and standard deviation of the differences. The mean of the differences is 1.9 and the standard deviation is 1.3.
4. Calculate the t-statistic. The t-statistic is calculated as follows:

```
t = (mean of differences) / (standard deviation of differences / √n)
```

Plugging in the values from our sample data, we get:

```
t = 1.9 / (1.3 / √100) = 1.9 / (1.3 / 10) = 1.9 / 0.13 = 14.6
```

5. Calculate the degrees of freedom. The degree of freedom is a measure of the amount of freedom or flexibility in the data. It is calculated as follows:

```
degrees of freedom = n - 1, where n is the number of pairs of samples.
```

In our example, we have 100 pairs of samples (one pair for each sentence), so n is 100. Therefore, the degrees of freedom is calculated as follows:

```
degrees of freedom = 100 - 1 = 99
```

6. Look up the t-statistic in a t-distribution table or use a computer program to find the p-value. As we've seen before, the p-value is a measure of the probability that the difference between the means of the two samples is due to chance. A low p-value (usually less than 0.05) indicates that the difference is statistically significant and is not likely to have occurred by chance.

Using a t-distribution table or computer program, we find that the p-value for a t-statistic of 14.6 with 99 degrees of freedom is very small (less than 0.0001).

7. Interpret the results. Since the p-value is less than 0.05, we can conclude that there is a statistically significant difference between the means of the two samples (in this case, the error rates of the two machine translation systems). This suggests that one system is performing significantly better than the other on this dataset.

### Python Implementation

To calculate the p-value in Python using the scipy library, you can use the ttest_rel function from the scipy.stats module. This function calculates the t-statistic and p-value for a paired t-test.

Here is an example of how to use the ttest_rel function in Python to calculate the p-value for a paired t-test:

```python
from scipy.stats import ttest_rel

# Sample data
errors_a = [5, 4, 6, 3, 2, 4, 5, 3, 2, 5]
errors_b = [3, 2, 5, 2, 1, 3, 4, 2, 1, 4]

# Calculate t-statistic and p-value
t, p = ttest_rel(errors_a, errors_b)

# Print p-value
print(p)
```

This code will calculate the t-statistic and p-value for the paired t-test and print the p-value to the console.

### Limitations of Paired t-test

There are several disadvantages of the paired t-test that may make it an inappropriate statistical test to use in certain situations.

One disadvantage of the paired t-test is that it assumes that the data is normally distributed. If the data is not normally distributed, the results of the t-test may not be reliable. Data that is not normally distributed may be skewed or have outliers. Skewed data is data that is not symmetrical, with a longer tail in one direction than the other. Outliers are extreme values that are significantly larger or smaller than the majority of the data. You can identify whether data is normally distributed or not by plotting the data using a histogram or a probability plot and looking for symmetry and a straight line.

Another disadvantage of the paired t-test is that it requires that you have pairs of samples that can be compared directly. However, in some cases, it may not be possible to calculate the metric of interest for each individual sample. For example, the AUC is a metric that is calculated over the entire dataset rather than for individual samples, so it is not possible to use the paired t-test to compare the AUC of two models.

In situations where the assumptions of the paired t-test are not met, such as when the data is not normally distributed or when the metric of interest cannot be calculated for individual samples, other statistical methods, such as the bootstrap method, may be more appropriate.

## Bootstrapping

The bootstrap method is a statistical technique that involves generating multiple resamples, or new samples, from the original sample data with replacement. The resamples are generated in order to estimate the sampling distribution of a statistic of interest, such as the mean or median, and make inferences about the population from which the original sample was drawn.

To generate the resamples, the bootstrap method randomly selects observations from the original sample with replacement, meaning that an observation can be selected multiple times in a single resample. The statistic of interest is then calculated for each resample, and the distribution of the calculated statistic across the resamples is used to estimate the sampling distribution of the statistic in the original sample. This can be used to make inferences about the population, such as estimating the confidence intervals or p-values for the statistic.

The bootstrap method is a useful tool because it is flexible and can be applied in situations where the assumptions of other statistical tests are not met. It is particularly useful when the data is not normally distributed or the sample size is small.

Let's illustrate using an example of how the bootstrap method can be applied to compare the performance of two machine learning models on the same test set.

Suppose we have a test set with 100 examples, and we want to compare two models using the AUC as the metric. We can calculate the AUC for each model using the entire test set and also record their difference. Next, we can create a new test set by sampling with replacement from the original test set. This could involve randomly selecting indices from the test set, such as [3, 45, 67, 3, 23, 45, ...] (there will be 100 such indices because that's the size of our test set), and using the corresponding observations as the new test set. We can repeat this process a large number of times (e.g. 1000).

If you are interested in determining whether there is a difference in performance between the two models, you can calculate the p-value as the proportion of differences in AUC that are greater than or equal to the observed difference in AUC on the original test set. This gives you a measure of how likely it is to observe a difference at least as large as the one observed on the original test set, given that the null hypothesis is true. The directionality of the difference (i.e. whether one model is performing better than the other) is not considered in this case, because the focus is simply on whether there is a difference in performance between the two models, regardless of the direction of the difference.

### Implementation

Here is an example of how you can implement code for the bootstrap method to compare the performance of two machine learning models on the same test set using the area under the curve (AUC) as the metric in Python:

https://gist.github.com/rajpurkar/f96c131ba3aeffb1927255d4363496a9

## Selecting the appropriate statistical test

It is important to clarify the research question and the desired outcome before selecting the appropriate statistical test when comparing the performance of two machine learning models on the same test set.

We looked at a test for statistical difference:

- Null hypothesis (H0): There is no difference in the performance of the two models.
- Alternative hypothesis (H1): There is a difference in the performance of the two models.

### Statistical Superiority

We can instead look at a test for statistical superiority. Tests for statistical superiority are used to determine whether one machine learning model is significantly better than another model in terms of performance. For example, if you are interested in determining whether one model has a significantly higher area under the curve (AUC) than another model on the test set, you can use a test for statistical superiority to determine whether the difference in AUC between the two models is statistically significant.

This test for statistical difference is similar to tests for statistical superiority, in that it is used to determine whether there is a difference in the performance of the two models. However, unlike tests for statistical superiority, the test for statistical difference does not consider the direction of the difference (i.e. whether one model is better or worse than the other). Instead, it simply tests whether there is any difference in performance between the two models.

Tests for statistical superiority:

- Null hypothesis (H0): There is no difference in the performance of the two models.
- Alternative hypothesis (H1): One model is significantly better than the other model in terms of performance.

To perform a test for statistical superiority using the bootstrap method, you can follow a similar process as the one above with one modification. Specifically, you will want to calculate the p-value as the proportion of differences that are greater than zero, rather than the proportion of differences that are greater than the observed difference.

### Non-inferiority

Tests for non-inferiority are used to determine whether one machine learning model is not significantly worse than another model in terms of performance. For example, if you are interested in determining whether one model has a significantly lower AUC than another model on the test set, you can use a test for non-inferiority to determine whether the difference in AUC between the two models is not statistically significant.

Tests for non-inferiority:

- Null hypothesis (H0): One model is significantly worse than the other model in terms of performance.
- Alternative hypothesis (H1): One model is not significantly worse than the other model in terms of performance.

To perform a test for statistical non-inferiority using the bootstrap method, you can follow a similar process as the one outlined in the previous answer, with a few minor modifications. Specifically, you will want to calculate the p-value as the proportion of differences that are greater than or equal to the non-inferiority margin, rather than the proportion of differences that are greater than zero.

When comparing machine learning models, the non-inferiority margin can be used to establish the maximum acceptable difference in performance between the two models. For example, if you are interested in determining whether a new machine learning model is not significantly worse than the current model in terms of performance, you can use a non-inferiority margin to establish the maximum acceptable difference in performance between the two models.

In this context, the non-inferiority margin may be based on the minimum difference in performance that would justify switching to the new model, as well as any other relevant considerations. For example, if the performance of the new model is slightly worse than the current model, but the new model is significantly faster or requires significantly less training data, it may still be justified to switch to the new model. In this case, the non-inferiority margin would take these additional considerations into account.

It is important to carefully consider the non-inferiority margin when comparing machine learning models, as it can significantly impact the results and interpretation of the comparison. A narrow non-inferiority margin may make it more difficult to demonstrate non-inferiority, but may also be more relevant and meaningful from a practical perspective. On the other hand, a wider non-inferiority margin may be easier to demonstrate non-inferiority, but may be less relevant and meaningful from a practical perspective.

### Equivalence

Tests for equivalence are used to determine whether two machine learning models are equivalent in terms of performance. For example, if you are interested in determining whether two models have similar AUCs on the test set, you can use a test for equivalence to determine whether the difference in AUC between the two models is not statistically significant.

Tests for equivalence:

- Null hypothesis (H0): The two models are not equivalent in terms of performance.
- Alternative hypothesis (H1): The two models are equivalent in terms of performance.

To perform a test for statistical equivalence using the bootstrap method, you can follow a similar process as the one outlined in the previous answer, with a few minor modifications. Specifically, you will want to calculate the p-value as the proportion of differences that fall within the predetermined equivalence margin, rather than the proportion of differences that are greater than zero or the proportion of differences that are greater than or equal to the non-inferiority margin.

The equivalence margin like the non-inferiority margin should be based on clinical, scientific, and statistical considerations, as well as input from relevant experts and stakeholders. A narrow equivalence margin may make it more difficult to demonstrate equivalence, but may also be more relevant and meaningful from a practical perspective. On the other hand, a wider equivalence margin may be easier to demonstrate equivalence, but may be less relevant and meaningful from a practical perspective.

> **Notes — At-home exercises**
>
> **At-home exercise 1:** Suppose you're choosing between two report-generation models and want to compare their performances using BLEU scores. You ran both models on some examples and sometimes Model 1 outperforms Model 2 and sometimes Model 2 outperforms Model 1. How can you choose the better model in this case?
>
> **At-home exercise 2:** Suppose you have developed a ML model on CheXPert and achieved an AUC of 0.96. Compared to 0.93 SOTA performance, you believe you have made significant improvements using your model on this benchmark and you want to publish your results to make your contribution formal. How do you show that your results are unlikely to have arisen due to random chance? That is, is it possible that your model only achieves 0.92-0.93 most of the time and you are only lucky this time on this particular test trial to get a 0.96?
>
> **At-home exercise 3:** Suppose that you are working on another ML method that aims to assist pathologists in diagnosing lymphoma subtypes from looking at tissue images. Your model achieved a diagnostic accuracy of 70%, which is pretty close to pathologists' diagnostic performance of 68%. You want to check if your model performs better, or at least, not worse than pathologists in general. How could you do that?

## Confidence intervals

Confidence intervals are a statistical tool that provide a range of values that are likely to contain the true population parameter. This range is based on the sample data used to train the model, and it can help us to better understand the variability of the model's performance. By reporting the confidence interval of a model's performance, we can gain insight into how reliable the model is and how much uncertainty is associated with its predictions. This can help us to make more informed decisions about the model's use and to better understand its accuracy. The 95 percent confidence interval is a commonly used measure of statistical accuracy. This is a widely accepted standard for reporting confidence intervals, as it provides a good balance between accuracy and precision.

Confidence intervals and p-values are related in that they both provide information about the uncertainty associated with a model's performance. A confidence interval provides a range of values that are likely to contain the true population parameter, while a p-value is a measure of the probability that the observed results are due to chance. Both of these measures can be used to assess the reliability of a model's performance and to make more informed decisions about its use.

If we want to determine whether a model has a better than random AUC, we can use the confidence interval to compare the model's AUC to the AUC of a random model (which will be 0.5). If the confidence interval of the model's AUC does not overlap with the AUC of a random model, then we can conclude that the model has a better than random AUC.

If we are looking at two models, if their confidence intervals do not overlap, it means that the difference between the two groups being compared is statistically significant. This means that the difference between the two groups is unlikely to be due to chance and is likely to be a real effect.

When the confidence intervals overlap, it means that the true population parameters are likely to be within the range of the overlapping intervals. This indicates that there is not enough evidence to conclude that the population parameters are significantly different from each other.

However, what this doesn't take into account is that we're running these two models on the same test set. If we're looking at the pairing of data — the predictions made on the same set of data points made by both models — we should have more power, or more ability to detect differences.

Confidence intervals can also be computed for paired data, which refers to data that has been collected in matched pairs or pairs of related observations. In the context of comparing the performance of two machine learning models on the same test set, paired data in this context refers to data that has been collected for the same samples or observations using both models.

To compute confidence intervals for paired data in this context, we can use the same methods as for independent data, such as the bootstrap method, the t-distribution method, or the normal distribution method. Because we have seen the bootstrap method before, here is an example of how you can compute confidence intervals for paired data in the context of comparing two machine learning models on the same test set.

```python
import numpy as np

# Number of bootstrap resamples
n_resamples = 1000

# Calculate the performance metric for each model using the entire test set
model_1_performance = calculate_performance(model_1, test_set)
model_2_performance = calculate_performance(model_2, test_set)

# Observed difference in performance on the original test set
observed_difference = model_1_performance - model_2_performance

# Initialize an array to store the differences in performance for each bootstrapped sample
differences = np.empty(n_resamples)

# Create a new test set by sampling with replacement from the original test set
for i in range(n_resamples):
   new_test_set = sample_with_replacement(test_set, replace=True)
   model_1_performance = calculate_performance(model_1, new_test_set)
   model_2_performance = calculate_performance(model_2, new_test_set)
   differences[i] = model_1_performance - model_2_performance

# Calculate the confidence interval for the difference in performance
confidence_interval = np.percentile(differences, [2.5, 97.5])

print(f"95% confidence interval for the difference in performance: {confidence_interval}")
```

The 2.5 and 97.5 percentiles are used to compute confidence intervals because they correspond to the lower and upper bounds of a 95% confidence interval.

To report the performance of two models using the observed difference and confidence interval, you can use a statement similar to the following:

> "The observed difference in AUC between the two models was 0.05, with a 95% confidence interval of 0.03 to 0.07. This suggests that there is a statistically significant difference in AUC between the two models."

In this case, the observed difference in AUC between the two models is 0.05, and the 95% confidence interval for the difference in AUC is from 0.03 to 0.07. This suggests that the difference in AUC between the two models is statistically significant, as the confidence interval does not include zero (which would indicate no difference in AUC).

Overall, reporting the performance of two models using the observed difference and confidence interval can provide valuable insights into the precision and uncertainty of the difference in performance, and can help you to make informed decisions about which model to use based on the data.
