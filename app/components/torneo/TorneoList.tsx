"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Torneo } from "@prisma/client";

type Props = {
  torneos: Torneo[];
  pageSize?: number;
  pageSizeOptions?: number[];
};

export default function TorneoList({
  torneos,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50],
}: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialPage = Math.max(1, Number(searchParams.get("page") ?? 1));
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);

  const totalPages = Math.max(1, Math.ceil(torneos.length / rowsPerPage));
  const clampedPage = Math.min(currentPage, totalPages);

  useEffect(() => {
    const sp = new URLSearchParams(searchParams.toString());
    if (clampedPage > 1) sp.set("page", String(clampedPage));
    else sp.delete("page");
    router.replace(`?${sp.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clampedPage]);

  useEffect(() => {
    if (currentPage !== clampedPage) setCurrentPage(clampedPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  const onChangePageSize = (v: number) => {
    setRowsPerPage(v);
    setCurrentPage(1);
  };

  const paginated = useMemo(() => {
    const start = (clampedPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return torneos.slice(start, end);
  }, [torneos, clampedPage, rowsPerPage]);

  const from = torneos.length === 0 ? 0 : (clampedPage - 1) * rowsPerPage + 1;
  const to = Math.min(clampedPage * rowsPerPage, torneos.length);

  const pagesToRender = useMemo(() => {
    const sib = 1;
    const out: (number | "dots")[] = [];
    const left = Math.max(1, clampedPage - sib);
    const right = Math.min(totalPages, clampedPage + sib);
    out.push(1);
    if (left > 2) out.push("dots");
    for (let i = left; i <= right; i++) {
      if (i !== 1 && i !== totalPages) out.push(i);
    }
    if (right < totalPages - 1) out.push("dots");
    if (totalPages > 1) out.push(totalPages);
    return out.filter((v, i, a) => (i === 0 ? true : v !== a[i - 1]));
  }, [clampedPage, totalPages]);

  const baseBtn =
    "flex items-center justify-center px-3 h-8 leading-tight border";
  const numBtn =
    baseBtn +
    " bg-white border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 " +
    "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";
  const activeBtn =
    baseBtn +
    " z-10 text-white border border-yellow-400 bg-yellow-400 hover:bg-yellow-500 hover:border-yellow-500 " +
    "dark:bg-yellow-400 dark:border-yellow-400 dark:hover:bg-yellow-500";
  const edgeBtn =
    baseBtn +
    " ms-0 rounded-s-lg bg-white border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 " +
    "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";
  const edgeBtnRight =
    baseBtn +
    " rounded-e-lg bg-white border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 " +
    "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";
  const disabled =
    "opacity-50 cursor-not-allowed hover:bg-white dark:hover:bg-gray-800 hover:text-gray-500 dark:hover:text-gray-400";

  const goTo = (p: number) =>
    setCurrentPage(Math.min(Math.max(1, p), totalPages));

  const formatDate = (d: Date | string) => {
    const date = typeof d === "string" ? new Date(d) : d;
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-x-auto shadow dark:shadow dark:shadow-gray-800 rounded">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Torneo</th>
              <th scope="col" className="px-6 py-3">Sede</th>
              <th scope="col" className="px-6 py-3">Provincia</th>
              <th scope="col" className="px-6 py-3">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((torneo) => (
              <tr key={torneo.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <h5 className="text-xl font-bold">
                    <Link
                      href={`/torneos/${torneo.id}`}
                      className="font-medium text-yellow-300 hover:text-yellow-400"
                    >
                      {torneo.nombre}
                    </Link>
                  </h5>
                </th>
                <td className="px-6 py-4">{torneo.sede}</td>
                <td className="px-6 py-4">{torneo.provincia}</td>
                <td className="px-6 py-4">
                  {formatDate(torneo.fecha as unknown as Date)}
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-400">
                  No hay torneos para esta página.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center">
        <nav aria-label="Pagination">
          <ul className="inline-flex -space-x-px text-sm">
            <li>
              <button
                onClick={() => goTo(1)}
                disabled={clampedPage === 1}
                className={`${edgeBtn} ${clampedPage === 1 ? disabled : ""}`}
              >
                «
              </button>
            </li>
            <li>
              <button
                onClick={() => goTo(clampedPage - 1)}
                disabled={clampedPage === 1}
                className={`${numBtn} ${clampedPage === 1 ? disabled : ""}`}
              >
                ‹
              </button>
            </li>

            {pagesToRender.map((p, idx) =>
              p === "dots" ? (
                <li key={`dots-${idx}`}>
                  <span className={numBtn + " cursor-default select-none"}>…</span>
                </li>
              ) : (
                <li key={p}>
                  <button
                    onClick={() => goTo(p as number)}
                    aria-current={p === clampedPage ? "page" : undefined}
                    className={p === clampedPage ? activeBtn : numBtn}
                  >
                    {p}
                  </button>
                </li>
              )
            )}

            <li>
              <button
                onClick={() => goTo(clampedPage + 1)}
                disabled={clampedPage === totalPages}
                className={`${numBtn} ${clampedPage === totalPages ? disabled : ""}`}
              >
                ›
              </button>
            </li>
            <li>
              <button
                onClick={() => goTo(totalPages)}
                disabled={clampedPage === totalPages}
                className={`${edgeBtnRight} ${clampedPage === totalPages ? disabled : ""}`}
              >
                »
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
