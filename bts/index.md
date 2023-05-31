---
title: "Behind the Scenes: Density Fields for Single View Reconstruction"
---

<center>
<h1 style="display: block;">Behind the Scenes: Density Fields for Single View Reconstruction</h1>
CVPR 2023 <br>
<table style="border: none; display: initial;">
<tr style="border: none;">
<td style="border: none;"><a href="https://vision.in.tum.de/members/wimbauer">Felix Wimbauer</a><sup>1,2</sup></td>
<td style="border: none;"><a href="https://nan-yang.me/">Nan Yang</a><sup>1</sup></td>
<td style="border: none;"><a href="https://chrirupp.github.io/">Christian Rupprecht</a><sup>3</sup></td>
<td style="border: none;"><a href="https://vision.in.tum.de/members/cremers">Daniel Cremers</a><sup>1,2,3</sup></td>
</tr>
</table>
<br>
<table style="border: none; display: initial;">
<tr style="border: none;">
<td style="border: none;"><sup>1</sup>Technical University of Munich</td>
<td style="border: none;"><sup>2</sup>MCML</td>
<td style="border: none;"><sup>3</sup>University of Oxford</td>
</tr>
</table>
<br>
<table style="border: none; display: initial;">
<tr style="border: none;">
<td style="border: none;">
<a href="https://arxiv.org/abs/2301.07668" style="color: #ffffff">
<div class="link_button">
<i class="bi bi-file-earmark-richtext"></i> Paper
</div>
</a>
</td>
<td style="border: none; display: initial;">
<a href="https://github.com/Brummi/BehindTheScenes" style="color: #ffffff">
<div class="link_button">
<i class="bi bi-github"></i> Code
</div>
</a>
</td>
<td style="border: none;">
<a href="https://youtu.be/0VGKPmomrR8" style="color: #ffffff">
<div class="link_button">
<i class="bi bi-youtube"></i> Video
</div>
</a>
</td>
</tr>
</table>
<br>
 <video width="100%" autoplay muted loop>
  <source src="./assets/header_vid.mp4" type="video/mp4">
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

![Top-Down Results](./assets/profile.png)
**Top-down visualization of the occupancy map predicted by different methods.** 
We show an area of x = [−15m, 15m], z = [5m, 30m] and aggregate density from the y-coordinate of the camera 1m downward. 
Depth prediction methods such as MonoDepth2 do not predict a full 3D volume. 
Thus, objects cast "occupancy shadows" behind them. 
Our method predicts the full occupancy volume and can thus reason about the space behind objects. 
Training with more views improves occupancy estimation.
Inference is from a single image. 
Legend: n T(): n timesteps of, L: left camera, R: right camera, F: left and right fisheye camera.

<video width="100%" controls autoplay muted loop>
<source src="./assets/occupancy_video_small.mp4" type="video/mp4">
Your browser does not support the video tag.
</video> 

**Top-down visualization and expected ray termination depth for entire sequence.** 
We use similar parameters as mentioned above. The shown sequence is ``2013_05_28_drive_0000``.

<video width="100%" controls autoplay muted loop>
<source src="./assets/transition.mp4" type="video/mp4">
Your browser does not support the video tag.
</video> 

**Smooth transition from expected ray termination depth to novel view synthesis to birds-eye occupancy.** 
We use similar parameters as mentioned above. The shown sequence is ``2013_05_28_drive_0002``.

