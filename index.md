---
title: "Felix Wimbauer"
---

# Felix Wimbauer

[LinkedIn](https://www.linkedin.com/in/felixwimbauer/)

[GitHub](https://github.com/Brummi)

[Chair Website](https://vision.in.tum.de/members/wimbauer)

## Projects

### Behind the Scenes: Density Fields for Single View Reconstruction

[Project Page](https://fwmb.github.io/bts/) | [Paper](https://arxiv.org/abs/2301.07668)

Inferring a meaningful geometric scene representation from a single image is a fundamental problem in computer vision. Approaches based on traditional depth map prediction can only reason about areas that are visible in the image. Currently, neural radiance fields (NeRFs) can capture true 3D including color but are too complex to be generated from a single image. As an alternative, we introduce a neural network that predicts an implicit density field from a single image. It maps every location in the frustum of the image to volumetric density. Our network can be trained through self-supervision from only video data. By not storing color in the implicit volume, but directly sampling color from the available views during training, our scene representation becomes significantly less complex compared to NeRFs, and we can train neural networks to predict it. Thus, we can apply volume rendering to perform both depth prediction and novel view synthesis. In our experiments, we show that our method is able to predict meaningful geometry for regions that are occluded in the input image. Additionally, we demonstrate the potential of our approach on three datasets for depth prediction and novel-view synthesis.

### De-rendering 3D Objects in the Wild (CVPR 2022)

[Project Page](https://www.robots.ox.ac.uk/~vgg/research/derender3d/) | [Paper](https://arxiv.org/abs/2201.02279) | [Code](https://github.com/Brummi/derender3d) | [Video](https://youtu.be/IV5orKpwh80)

With increasing focus on augmented and virtual reality applications (XR) comes the demand for algorithms that can lift objects from images and videos into representations that are suitable for a wide variety of related 3D tasks. Large-scale deployment of XR devices and applications means that we cannot solely rely on supervised learning, as collecting and annotating data for the unlimited variety of objects in the real world is infeasible. We present a weakly supervised method that is able to decompose a single image of an object into shape (depth and normals), material (albedo, reflectivity and shininess) and global lighting parameters. For training, the method only relies on a rough initial shape estimate of the training objects to bootstrap the learning process. This shape supervision can come for example from a pretrained depth network or - more generically - from a traditional structure-from-motion pipeline. In our experiments, we show that the method can successfully de-render 2D images into a decomposed 3D representation and generalizes to unseen object categories. Since in-the-wild evaluation is difficult due to the lack of ground truth data, we also introduce a photo-realistic synthetic test set that allows for quantitative evaluation.

### MonoRec: Semi-supervised dense reconstruction in dynamic environments from a single moving camera (CVPR 2021)

[Project Page](https://vision.in.tum.de/research/monorec) | [Paper](https://arxiv.org/abs/2011.11814) | [Code](https://github.com/Brummi/MonoRec) | [Video](https://youtu.be/XimdlXUamo0)

In this paper, we propose MonoRec, a semi-supervised monocular dense reconstruction architecture that predicts depth maps from a single moving camera in dynamic environments. MonoRec is based on a multi-view stereo setting which encodes the information of multiple consecutive images in a cost volume. To deal with dynamic objects in the scene, we introduce a MaskModule that predicts moving object masks by leveraging the photometric inconsistencies encoded in the cost volumes. Unlike other multi-view stereo methods, MonoRec is able to reconstruct both static and moving objects by leveraging the predicted masks. Furthermore, we present a novel multi-stage training scheme with a semi-supervised loss formulation that does not require LiDAR depth values. We carefully evaluate MonoRec on the KITTI dataset and show that it achieves state-of-the-art performance compared to both multi-view and single-view methods. With the model trained on KITTI, we further demonstrate that MonoRec is able to generalize well to both the Oxford RobotCar dataset and the more challenging TUM-Mono dataset recorded by a handheld camera.