import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

import BetaTestService from "../services/betaTestService";
import { CONFIG } from "../App";

const BetaTestUsersModal = ({ isOpen, onClose, env }) => {
  const [betaUsers, setBetaUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editEmail, setEditEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) fetchBetaUsers(CONFIG[env]);
  }, [isOpen, env]);

  const fetchBetaUsers = async (baseURL) => {
    try {
      setLoading(true);
      const data = await BetaTestService(baseURL).getBetaTestUsers();
      setBetaUsers(data);
    } catch (error) {
      toast.error("Failed to fetch beta test users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!newEmail.trim()) {
      toast.error("Please enter a valid email");
      return;
    }

    if (!isValidEmail(newEmail)) {
      toast.error("Please enter a valid email format");
      return;
    }

    try {
      setIsAdding(true);
      let newUser = await BetaTestService(CONFIG[env]).addBetaTestUser(
        newEmail.trim()
      );
      setBetaUsers([...betaUsers, newUser]);
      setNewEmail("");
    } catch (error) {
      toast.error("Failed to add beta test user");
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditUser = async () => {
    if (!editEmail.trim()) {
      toast.error("Please enter a valid email");
      return;
    }

    if (!isValidEmail(editEmail)) {
      toast.error("Please enter a valid email format");
      return;
    }

    try {
      setIsUpdating(true);
      let updatedUser = await BetaTestService(CONFIG[env]).updateBetaTestUser(
        editingUser.id,
        editEmail.trim()
      );
      setBetaUsers(
        betaUsers.map((user) =>
          user.id === editingUser.id ? updatedUser : user
        )
      );
      setEditingUser(null);
      setEditEmail("");
    } catch (error) {
      toast.error("Failed to update beta test user");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setIsDeleting(userId);
      await BetaTestService(CONFIG[env]).removeBetaTestUser(userId);
      setBetaUsers(betaUsers.filter((user) => user.id !== userId));
    } catch (error) {
      toast.error("Failed to remove beta test user");
    } finally {
      setIsDeleting(false);
    }
  };

  const startEditing = (user) => {
    setEditingUser(user);
    setEditEmail(user.email);
  };

  const cancelEditing = () => {
    setEditingUser(null);
    setEditEmail("");
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Beta Test Users
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Add New User Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Add New Beta Test User
          </h3>
          <div className="flex gap-3">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter email address"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              onKeyDown={(e) => e.key === "Enter" && handleAddUser()}
            />
            <button
              onClick={handleAddUser}
              disabled={isAdding || !newEmail.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-[#7a7a3a] rounded-md hover:bg-[#7a7a3a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAdding ? "Adding..." : "Add User"}
            </button>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900">
            Current Beta Test Users ({betaUsers.length})
          </h3>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : betaUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500 h-[300px] overflow-y-auto">
              No beta test users found. Add your first user above.
            </div>
          ) : (
            <div className="space-y-2 h-[300px] overflow-y-auto">
              {betaUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {editingUser?.id === user.id ? (
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        onKeyDown={(e) => e.key === "Enter" && handleEditUser()}
                      />
                      <button
                        onClick={handleEditUser}
                        disabled={isUpdating}
                        className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                      >
                        {isUpdating ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={cancelEditing}
                        disabled={isUpdating}
                        className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-gray-900 font-medium">
                        {user.email}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEditing(user)}
                          className="px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isDeleting}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={isDeleting}
                          className="px-3 py-1 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 disabled:opacity-50 transition-colors"
                        >
                          {isDeleting === user.id ? "Removing..." : "Remove"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

BetaTestUsersModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  env: PropTypes.string.isRequired,
};

export default BetaTestUsersModal;
