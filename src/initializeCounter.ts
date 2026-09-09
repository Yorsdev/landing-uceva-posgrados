import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

const hasSupabaseConfig = Boolean(SUPABASE_URL && SUPABASE_KEY);
const supabase = hasSupabaseConfig ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

export async function initializeCounter() {
  try {
    if (!supabase) {
      const counterElement = document.querySelector(".counter");
      if (counterElement) {
        counterElement.textContent = "Visitas: no configuradas";
      }
      return;
    }

    // Insertar nueva visita
    await supabase.from("visits").insert([{ page: "/" }]);

    // Contar total de visitas
    const { count, error } = await supabase
      .from("visits")
      .select("*", { count: "exact", head: true });

    if (error) throw error;

    const counterElement = document.querySelector(".counter");
    if (counterElement) {
      counterElement.textContent = `Visitas: ${count || 0}`;
    }
  } catch (error) {
    console.error("Error al actualizar contador:", error);
    const counterElement = document.querySelector(".counter");
    if (counterElement) {
      counterElement.textContent = "Visitas: disponible cuando se configure Supabase";
    }
  }
}