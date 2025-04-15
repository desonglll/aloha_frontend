import api from "./api.ts";
import { API_ENDPOINTS } from "../config/api.config.ts";
import type {
  Tweet,
  CreateTweetFormData,
  UpdateTweetFormData,
  ApiResponse,
} from "../types/models.ts";

/**
 * Get all tweets with optional pagination and filtering by user
 */
export const getAllTweets = async (
  page?: number,
  size?: number,
  user_id?: string
): Promise<ApiResponse<Tweet[]>> => {
  const params = { page, size, user_id };
  return api.get(API_ENDPOINTS.TWEETS.GET_ALL, { params });
};

/**
 * Get tweet by ID
 */
export const getTweetById = async (id: string): Promise<Tweet> => {
  return api.get(API_ENDPOINTS.TWEETS.GET_BY_ID(id));
};

/**
 * Create new tweet
 */
export const createTweet = async (
  tweetData: CreateTweetFormData
): Promise<Tweet> => {
  return api.post(API_ENDPOINTS.TWEETS.CREATE, tweetData);
};

/**
 * Update existing tweet
 */
export const updateTweet = async (
  tweetData: UpdateTweetFormData
): Promise<Tweet> => {
  return api.put(API_ENDPOINTS.TWEETS.UPDATE(tweetData.id), tweetData);
};

/**
 * Delete tweet
 */
export const deleteTweet = async (id: string): Promise<Tweet> => {
  return api.delete(API_ENDPOINTS.TWEETS.DELETE(id));
};

/**
 * Delete multiple tweets
 */
export const deleteMultipleTweets = async (
  tweetIds: string[]
): Promise<Tweet[]> => {
  return api.delete(API_ENDPOINTS.TWEETS.DELETE_MULTIPLE, { data: tweetIds });
};
