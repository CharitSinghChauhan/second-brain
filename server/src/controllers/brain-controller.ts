import type { Request, Response } from "express";
import ApiError from "../utils/apiError.js";
import { Brain } from "../models/brain-models.js";
import ApiResponse from "../utils/apiResponse.js";
import { Content } from "../models/content-model.js";
import mongoose from "mongoose";

export const generateOrGetShareableLinkController = async (
  req: Request,
  res: Response
) => {
  const userId = req.user?._id;

  if (!userId) throw new ApiError(401, "Unauthorized");

  const isBrainExist = await Brain.findOne({
    ownerId: userId,
  });

  if (isBrainExist) {
    res.status(200).json(
      new ApiResponse(
        200,
        {
          shareableLink: isBrainExist.shareableLink,
          visibility: isBrainExist.visibility,
        },
        "shareable Link"
      )
    );
    return;
  }

  const shareableLink = crypto.randomUUID();

  const newBrain = await Brain.create({
    shareableLink: shareableLink,
    ownerId: userId,
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        shareableLink: newBrain.shareableLink,
        visibility: newBrain.visibility,
      },
      "brain created successfully"
    )
  );
};

export const changeVisibilityController = async (
  req: Request,
  res: Response
) => {
  const { visibility } = req.body;
  const userId = req.user?._id;

  if (visibility !== "private" && visibility !== "public") {
    throw new ApiError(400, "Visibility must be either 'private' or 'public'");
  }

  if (!userId) throw new ApiError(401, "Unauthorized");

  const updatedBrain = await Brain.findOneAndUpdate(
    { ownerId: userId },
    { visibility: visibility },
    { new: true }
  );

  if (!updatedBrain) throw new ApiError(404, "Brain not found");

  res.status(200).json(
    new ApiResponse(
      200,
      {
        shareableLink: updatedBrain.shareableLink,
        visibility: updatedBrain.visibility,
      },
      "visibility updated successfully"
    )
  );
};

export const getAllContentFromBrain = async (req: Request, res: Response) => {
  const paramsLink = req.params.id;

  if (!paramsLink) throw new ApiError(400, "Shareable link is required");

  const shareableBrain = await Brain.findOne({
    shareableLink: paramsLink,
  });

  if (!shareableBrain) throw new ApiError(404, "Brain not found");

  if (shareableBrain.visibility === "private")
    throw new ApiError(403, "This brain is private and cannot be accessed");

  const allContent = await Content.aggregate([
    {
      $match: { userId: new mongoose.Types.ObjectId(shareableBrain.ownerId) },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $lookup: {
        from: "contenttags",
        localField: "_id",
        foreignField: "contentId",
        as: "contentTags",
      },
    },
    {
      $lookup: {
        from: "tags",
        localField: "contentTags.tagId",
        foreignField: "_id",
        as: "tags",
      },
    },
    {
      $project: {
        title: 1,
        description: 1,
        contentLink: 1,
        type: 1,
        tags: "$tags.value",
        createdAt: 1,
      },
    },
  ]).hint({ userId: 1, createdAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, allContent, "All content of brain"));
};
