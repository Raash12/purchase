import { supabase } from "../supabaseClient";

export const uploadFileToSupabase = async (file) => {
  if (!file) return "";

  try {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("orders") // 👈 bucket name
      .upload(fileName, file);

    if (error) throw error;

    // ✅ Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("orders")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error("Supabase upload error:", err);
    throw err;
  }
};
