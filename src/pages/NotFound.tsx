import { Link } from "react-router";
import Button from "../components/ui/Button.tsx";
import { FiArrowLeft } from "react-icons/fi";

const NotFound = () => {
  return (
    <div className="min-h-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Page not found
        </h2>
        <p className="mt-3 text-base text-gray-500">
          The page you're looking for doesn't exist or you may not have
          permissions to view it.
        </p>
        <div className="mt-8">
          <Link to="/">
            <Button variant="primary" icon={<FiArrowLeft />}>
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
