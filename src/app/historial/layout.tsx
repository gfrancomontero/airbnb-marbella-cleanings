import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Limpiezas Anteriores | Limpiezas Marbella",
  description:
    "Historial de limpiezas realizadas en la propiedad Airbnb de Marbella. Consulta las limpiezas del último año organizadas por períodos.",
  openGraph: {
    title: "Limpiezas Anteriores | Limpiezas Marbella",
    description:
      "Historial de limpiezas realizadas en la propiedad Airbnb de Marbella.",
  },
};

export default function HistorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

