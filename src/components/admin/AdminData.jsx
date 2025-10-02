import React, { useEffect, useState } from "react";
import supabase from "../../lib/supabaseClient";
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

    // Slett fra profiles
    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (profileError) {
      console.error("Feil ved sletting av profile:", profileError.message);
      return;
    }

    // Slett fra auth.users (hvis du har opprettet RPC-funksjonen)
    const { error: authError } = await supabase.rpc("delete_user_account", {
      uid: userId,
    });

    if (authError) {
      console.warn("Bruker slettet fra profiles, men ikke fra auth.users:", authError.message);
    }

    alert("Bruker slettet!");
    fetchProfiles(); // Oppdater visning
  };

  return (
    <AdminWrapper>
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
              <Td>{`${user.name} ${user.last_name}`}</Td>
              <Td>{user.region || "-"}</Td>
              <Td>{user.email}</Td>
              <Td>
                <DeleteButton onClick={() => handleDelete(user.id)}>Slett</DeleteButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </AdminWrapper>
  );
}