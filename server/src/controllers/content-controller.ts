import type { Request, Response } from "express";
import mongoose from "mongoose";
import { createContentSchema } from "../zod/zod-type.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Content } from "../models/content-model.js";
import { ContentTags } from "../models/content-tags-model.js";
import { Tags } from "../models/tags-model.js";

export const createContentController = async (req: Request, res: Response) => {
  const zodResponse = createContentSchema.safeParse(req.body);

  if (!zodResponse.success) {
    throw new ApiError(422, zodResponse.error.message);
  }

  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized");
  }

  const { title, description, tags, type, contentLink } = zodResponse.data;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [content] = await Content.create(
      [
        {
          title: title ?? "Untitled",
          description: description ?? "",
          contentLink: contentLink ?? "#",
          type: type,
          userId: req.user._id,
        },
      ],
      { session }
    );

    if (!content) {
      throw new ApiError(500, "Failed to create content");
    }

    for (const rawTag of tags) {
      const normalizedTag = rawTag.toLowerCase().trim();

      const tagDoc = await Tags.findOneAndUpdate(
        { value: normalizedTag },
        { $setOnInsert: { value: normalizedTag } },
        { upsert: true, new: true, session }
      );

      await ContentTags.findOneAndUpdate(
        {
          contentId: content._id,
          tagId: tagDoc._id,
        },
        {},
        { upsert: true, session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    return res
      .status(201)
      .json(new ApiResponse(201, {}, "Content created successfully"));
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getAllContentController = async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) throw new ApiError(401, "Unauthorized");

  const allContent = await Content.aggregate([
    {
      $match: { userId: new mongoose.Types.ObjectId(userId) },
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

  res.status(200).json(new ApiResponse(200, allContent, "All content"));
};

export const deleteContentController = async (req: Request, res: Response) => {
  const paramsContentId = req.params.id;

  if (!req.user?._id) throw new ApiError(401, "Unauthorized");

  if (!paramsContentId) throw new ApiError(404, "Content ID is required");

  await Content.findOneAndDelete({
    userId: req.user._id,
    _id: new mongoose.Types.ObjectId(paramsContentId),
  });

  res.status(200).json(new ApiResponse(200, {}, "deleted successfully"));
};

export const editContentController = async (req: Request, res: Response) => {
  const paramsContentId = req.params.id;
  const userId = req.user?._id;

  if (!userId) throw new ApiError(401, "Unauthorized");

  if (!paramsContentId) throw new ApiError(404, "Content ID is required");

  const zodResponse = createContentSchema.safeParse(req.body);

  if (!zodResponse.success) {
    throw new ApiError(422, zodResponse.error.message);
  }

  const { title, description, tags, type, contentLink } = zodResponse.data;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Content.findOneAndUpdate(
      {
        userId: new mongoose.Types.ObjectId(userId),
        _id: new mongoose.Types.ObjectId(paramsContentId),
      },
      {
        title: title ?? "Untitled",
        description: description ?? "",
        contentLink: contentLink ?? "#",
        type: type,
      },
      { session }
    );

    // Delete old tags
    await ContentTags.deleteMany(
      { contentId: new mongoose.Types.ObjectId(paramsContentId) },
      { session }
    );

    // Create new tags
    for (const rawTag of tags) {
      const normalizedTag = rawTag.toLowerCase().trim();

      const tagDoc = await Tags.findOneAndUpdate(
        { value: normalizedTag },
        { $setOnInsert: { value: normalizedTag } },
        { upsert: true, new: true, session }
      );

      await ContentTags.findOneAndUpdate(
        {
          contentId: new mongoose.Types.ObjectId(paramsContentId),
          tagId: tagDoc._id,
        },
        {},
        { upsert: true, session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Content updated successfully"));
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// TODO : Filtering

export const typeFilterController = async (req: Request, res: Response) => {

};

export const tagFilterController = async (req: Request, res: Response) => {};
