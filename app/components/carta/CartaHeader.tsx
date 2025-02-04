"use client";
import SearchBar from "@/app/components/SearchBar";
import CartaFilters from "@/app/components/carta/CartaFilters";
import CartaSearch from "@/app/components/carta/CartaSearch";

import { Carta } from "@prisma/client";
import { useState } from "react";

export default function CartaHeader({ cartas }: { cartas: Carta[] }) {
    const [cantidad, setCantidad] = useState(0);
    return (
        <div className="p-4 pt-0">
            <SearchBar filters={CartaFilters()} />
            <div className={cantidad > 0 ? "pt-4" : "hidden"}>
                <CartaSearch cartas={cartas} setCantidad={setCantidad} />
            </div>
        </div>
    );
}