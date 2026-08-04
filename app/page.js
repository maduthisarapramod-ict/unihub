"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase Setup (Vercel Build Error එක වැළැක්වීමට Fallback URLs යොදා ඇත)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Universities List (ඔබගේ අවශ්‍යතාවය පරිදි වෙනස් කරගන්න)
const UNIVERSITIES = [
  { id: 1, name: "University of Colombo" },
  { id: 2, name: "University of Peradeniya" },
  { id: 3, name: "University of Moratuwa" }
];

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // ඔබේ Supabase Table එකේ නම මෙතැනින් 'your_table_name' වෙනුවට ලබාදෙන්න
        const { data: responseData, error } = await supabase.from('your_table_name').select('*');
        if (error) {
          console.log("Supabase error/info:", error.message);
        } else if (responseData) {
          setData(responseData);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <main className="min-h-screen p-8 bg-slate-50 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white p-6 rounded-xl shadow-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-slate-800">
          UniHub Portal
        </h1>

        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold text-slate-700 mb-3">Universities</h2>
          <ul className="space-y-2">
            {UNIVERSITIES.map((uni) => (
              <li key={uni.id} className="p-3 bg-slate-100 rounded-lg text-slate-700">
                {uni.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Supabase Dynamic Data Section */}
        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold text-slate-700 mb-2">Database Connection</h2>
          <p className="text-sm text-slate-500">
            Status: {loading ? "Loading Supabase data..." : "Connected"}
          </p>
        </div>
      </div>
    </main>
  );
}
