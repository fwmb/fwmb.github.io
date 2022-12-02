<center>
<h1>Behind the Scenes: Density Fields for Single View Reconstruction</h1>
<table style="border: none;">
<tr style="border: none;">
<td style="border: none;"><a href="https://vision.in.tum.de/members/wimbauer">Felix Wimbauer</a><sup>1</sup></td>
<td style="border: none;"><a href="https://nan-yang.me/">Nan Yang</a><sup>1</sup></td>
<td style="border: none;"><a href="https://chrirupp.github.io/">Christian Rupprecht</a><sup>2</sup></td>
<td style="border: none;"><a href="https://vision.in.tum.de/members/cremers">Daniel Cremers</a><sup>1</sup></td>
</tr>
</table>
<table style="border: none;">
<tr style="border: none;">
<td style="border: none;"><sup>1</sup>Technical University of Munich</td>
<td style="border: none;"><sup>2</sup>University of Oxford</td>
</tr>
</table>
<table style="border: none;">
<tr style="border: none;">
<td style="border: none;">
<a href="#" style="color: #ffffff">
<div class="link_button">
<i class="bi bi-file-earmark-richtext"></i> Paper (Soon)
</div>
</a>
</td>
<td style="border: none;">
<a href="#" style="color: #ffffff">
<div class="link_button">
<i class="bi bi-github"></i> Code (Soon)
</div>
</a>
</td>
<td style="border: none;">
<a href="#" style="color: #ffffff">
<div class="link_button">
<i class="bi bi-youtube"></i> Video (Soon)
</div>
</a>
</td>
</tr>
</table>
 <video width="100%" autoplay muted loop>
  <source src="assets/header_vid.mp4" type="video/mp4">
Your browser does not support the video tag.
</video> 
</center>

# Abstract 

Inferring a meaningful geometric scene representation from a single image is a fundamental problem in computer vision. 
Approaches based on traditional depth map prediction can only reason about areas that are visible in the image. 
Currently, neural radiance fields (NeRFs) can capture true 3D including color but are too complex to be generated from a single image. 
As an alternative, we introduce a neural network that predicts an implicit density field from a single image. 
It maps every location in the frustum of the image to volumetric density. 
Our network can be trained through self-supervision from only video data. 
By not storing color in the implicit volume, but directly sampling color from the available views during training, our scene representation becomes significantly less complex compared to NeRFs, and we can train neural networks to predict it. 
Thus, we can apply volume rendering to perform both depth prediction and novel view synthesis. 
In our experiments, we show that our method is able to predict meaningful geometry for regions that are occluded in the input image. 
Additionally, we demonstrate the potential of our approach on three datasets for depth prediction and novel-view synthesis.

# Overview

![Overview Figure](./assets/architecture.png)

**a)** Our method first predicts a pixel-aligned feature map **F**, which describes a density field, from the input image **I**<sub>**I**</sub>.
For every pixel **u**', the feature f<sub>**u**'</sub> implicitly describes the density distribution along the ray from the camera origin through **u**'. 
Crucially, this distribution can model density even in occluded regions (e.g. the house). 

**b)** To render novel views, we perform volume rendering. 
For any point **x**, we project **x** into **F** and sample f<sub>**u**'</sub>. 
This feature is combined with positional encoding and fed into an MLP to obtain density σ.
We obtain the color c by projecting **x** into one of the views, in this case **I**<sub>**1**</sub>, and directly sampling the image.

# Learning True 3D

Similarly to radiance fields and self-supervised depth prediction methods, we rely on an image reconstruction loss.
During training, we have the input frame **I**<sub>**I**</sub> and several additional views N = {**I**<sub>1</sub>, **I**<sub>2</sub>, ..., **I**<sub>n</sub>}.
For every sample, we first predict **F** from **I**<sub>**I**</sub> and randomly partition all frames N̂ = {**I**<sub>**I**</sub>} ∪ N into two sets N<sub>loss</sub>, N<sub>render</sub>.
We reconstruct the frames in N<sub>loss</sub> by sampling color from N<sub>render</sub> using the camera poses and the predicted densities.
The photometric consistency between the reconstructed frames and the frames in N<sub>loss</sub> serves as the supervision signal of the density field.

<img src="./assets/loss.png" alt="Loss Overview" style="float: left; margin: 10px 20px 10px 0px;" width="40%"/>