<style type="text/css">
.tg  {display: initial}
.tg td{}
.tg th{}
.tg .tg-1wig{font-weight:bold;text-align:left;vertical-align:top}
.tg .tg-baqh{text-align:center;vertical-align:top}
.tg .tg-6t3r{font-style:italic;font-weight:bold;text-align:left;vertical-align:top}
.tg .tg-amwm{font-weight:bold;text-align:center;vertical-align:top}
.tg .tg-0lax{text-align:left;vertical-align:top}
.tg .tg-if35{text-align:center;text-decoration:underline;vertical-align:top}
</style>
<center>
<table class="tg"  style="display: initial">
<thead>
  <tr>
    <th class="tg-6t3r">Model</th>
    <th class="tg-amwm">O<sub>acc</sub></th>
    <th class="tg-amwm">IE<sub>acc</sub></th>
    <th class="tg-amwm">IE<sub>rec</sub></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0lax">Depth</td>
    <td class="tg-amwm">0.95</td>
    <td class="tg-baqh">n/a</td>
    <td class="tg-baqh">n/a</td>
  </tr>
  <tr>
    <td class="tg-0lax">Depth + 4m</td>
    <td class="tg-baqh">0.92</td>
    <td class="tg-baqh">0.64</td>
    <td class="tg-baqh">0.23</td>
  </tr>
  <tr>
    <td class="tg-0lax">PixelNeRF</td>
    <td class="tg-baqh">0.93</td>
    <td class="tg-baqh">0.64</td>
    <td class="tg-if35">0.41</td>
  </tr>
  <tr>
    <td class="tg-1wig"><span style="font-style:normal">Ours (No S, F)</span></td>
    <td class="tg-baqh">0.93</td>
    <td class="tg-baqh">0.69</td>
    <td class="tg-baqh">0.10</td>
  </tr>
  <tr>
    <td class="tg-1wig">Ours (No F)</td>
    <td class="tg-if35">0.94</td>
    <td class="tg-if35">0.73</td>
    <td class="tg-baqh">0.16</td>
  </tr>
  <tr>
    <td class="tg-1wig">Ours</td>
    <td class="tg-amwm">0.95</td>
    <td class="tg-amwm">0.82</td>
    <td class="tg-amwm">0.47</td>
  </tr>
</tbody>
</table>
</center>

**3D Scene Occupancy Accuracy.** 
We evaluate the capability of the model to predict occupancy behind objects in the image. 
Depth prediction naturally has no ability to predict behind occlusions, while our method improves when training with more views. 
Inference from a single image. Samples are evenly spaced in a cuboid w = [−4m, 4m], h = [−1m, 0m], d = [3m, 20m] relative to the camera. 
We use the same models as in the previous figure.

## Depth Prediction

