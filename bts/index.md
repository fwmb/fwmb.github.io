<style>
.header_table {border: none;}
</style>


<center>
<h1>Behind the Scenes: Density Fields for Single View Reconstruction</h1>
<table>
<tr>
<td style="border: none;"><a href="https://vision.in.tum.de/members/wimbauer">Felix Wimbauer</a><sup>1</sup></td>
<td style="border: none;"><a href="https://nan-yang.me/">Nan Yang</a><sup>1,3</sup></td>
<td style="border: none;"><a href="https://chrirupp.github.io/">Christian Rupprecht</a><sup>2</sup></td>
<td style="border: none;"><a href="https://vision.in.tum.de/members/cremers">Daniel Cremers</a><sup>1</sup></td>
</tr>
</table>
<table>
<tr>
<td style="border: none;"><sup>1</sup>Technical University of Munich</td>
<td style="border: none;"><sup>2</sup>University of Oxford</td>
<td style="border: none;"><sup>3</sup>Meta</td>
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