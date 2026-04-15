"use client";

import { UserShell } from "../../components/UserShell";
import { UserBrandHeader } from "../../components/UserBrandHeader";
import { MembershipCard } from "./MembershipCard";
import { ProfileForm } from "./ProfileForm";
import { ProfilePhotoField } from "./ProfilePhotoField";
import { useProfileState } from "./useProfileState";

export default function ProfilePageContent() {
  const {
    fileInputRef,
    photo,
    photoUploading,
    openFilePicker,
    savePhoto,
    fullName,
    setFullName,
    email,
    membership,
    successMsg,
    saveProfile,
    saving,
  } = useProfileState();

  return (
    <UserShell header={<UserBrandHeader />} navTab="profile">
      <div className="flex flex-col gap-6 px-6 pt-8">
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) savePhoto(file); }} />
        <ProfilePhotoField photo={photo} loading={photoUploading} onChoose={openFilePicker} />
        <ProfileForm fullName={fullName} email={email} onFullNameChange={setFullName} />
        <MembershipCard membership={membership} />
        {successMsg ? <div className="rounded-[12px] border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-semibold text-green-600">{successMsg}</div> : null}
        <button onClick={saveProfile} disabled={saving} className="w-full rounded-[12px] bg-black py-4 text-sm font-bold text-white disabled:opacity-60">{saving ? "Saving..." : "Save Changes"}</button>
      </div>
    </UserShell>
  );
}