The key difference to self-supervised depth prediction methods, is that by design depth prediction methods can only densely reconstruct the input image.
In contrast, our density field formulation allows us to reconstruct any frame from any other frame.
Consider an area of the scene, which is occluded in the input **I**<sub>**I**</sub>, but visible in two other frames **I**<sub>k</sub> , **I**<sub>1k+1</sub>, as depicted in the figure. 
During training, we aim to reconstruct this area in **I**<sub>k</sub>. 
The reconstruction based on colors sampled from **I**<sub>k+1</sub> will give a clear training signal to correctly predict the geometric structure of this area, even though it is occluded in **I**<sub>**I**</sub>. 
Note, that in order to learn geometry about occluded areas, we require at least two additional views besides the input during training, i.e. to look _behind the scenes_.

# Results

## Occupancy Estimation

![Top-Down Results](./assets/profile_2.png)
**Top-down visualization of the occupancy map predicted by different methods.** 
We show an area of x = [−15m, 15m], z = [5m, 30m] and aggregate density from the y-coordinate of the camera 1m downward. 
Depth prediction methods such as MonoDepth2 do not predict a full 3D volume. 
Thus, objects cast "occupancy shadows" behind them. 
Our method predicts the full occupancy volume and can thus reason about the space behind objects. 
Training with more views improves occupancy estimation.
Inference is from a single image. 
Legend: n T(): n timesteps of, L: left camera, R: right camera, F: left and right fisheye camera.

<video width="100%" controls autoplay muted loop>
<source src="assets/occupancy_video_small.mp4" type="video/mp4">
Your browser does not support the video tag.
</video> 

**Top-down visualization and expected ray termination depth for entire sequence.** 
We use similar parameters as mentioned above. The shown sequence is ``2011_09_26_drive_0009``.

<center>
<table>
<tr>
<th>_Method_</th>
<th>O<sub>acc</sub></th>
<th>IE<sub>acc</sub></th>
<th>IE<sub>rec</sub></th>
</tr>
<tr>
<td>Depth prediction</td>
<td>**0.93**</td>
<td>0.00</td>
<td>0.00</td>
</tr>
<tr>
<td>Ours, 3x T (L)</td>
<td>0.92</td>
<td>**0.95**</td>
<td>0.10</td>
</tr>
<tr>
<td>Ours, 3x T (L + R)</td>
<td>**0.93**</td>
<td>0.76</td>
<td>0.12</td>
</tr>
<tr>
<td>Ours, 2x T (L + R + F)</td>
<td>**0.93**</td>
<td>0.79</td>
<td>**0.38**</td>
</tr>
</table>
</center>

**3D Scene Occupancy Accuracy.** 
We evaluate the capability of the model to predict occupancy behind objects in the image. 
Depth prediction naturally has no ability to predict behind occlusions, while our method improves when training with more views. 
Inference from a single image. Samples are evenly spaced in a cuboid w = [−4m, 4m], h = [−1m, 0m], d = [3m, 20m] relative to the camera. 
We use the same models as in the previous figure.



## Novel View Synthesis

<center>
<table style="border: none;">
<tr style="border: none;">
<td style="border: none; padding: 0px;">
<video width="100%" autoplay muted loop><source src="assets/nvs_kitti/000039.mp4" type="video/mp4">Your browser does not support the video tag.</video>
</td>
<td style="border: none; padding: 0px;">
<video width="100%" autoplay muted loop><source src="assets/nvs_kitti/000051.mp4" type="video/mp4">Your browser does not support the video tag.</video>
</td>
<td style="border: none; padding: 0px;">
<video width="100%" autoplay muted loop><source src="assets/nvs_kitti/000102.mp4" type="video/mp4">Your browser does not support the video tag.</video>
</td>
</tr>
<tr style="border: none;">
<td style="border: none; padding: 0px;">
<video width="100%" autoplay muted loop><source src="assets/nvs_kitti/000196.mp4" type="video/mp4">Your browser does not support the video tag.</video>
</td>
<td style="border: none; padding: 0px;">
<video width="100%" autoplay muted loop><source src="assets/nvs_kitti/000214.mp4" type="video/mp4">Your browser does not support the video tag.</video>
</td>
<td style="border: none; padding: 0px;">
<video width="100%" autoplay muted loop><source src="assets/nvs_kitti/000397.mp4" type="video/mp4">Your browser does not support the video tag.</video>
</td>
</tr>
</table>
</center>

**Novel-view synthesis on KITTI.**
We only use a single input frame, from which we both predict density and sample color.
This means, that areas that are occluded in the input image do not have valid color samples.

**TODO** RealEstate10K