<style type="text/css">
.tg  {display: initial}
.tg td{}
.tg th{}
.tg .tg-pb0m{text-align:center;}
.tg .tg-obg7{font-style:italic;text-align:left;}
.tg .tg-za14{text-align:left;}
.tg .tg-apkk{text-align:center;text-decoration:underline;}
.tg .tg-fll5{font-weight:bold;text-align:center;}
.tg .tg-0thz{font-weight:bold;text-align:left;}
</style>
<center>
<table class="tg" style="display: initial">
<thead>
  <tr>
    <th class="tg-obg7"><span style="font-style:italic">Model</span></th>
    <th class="tg-pb0m">Split</th>
    <th class="tg-pb0m">Abs Rel</th>
    <th class="tg-pb0m">Sq Rel</th>
    <th class="tg-pb0m">RMSE</th>
    <th class="tg-pb0m">RMSE Log</th>
    <th class="tg-pb0m">α < 1.25</th>
    <th class="tg-pb0m">α < 1.25²</th>
    <th class="tg-pb0m">α < 1.25³</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-za14">PixelNeRF</td>
    <td class="tg-pb0m">Eigen</td>
    <td class="tg-pb0m">0.130</td>
    <td class="tg-pb0m">1.241</td>
    <td class="tg-pb0m">5.134</td>
    <td class="tg-pb0m">0.220</td>
    <td class="tg-pb0m">0.845</td>
    <td class="tg-pb0m">0.943</td>
    <td class="tg-pb0m">0.974</td>
  </tr>
  <tr>
    <td class="tg-za14">EPC++</td>
    <td class="tg-pb0m"></td>
    <td class="tg-pb0m">0.128</td>
    <td class="tg-pb0m">1.132</td>
    <td class="tg-pb0m">5.585</td>
    <td class="tg-pb0m">0.209</td>
    <td class="tg-pb0m">0.831</td>
    <td class="tg-pb0m">0.945</td>
    <td class="tg-pb0m">0.979</td>
  </tr>
  <tr>
    <td class="tg-za14">Monodepth2</td>
    <td class="tg-pb0m"></td>
    <td class="tg-pb0m">0.106</td>
    <td class="tg-pb0m">0.818</td>
    <td class="tg-pb0m">4.750</td>
    <td class="tg-pb0m">0.196</td>
    <td class="tg-pb0m">0.874</td>
    <td class="tg-pb0m">0.957</td>
    <td class="tg-pb0m">0.975</td>
  </tr>
  <tr>
    <td class="tg-za14">PackNet (no stereo)</td>
    <td class="tg-pb0m"></td>
    <td class="tg-pb0m">0.111</td>
    <td class="tg-pb0m">0.785</td>
    <td class="tg-pb0m">4.601</td>
    <td class="tg-apkk">0.189</td>
    <td class="tg-pb0m">0.878</td>
    <td class="tg-pb0m">0.960</td>
    <td class="tg-pb0m">0.982</td>
  </tr>
  <tr>
    <td class="tg-za14">DepthHint</td>
    <td class="tg-pb0m"></td>
    <td class="tg-pb0m">0.105</td>
    <td class="tg-pb0m">0.769</td>
    <td class="tg-pb0m">4.627</td>
    <td class="tg-pb0m">0.189</td>
    <td class="tg-pb0m">0.875</td>
    <td class="tg-pb0m">0.959</td>
    <td class="tg-pb0m">0.982</td>
  </tr>
  <tr>
    <td class="tg-za14">FeatDepth</td>
    <td class="tg-fll5"></td>
    <td class="tg-apkk">0.099</td>
    <td class="tg-apkk">0.697</td>
    <td class="tg-pb0m">4.427</td>
    <td class="tg-apkk">0.184</td>
    <td class="tg-apkk">0.889</td>
    <td class="tg-apkk">0.963</td>
    <td class="tg-apkk">0.982</td>
  </tr>
  <tr>
    <td class="tg-za14">DevNet</td>
    <td class="tg-apkk"></td>
    <td class="tg-fll5">0.095</td>
    <td class="tg-fll5">0.671</td>
    <td class="tg-fll5">4.365</td>
    <td class="tg-fll5">0.174</td>
    <td class="tg-fll5">0.895</td>
    <td class="tg-fll5">0.970</td>
    <td class="tg-fll5">0.988</td>
  </tr>
  <tr>
    <td class="tg-0thz">Ours</td>
    <td class="tg-pb0m"></td>
    <td class="tg-pb0m">0.102</td>
    <td class="tg-pb0m">0.751</td>
    <td class="tg-apkk">4.407</td>
    <td class="tg-pb0m">0.188</td>
    <td class="tg-pb0m">0.882</td>
    <td class="tg-pb0m">0.961</td>
    <td class="tg-apkk">0.982</td>
  </tr>
  <tr style="height: 5px;"></tr>
  <tr>
    <td class="tg-za14">MINE</td>
    <td class="tg-pb0m">Tulsiani</td>
    <td class="tg-pb0m">0.137</td>
    <td class="tg-pb0m">1.993</td>
    <td class="tg-pb0m">6.592</td>
    <td class="tg-pb0m">0.250</td>
    <td class="tg-pb0m">0.839</td>
    <td class="tg-pb0m">0.940</td>
    <td class="tg-pb0m">0.971</td>
  </tr>
  <tr>
    <td class="tg-0thz">Ours</td>
    <td class="tg-pb0m"></td>
    <td class="tg-fll5">0.132</td>
    <td class="tg-fll5">1.936</td>
    <td class="tg-fll5">6.104</td>
    <td class="tg-fll5">0.235</td>
    <td class="tg-fll5">0.873</td>
    <td class="tg-fll5">0.951</td>
    <td class="tg-fll5">0.974</td>
  </tr>
</tbody>
</table>
</center>

