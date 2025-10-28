import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import supabase from "../../lib/supabaseClient";
import { formatPrice } from "../../utils/formatters";
import { cancelSubscription } from "../../hooks/useSubscription";
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
    const confirmDelete = window.confirm("Er du sikker på at du vil slette hytten? Dette vil også kansellere tilhørende abonnement.");
    if (!confirmDelete) return;

    try {
      // Fetch cabin details including subscription_id
      const { data: cabin, error: fetchError } = await supabase
        .from("cabins")
        .select("image_urls, subscription_id")
        .eq("id", cabinId)
        .single();

      if (fetchError) {
        console.error("Feil ved henting av hytte:", fetchError.message);
        alert("Kunne ikke hente hytteinformasjon. Vennligst prøv igjen.");
        return;
      }

      // Cancel subscription if it exists
      if (cabin.subscription_id) {
        try {
          await cancelSubscription(cabin.subscription_id);
          console.log("Abonnement kansellert for hytte:", cabinId);
        } catch (subscriptionError) {
          console.error("Feil ved kansellering av abonnement:", subscriptionError.message);
          // Continue with deletion even if subscription cancellation fails
          const continueDelete = window.confirm(
            "Kunne ikke kansellere abonnementet automatisk. Vil du fortsette med å slette hytten? Du må eventuelt kansellere abonnementet manuelt."
          );
          if (!continueDelete) return;
        }
      }

      // Delete images from storage
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

      // Delete the cabin
      const { error: deleteError } = await supabase
        .from("cabins")
        .delete()
        .eq("id", cabinId);

      if (!deleteError) {
        const successMessage = cabin.subscription_id 
          ? "Hytten og tilhørende abonnement er slettet!"
          : "Hytten er slettet!";
        alert(successMessage);
        setCabins(cabins.filter((c) => c.id !== cabinId));
      } else {
        console.error("Feil ved sletting av hytte:", deleteError.message);
        alert("Kunne ikke slette hytten. Vennligst prøv igjen.");
      }
    } catch (error) {
      console.error("Uventet feil ved sletting:", error.message);
      alert("En uventet feil oppstod. Vennligst prøv igjen.");
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