"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { MazoConUsuario } from "./MazosCompartidos";

type Props = {
  mazos: MazoConUsuario[];
  linkEdit?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
};

export default function MazoList({
  mazos,
  linkEdit = false,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50],
}: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialPage = Math.max(1, Number(searchParams.get("page") ?? 1));
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);

  const totalPages = Math.max(1, Math.ceil(mazos.length / rowsPerPage));
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
    return mazos.slice(start, end);
  }, [mazos, clampedPage, rowsPerPage]);

  const from = mazos.length === 0 ? 0 : (clampedPage - 1) * rowsPerPage + 1;
  const to = Math.min(clampedPage * rowsPerPage, mazos.length);

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
    " z-10 text-white border border-yellow-400 bg-yellow-400 hover:bg-yellow-500 " +
    "dark:bg-yellow-400 dark:border-yellow-400";
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Mostrando <span className="font-medium">{from}</span>–<span className="font-medium">{to}</span> de{" "}
          <span className="font-medium">{mazos.length}</span>
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-xs text-gray-500 dark:text-gray-400">
            Filas por página
          </label>
          <select
            id="pageSize"
            className="block w-24 rounded-lg border border-gray-300 bg-gray-50 p-1 text-sm text-gray-900
                       focus:border-yellow-400 focus:ring-yellow-400
                       dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            value={rowsPerPage}
            onChange={(e) => onChangePageSize(Number(e.target.value))}
          >
            {(pageSizeOptions ?? [10, 25, 50]).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative overflow-x-auto shadow dark:shadow dark:shadow-gray-800 rounded">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Nombre</th>
              <th scope="col" className="px-6 py-3">Subtipo</th>
              <th scope="col" className="px-6 py-3">Subtipo</th>
              {linkEdit ? (
                <th scope="col" className="px-6 py-3">Público</th>
              ) : (
                <th scope="col" className="px-6 py-3">Usuario</th>
              )}
              <th scope="col" className="px-6 py-3">Formato</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((mazo) => (
              <tr key={mazo.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <h5 className="text-xl font-bold">
                    <Link
                      href={linkEdit ? `/mazo/editar/${mazo.id}` : `/mazo/ver/${mazo.id}`}
                      className="font-medium text-yellow-300 hover:text-yellow-400"
                    >
                      {mazo.nombre}
                    </Link>
                  </h5>
                </th>
                <td className="px-6 py-4">{mazo.subtipo1}</td>
                <td className="px-6 py-4">{mazo.subtipo2}</td>
                {linkEdit ? (
                  <td className="px-6 py-4">
                    <label className="inline-flex items-center cursor-not-allowed">
                      <input
                        checked={!!mazo.publico}
                        readOnly
                        type="checkbox"
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700
                                      peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                                      after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                                      after:bg-white after:border-gray-300 after:border after:rounded-full
                                      after:h-5 after:w-5 after:transition-all dark:border-gray-600
                                      peer-checked:bg-yellow-400 dark:peer-checked:bg-yellow-400" />
                    </label>
                  </td>
                ) : (
                  <td className="px-6 py-4">{mazo.usuario.nombre}</td>
                )}
                <td className="px-2 py-4">
                  {(mazo.formato === null || mazo.formato === "DOMINACION") && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                      Dominación
                    </span>
                  )}
                  {mazo.formato === "TRUE_ETHERNAL" && (
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-gray-300">
                      Eterno
                    </span>
                  )}
                  {mazo.formato === "GUARDIAN" && (
                    <span className="bg-green-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-green-700 dark:text-green-300">
                      Guardián
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-400">
                  No hay mazos para esta página.
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
