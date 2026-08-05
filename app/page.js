"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase Credentials කෙලින්ම ඇතුළත් කර ඇත (Vercel Settings අවශ්‍ය නැත)
const SUPABASE_URL = "https://unlhjqtfuuypwggxawzg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_zWCg9T8bnsA0suOsbhhhFw_ffz5KXVw";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const UNIVERSITIES = [
  { id: 1, name: "University of Colombo" },
  { id: 2, name: "University of Peradeniya" },
  { id: 3, name: "University of Moratuwa" },
  { id: 4, name: "University of Kelaniya" },
  { id: 5, name: "University of Sri Jayewardenepura" }
];

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: responseData, error } = await supabase
          .from("your_table_name")
          .select("*");

        if (error) {
          console.error("Supabase Error:", error.message);
        } else if (responseData) {
          setData(responseData);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <main className="min-h-screen p-8 bg-slate-50 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full bg-white p-6 rounded-xl shadow-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-slate-800">
          UniHub Portal
        </h1>

        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold text-slate-700 mb-3">
            Universities List
          </h2>
          <ul className="space-y-2">
            {UNIVERSITIES.map((uni) => (
              <li
                key={uni.id}
                className="p-3 bg-slate-100 rounded-lg text-slate-700 border border-slate-200"
              >
                {uni.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold text-slate-700 mb-2">
            Database Status
          </h2>
          <div className="p-3 bg-slate-50 rounded-lg text-sm font-mono text-slate-600">
            {loading ? "Connecting to Supabase..." : "Ready & Connected"}
          </div>
        </div>
      </div>
    </main>
  );
}