**Depth Prediction.**
While our goal is fully volumetric scene understanding, we compare to the state of the art in depth estimation trained only with reconstruction losses. 
Our approach achieves competitive performance with specialized methods while improving over the only other fully volumetric approach MINE. 
DevNet performs better, but does not show any results from the volume directly.

## Novel View Synthesis

<center>
<table style="border: none; display: initial">
<tr style="border: none;">
<td style="border: none; padding: 0px;">
<video width="100%" autoplay muted loop><source src="./assets/nvs_kitti/000039.mp4" type="video/mp4">Your browser does not support the video tag.</video>
</td>
<td style="border: none; padding: 0px;">
<video width="100%" autoplay muted loop><source src="./assets/nvs_kitti/000051.mp4" type="video/mp4">Your browser does not support the video tag.</video>
</td>
</tr>
<tr style="border: none">
<td style="border: none; padding: 0px;">
<video width="100%" autoplay muted loop><source src="./assets/nvs_kitti/000102.mp4" type="video/mp4">Your browser does not support the video tag.</video>
</td>
<td style="border: none; padding: 0px;">
<video width="100%" autoplay muted loop><source src="./assets/nvs_kitti/000196.mp4" type="video/mp4">Your browser does not support the video tag.</video>
</td>
</tr>
<tr style="border: none;">
<td style="border: none; padding: 0px;">
<video width="100%" autoplay muted loop><source src="./assets/nvs_kitti/000214.mp4" type="video/mp4">Your browser does not support the video tag.</video>
</td>
<td style="border: none; padding: 0px;">
<video width="100%" autoplay muted loop><source src="./assets/nvs_kitti/000397.mp4" type="video/mp4">Your browser does not support the video tag.</video>
</td>
</tr>
</table>
</center>

**Novel-view synthesis on KITTI.**
We only use a single input frame, from which we both predict density and sample color.
This means, that areas that are occluded in the input image do not have valid color samples.

<center>
<table style="border: none; display: initial">
<tr style="border: none;">
<td style="border: none; padding: 0px;">
<video width="100%" autoplay muted loop><source src="./assets/nvs_re10k/00.mp4" type="video/mp4">Your browser does not support the video tag.</video>
</td>
<td style="border: none; padding: 0px;">
<video width="100%" autoplay muted loop><source src="./assets/nvs_re10k/01.mp4" type="video/mp4">Your browser does not support the video tag.</video>
</td>
<td style="border: none; padding: 0px;">
<video width="100%" autoplay muted loop><source src="./assets/nvs_re10k/02.mp4" type="video/mp4">Your browser does not support the video tag.</video>
</td>
</tr>
<tr style="border: none;">
<td style="border: none; padding: 0px;">
<video width="100%" autoplay muted loop><source src="./assets/nvs_re10k/03.mp4" type="video/mp4">Your browser does not support the video tag.</video>
</td>
<td style="border: none; padding: 0px;">
<video width="100%" autoplay muted loop><source src="./assets/nvs_re10k/04.mp4" type="video/mp4">Your browser does not support the video tag.</video>
</td>
<td style="border: none; padding: 0px;">
<video width="100%" autoplay muted loop><source src="./assets/nvs_re10k/05.mp4" type="video/mp4">Your browser does not support the video tag.</video>
</td>
</tr>
</table>
</center>

**Novel-view synthesis on RealEstate10K.**
We only use a single input frame, from which we both predict density and sample color.
This means, that areas that are occluded in the input image do not have valid color samples.

# Citation

```
@article{wimbauer2023behind,
  title={Behind the Scenes: Density Fields for Single View Reconstruction},
  author={Wimbauer, Felix and Yang, Nan and Rupprecht, Christian and Cremers, Daniel},
  journal={arXiv preprint arXiv:2301.07668},
  year={2023}
}
```

# Acknowledgements

This work was supported by the ERC Advanced Grant SIMULACRON, by the Munich Center for Machine Learning and by the EPSRC Programme Grant VisualAI EP/T028572/1.
C. R. is supported by VisualAI EP/T028572/1 and ERC-UNION-CoG-101001212.