"use client";

import { useEffect, useState } from "react";
import IndexClientesVisual from "./IndexClientesVisual";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import dayjs from "dayjs";

const LIMIT_OPTIONS = [10, 20, 30, 40, 50];

const Customers = () => {
  const { user } = useAuth();
  const slug = user?.payload?.slug;
  const token = user?.token;

  const [customers, setCustomers] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState("orders");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const APIURL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!slug || !token) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${APIURL}/${slug}/reports/customers?sortBy=${sortBy}&order=${order}&limit=${limit}&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const json = await res.json();
        if (json?.data) {
          setCustomers(json.data);
          setTotal(json.total);
        } else {
          setCustomers([]);
          setTotal(0);
        }
      } catch (err) {
        console.error("Error fetching customers:", err);
        setCustomers([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, token, sortBy, order, limit, page]);

  const totalPages = Math.ceil(total / limit);

  const toggleOrder = (column: string) => {
    if (sortBy === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setOrder("desc");
    }
  };

  return (
    <div className="p-4 rounded-xl border shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4">Customers</h2>
      <div className="mb-8">
        <IndexClientesVisual />
      </div>

      {/* Items per page filter */}
      <div className="mb-4">
        <label className="mr-2">Customers per page:</label>
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="border px-2 py-1 rounded"
        >
          {LIMIT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : customers.length === 0 ? (
        <p>No customers to display.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-gray-100 text-left">
                {[
                  ["Name", "name"],
                  ["Email", "email"],
                  ["Orders", "orders"],
                  ["Total", "totalSpent"],
                  ["Average", "averageOrder"],
                  ["Since", "createdAt"],
                  ["Last Visit", "lastVisit"],
                  ["Days Since Visit", "daysSince"],
                ].map(([label, key]) => (
                  <th
                    key={key}
                    className="px-4 py-2 cursor-pointer hover:underline"
                    onClick={() => toggleOrder(key)}
                  >
                    {label}{" "}
                    {sortBy === key ? (order === "asc" ? "↑" : "↓") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2">{c.name}</td>
                  <td className="px-4 py-2">{c.email}</td>
                  <td className="px-4 py-2">{c.orders}</td>
                  <td className="px-4 py-2">${c.totalSpent.toFixed(2)}</td>
                  <td className="px-4 py-2">${c.averageOrder.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    {dayjs(c.createdAt).format("YYYY-MM-DD")}
                  </td>
                  <td className="px-4 py-2">
                    {dayjs(c.lastVisit).format("YYYY-MM-DD")}
                  </td>
                  <td className="px-4 py-2">{c.daysSince} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4 flex items-center gap-4">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Customers;
