import { useState, useEffect } from "react";
import { updateTweet } from "../../services/tweetService.ts";
import { Tweet } from "../../types/models.ts";
import Button from "../ui/Button.tsx";

interface EditTweetFormProps {
  tweet: Tweet;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditTweetForm = ({ tweet, onSuccess, onCancel }: EditTweetFormProps) => {
  const [content, setContent] = useState(tweet.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setContent(tweet.content);
  }, [tweet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Tweet content cannot be empty");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await updateTweet({
        id: tweet.id,
        content,
      });

      onSuccess();
    } catch (err) {
      console.error("Failed to update tweet:", err);
      setError("Failed to update tweet. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Edit your tweet
        </label>
        <textarea
          id="content"
          name="content"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={280}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          disabled={isSubmitting}
        />
        <div className="mt-1 text-right text-xs text-gray-500">
          {content.length}/280
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={
            isSubmitting || !content.trim() || content === tweet.content
          }
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default EditTweetForm;
