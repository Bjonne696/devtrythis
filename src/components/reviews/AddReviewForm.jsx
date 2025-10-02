import { useState } from "react";
import supabase from "../../lib/supabaseClient";
import {
  FormWrapper,
  FormLabel,
  StarRow,
  TextArea,
  SubmitButton,
  ErrorMessage
} from "../../styles/bookings/reviewStyles";

export default function AddReviewForm({ cabinId, userId, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      setError("Du må velge en vurdering.");
      return;
    }

    setLoading(true);
    setError("");

    const { error: insertError } = await supabase.from("reviews").insert([
      {
        cabin_id: cabinId,
        user_id: userId,
        rating,
        comment,
      },
    ]);

    setLoading(false);

    if (insertError) {
      console.error(insertError.message);
      setError("Noe gikk galt ved innsending.");
    } else {
      setComment("");
      setRating(0);
      onReviewSubmitted?.(); // f.eks. for å refreshe UI
    }
  };

  return (
    <FormWrapper>
      <form onSubmit={handleSubmit}>
        <FormLabel>Stjerner:</FormLabel>
        <StarRow>
          {[1, 2, 3, 4, 5].map((num) => (
            <span
              key={num}
              className={rating >= num ? "active" : ""}
              onClick={() => setRating(num)}
            >
              ★
            </span>
          ))}
        </StarRow>

        <FormLabel>Kommentar (valgfritt):</FormLabel>
        <TextArea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Fortell om oppholdet..."
        />

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <SubmitButton type="submit" disabled={loading}>
          {loading ? "Sender inn..." : "Send vurdering"}
        </SubmitButton>
      </form>
    </FormWrapper>
  );
}