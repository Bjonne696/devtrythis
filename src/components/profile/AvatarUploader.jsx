
import { useRef, useState } from "react";
import supabase from "../../lib/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";
import { AvatarUploadButton, HiddenFileInput } from "../../styles/pages/minProfilPageStyles";

export default function AvatarUploader({ onUpload }) {
  const { user } = useAuth();
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    setUploading(true);

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      alert("Feil ved opplasting: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: filePath })
      .eq("id", user.id);

    if (updateError) {
      alert("Feil ved lagring av URL: " + updateError.message);
      setUploading(false);
      return;
    }

    onUpload?.(filePath);
    setUploading(false);
  };

  return (
    <>
      <HiddenFileInput
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={uploading}
      />
      <AvatarUploadButton
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? "Opplaster..." : "Velg profilbilde"}
      </AvatarUploadButton>
    </>
  );
}
