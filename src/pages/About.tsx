import React from "react";
import Layout from "../components/Layout.tsx";

const About: React.FC = () => {
  return (
    <Layout>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">About Us</h1>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              Welcome to Aloha Admin, a comprehensive admin dashboard for
              managing users and user groups.
            </p>
            <p className="text-gray-600 mb-4">
              This application provides a clean and intuitive interface for
              administrators to manage their system.
            </p>
            <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
              Features
            </h2>
            <ul className="list-disc pl-5 text-gray-600 mb-4">
              <li>User Management</li>
              <li>User Group Management</li>
              <li>Responsive Design</li>
              <li>Modern UI/UX</li>
            </ul>
            <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
              Technology Stack
            </h2>
            <ul className="list-disc pl-5 text-gray-600 mb-4">
              <li>React</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
              <li>Framer Motion</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
