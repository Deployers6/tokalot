"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

const BACKEND_URL = "https://tokalot.vercel.app";

interface UserType {
  id: string;
  clerkId: string;
  fullName: string;
  isMember: boolean;
}

interface Props {
  user: UserType;
  onClose: () => void;
  onSuccess: () => void;
}

const EditUserModal = ({ user, onClose, onSuccess }: Props) => {
  const { userId } = useAuth();
  const [fullName, setFullName] = useState(user.fullName);
  const [isMember, setIsMember] = useState(user.isMember);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const parts = fullName.trim().split(" ");
      const firstName = parts[0];
      const lastName = parts.slice(1).join(" ") || "";

      await fetch(`${BACKEND_URL}/api/admin/patch-user`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetClerkId: user.clerkId,
          adminClerkId: userId,
          firstName,
          lastName,
        }),
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-md rounded-2xl p-5">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>

        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full mb-3 p-3 rounded-xl bg-gray-100 outline-none"
          placeholder="Full name"
        />

        <div className="flex items-center justify-between mb-4">
          <span>Member</span>
          <input
            type="checkbox"
            checked={isMember}
            onChange={(e) => setIsMember(e.target.checked)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-black text-white"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
