"use client";

import { AdminShell } from "../../components/layout/AdminShell";
import { MembersList } from "./MembersList";
import { MembersToolbar } from "./MembersToolbar";
import { useAdminMembers } from "./useAdminMembers";

export default function MembersPage() {
  const { search, setSearch, filteredUsers, loading, error } = useAdminMembers();

  return (
    <AdminShell eyebrow="Management" title="Students">
      <MembersToolbar
        count={filteredUsers.length}
        search={search}
        onSearchChange={setSearch}
      />
      <MembersList users={filteredUsers} loading={loading} error={error} />
    </AdminShell>
  );
}
