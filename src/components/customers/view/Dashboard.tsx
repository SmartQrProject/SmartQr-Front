import React from 'react';

interface DashboardProps {
  user: {
    name?: string;
    email?: string;
    picture?: string;
    [key: string]: any;
  };
}



const Dashboard: React.FC<DashboardProps> = ({user}) => {
  return (
    <div className="p-4">
      <form className="max-w-md mx-auto space-y-4">
        {/* Avatar */}
        <div className="flex items-center space-x-4">
          <img
            className="w-16 h-16 rounded-full"
            src={user.picture}
            alt="Profile picture"
          />
          <button type="button" className="text-sm text-blue-600 hover:underline">
            Change photo
          </button>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={user.email}
            disabled
            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
            Name
          </label>
          <input
            type="text"
            id="name"
            defaultValue={user.name}
            className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            placeholder='+56912345678'
            defaultValue={user.phone || ""}
            className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
            Password
          </label>
          <input
            type="password"
            id="password"
            defaultValue="Clave123%%"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900">
            Confirm password
          </label>
          <input
            type="password"
            id="confirmPassword"
            defaultValue="Clave123%%"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
        </div>

        {/* Reward */}
        <div>
          <label htmlFor="reward" className="block mb-2 text-sm font-medium text-gray-900">
            Reward
          </label>
          <input
            type="number"
            id="reward"
            value="0"
            disabled
            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
        </div>

        {/* Save button */}
        <button
          type="submit"
          className="w-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Save changes
        </button>
      </form>
    </div>
  );
};

export default Dashboard;
