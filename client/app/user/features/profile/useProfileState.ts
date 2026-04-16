"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { fetchMembership, updateUserProfile } from "@/lib/api";
import type { MembershipSummary } from "./types";

export function useProfileState() {
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [membership, setMembership] = useState<MembershipSummary | null | undefined>(undefined);

  useEffect(() => {
    if (!user) return;
    user.reload().then(() => {
      setFullName(user.fullName ?? "");
      setEmail(user.primaryEmailAddress?.emailAddress ?? "");
      setPhoto(user.imageUrl || null);
    });
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;
    fetchMembership()
      .then((data) =>
        setMembership(
          data
            ? { ...data, remainingSessions: (data.totalSessions ?? 0) - (data.usedSessions ?? 0) }
            : null,
        ),
      )
      .catch(() => setMembership(null));
  }, [user?.id]);

  const showSuccess = (message: string) => {
    setSuccessMsg(message);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return {
    user,
    fileInputRef,
    fullName,
    setFullName,
    email,
    photo,
    saving,
    photoUploading,
    successMsg,
    membership,
    openFilePicker: () => fileInputRef.current?.click(),
    savePhoto: async (file: File) => {
      if (!user) return;
      setPhoto(URL.createObjectURL(file));
      setPhotoUploading(true);
      try {
        await user.setProfileImage({ file });
        showSuccess("Photo saved successfully");
      } finally {
        setPhotoUploading(false);
      }
    },
    saveProfile: async () => {
      if (!user) return;
      setSaving(true);
      try {
        const parts = fullName.trim().split(" ");
        await updateUserProfile(parts[0] ?? "", parts.slice(1).join(" "));
        await user.reload();
        setFullName(`${parts[0] ?? ""} ${parts.slice(1).join(" ")}`.trim());
        showSuccess("Profile saved successfully");
      } finally {
        setSaving(false);
      }
    },
  };
}
