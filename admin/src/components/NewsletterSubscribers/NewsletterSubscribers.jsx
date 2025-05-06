import React, { useState } from 'react';
import { useGetAllSubscribersQuery } from '../../redux/adminNewsletterAuthApi/adminNewsletterAuthApi';

const NewsletterSubscribers = () => {
  const { data, error, isLoading } = useGetAllSubscribersQuery();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubscribers = data?.filter((subscriber) =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading)
    return <p className="text-center text-blue-500 text-lg mt-8">Loading subscribers...</p>;

  if (error)
    return <p className="text-center text-red-500 text-lg mt-8">Error fetching subscribers: {error.message}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Newsletter Subscribers</h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by email..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Scrollable List */}
      <div className="h-96 overflow-y-auto pr-2">
        <ul className="space-y-4">
          {filteredSubscribers?.length > 0 ? (
            [...filteredSubscribers].reverse().map((subscriber, index) => (
              <li
                key={index}
                className="border border-gray-200 rounded-lg p-4 shadow-sm hover:bg-gray-50 transition"
              >
                <p className="text-gray-700">
                  <span className="font-semibold">Email:</span> {subscriber.email}
                </p>
                <p className="text-gray-500 text-sm">
                  <span className="font-semibold">Subscribed At:</span>{' '}
                  {new Date(subscriber.subscribedAt).toLocaleString()}
                </p>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No subscribers found.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NewsletterSubscribers;
