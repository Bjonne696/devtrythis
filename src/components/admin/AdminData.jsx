import React, { useEffect, useState } from "react";
import supabase from "../../lib/supabaseClient";
import DiscountCodeManager from "./DiscountCodeManager";
import {
  Table,
  Th,
  Td,
  DeleteButton,
  AdminWrapper,
  SubHeading
} from "../../styles/admin/adminDataStyles";

export default function AdminData() {
  const [users, setUsers] = useState([]);

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, last_name, email, region");

    if (!error) {
      setUsers(data);
    } else {
      console.error("Feil ved henting av profiler:", error.message);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleDelete = async (userId) => {
    const bekreft = window.confirm("Er du sikker på at du vil slette denne brukeren?");
    if (!bekreft) return;

    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (profileError) {
      console.error("Feil ved sletting av profile:", profileError.message);
      return;
    }

    const { error: authError } = await supabase.rpc("delete_user_account", {
      uid: userId,
    });

    if (authError) {
      console.warn("Bruker slettet fra profiles, men ikke fra auth.users:", authError.message);
    }

    alert("Bruker slettet!");
    fetchProfiles();
  };

  return (
    <AdminWrapper>
      <DiscountCodeManager />

      <SubHeading>Alle brukere</SubHeading>
      <Table>
        <thead>
          <tr>
            <Th>Navn</Th>
            <Th>Område</Th>
            <Th>E-post</Th>
            <Th>Handling</Th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <Td data-label="Navn">{`${user.name} ${user.last_name}`}</Td>
              <Td data-label="Område">{user.region || "-"}</Td>
              <Td data-label="E-post">{user.email}</Td>
              <Td data-label="Handling">
                <DeleteButton onClick={() => handleDelete(user.id)}>Slett</DeleteButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </AdminWrapper>
  );
}
