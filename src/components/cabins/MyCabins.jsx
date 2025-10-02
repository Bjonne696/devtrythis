import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import supabase from "../../lib/supabaseClient";
import { formatPrice } from "../../utils/formatters";
import {
  MyCabinsGrid,
  MyCabinCard,
  MyCabinImage,
  MyCabinInfo,
  MyCabinTitle,
  MyCabinLocation,
  MyCabinPrice,
  DeleteButton
} from "../../styles/cabins/cabinStyles";

export default function MyCabins() {
  const { profile } = useAuth();
  const [cabins, setCabins] = useState([]);

  useEffect(() => {
    if (profile?.id) {
      fetchMyCabins();
    }
  }, [profile]);

  const fetchMyCabins = async () => {
    const { data, error } = await supabase
      .from("cabins")
      .select("*")
      .eq("owner_id", profile.id);

    if (!error) {
      setCabins(data);
    } else {
      console.error("Feil ved henting av dine hytter:", error.message);
    }
  };

  const handleDelete = async (cabinId) => {
    const confirmDelete = window.confirm("Er du sikker på at du vil slette hytten?");
    if (!confirmDelete) return;

    const { data: cabin, error: fetchError } = await supabase
      .from("cabins")
      .select("image_urls")
      .eq("id", cabinId)
      .single();

    if (fetchError) {
      console.error("Feil ved henting av hytte:", fetchError.message);
      return;
    }

    const filesToDelete = (cabin.image_urls || []).map((url) => {
      const fileName = url.split("/").pop();
      return fileName;
    });

    if (filesToDelete.length > 0) {
      const { error: storageError } = await supabase
        .storage
        .from("cabins-images")
        .remove(filesToDelete);

      if (storageError) {
        console.error("Feil ved sletting av bilder:", storageError.message);
      }
    }

    const { error: deleteError } = await supabase
      .from("cabins")
      .delete()
      .eq("id", cabinId);

    if (!deleteError) {
      alert("Hytten er slettet!");
      setCabins(cabins.filter((c) => c.id !== cabinId));
    } else {
      console.error("Feil ved sletting:", deleteError.message);
    }
  };

  if (!profile) return null;

  return (
    <div>
      {cabins.length === 0 ? (
        <p>Du har ingen hytteannonser enda.</p>
      ) : (
        <MyCabinsGrid>
          {cabins.map((cabin) => (
            <MyCabinCard key={cabin.id}>
              {cabin.image_urls && cabin.image_urls.length > 0 && (
                <MyCabinImage src={cabin.image_urls[0]} alt={cabin.title} />
              )}
              <MyCabinInfo>
                <MyCabinTitle>{cabin.title}</MyCabinTitle>
                <MyCabinLocation>{cabin.location}</MyCabinLocation>
                <MyCabinPrice>{formatPrice(cabin.price_per_night)} / natt</MyCabinPrice>
                <DeleteButton onClick={() => handleDelete(cabin.id)}>
                  Slett hytte
                </DeleteButton>
              </MyCabinInfo>
            </MyCabinCard>
          ))}
        </MyCabinsGrid>
      )}
    </div>
  );
}