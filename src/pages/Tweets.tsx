import { useEffect, useState, useCallback } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiMessageSquare } from "react-icons/fi";
import Card from "../components/ui/Card.tsx";
import DataTable from "../components/ui/DataTable.tsx";
import Button from "../components/ui/Button.tsx";
import Modal from "../components/ui/Modal.tsx";
import AddTweetForm from "../components/forms/AddTweetForm.tsx";
import EditTweetForm from "../components/forms/EditTweetForm.tsx";
import type { Tweet, Pagination, User } from "../types/models.ts";
import { getAllTweets, deleteTweet } from "../services/tweetService.ts";
import { getUserById } from "../services/userService.ts";

const Tweets = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    size: 10,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTweet, setSelectedTweet] = useState<Tweet | null>(null);
  // Temporarily using a mock current user - in a real app this would come from auth context
  const [currentUser] = useState<User>({
    id: localStorage.getItem("user_id") || "",
    username: localStorage.getItem("username") || "",
  });
  const [tweetUsers, setTweetUsers] = useState<Record<string, User>>({});

  const fetchTweets = useCallback(async (page = 1, size = 10) => {
    try {
      setIsLoading(true);
      const response = await getAllTweets(page, size);
      setTweets(response.data);

      setPagination(
        response.pagination || { page, size, total: response.data.length }
      );

      // Fetch user details for each tweet
      const userIds = [...new Set(response.data.map((tweet) => tweet.user_id))];
      const userPromises = userIds.map((id) => getUserById(id));
      const users = await Promise.all(userPromises);

      const userMap: Record<string, User> = {};
      users.forEach((user: User) => {
        userMap[user.id] = user;
      });

      setTweetUsers(userMap);
    } catch (error) {
      console.error("Failed to fetch tweets:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTweets(pagination.page || 1, pagination.size || 10);
  }, [pagination.page, pagination.size, fetchTweets]);

  const handlePageChange = (page: number) => {
    fetchTweets(page, pagination.size || 10);
  };

  const handlePageSizeChange = (size: number) => {
    fetchTweets(1, size);
  };

  const handleDeleteTweet = async (tweetId: string) => {
    if (globalThis.confirm("Are you sure you want to delete this tweet?")) {
      try {
        await deleteTweet(tweetId);
        fetchTweets(pagination.page || 1, pagination.size || 10);
      } catch (error) {
        console.error("Failed to delete tweet:", error);
      }
    }
  };

  const handleAddTweet = () => {
    setIsAddModalOpen(true);
  };

  const handleEditTweet = (tweet: Tweet) => {
    setSelectedTweet(tweet);
    setIsEditModalOpen(true);
  };

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    fetchTweets(pagination.page || 1, pagination.size || 10);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedTweet(null);
    fetchTweets(pagination.page || 1, pagination.size || 10);
  };

  const columns = [
    {
      header: "Content",
      accessor: "content" as keyof Tweet,
      cell: (tweet: Tweet) => (
        <div className="max-w-md">
          <p className="truncate">{tweet.content}</p>
        </div>
      ),
    },
    {
      header: "Author",
      accessor: (tweet: Tweet) =>
        tweetUsers[tweet.user_id]?.username || "Unknown",
    },
    {
      header: "Created At",
      accessor: (tweet: Tweet) => tweet.created_at,
    },
    {
      header: "Updated At",
      accessor: (tweet: Tweet) => tweet.updated_at,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tweets</h1>
        <div className="flex space-x-3">
          <Button
            variant="primary"
            size="md"
            icon={<FiPlus />}
            onClick={handleAddTweet}
          >
            New Tweet
          </Button>
        </div>
      </div>

      <Card>
        <DataTable<Tweet>
          columns={columns}
          data={tweets}
          keyField="id"
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          isLoading={isLoading}
          emptyState={
            <div className="py-12 text-center">
              <FiMessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No tweets found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new tweet.
              </p>
              <div className="mt-6">
                <Button
                  variant="primary"
                  size="md"
                  icon={<FiPlus />}
                  onClick={handleAddTweet}
                >
                  New Tweet
                </Button>
              </div>
            </div>
          }
          actions={(tweet) => (
            <div className="flex space-x-2 justify-end">
              <Button
                variant="ghost"
                size="sm"
                icon={<FiEdit2 />}
                aria-label="Edit tweet"
                onClick={() => handleEditTweet(tweet)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={<FiTrash2 />}
                aria-label="Delete tweet"
                onClick={() => handleDeleteTweet(tweet.id)}
              >
                Delete
              </Button>
            </div>
          )}
        />
      </Card>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Tweet"
      >
        <AddTweetForm
          currentUser={currentUser}
          onSuccess={handleAddSuccess}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {selectedTweet && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTweet(null);
          }}
          title="Edit Tweet"
        >
          <EditTweetForm
            tweet={selectedTweet}
            onSuccess={handleEditSuccess}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedTweet(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default Tweets;
