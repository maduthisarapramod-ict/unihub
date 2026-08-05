"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase Safe Client Setup
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xyz.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_key";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function Home() {
  const [universities] = useState([
    { id: 1, name: "University of Colombo" },
    { id: 2, name: "University of Peradeniya" },
    { id: 3, name: "University of Moratuwa" },
    { id: 4, name: "University of Kelaniya" },
    { id: 5, name: "University of Sri Jayewardenepura" }
  ]);

  return (
    <main className="min-h-screen p-8 bg-slate-50 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full bg-white p-6 rounded-xl shadow-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-slate-800">
          UniHub Portal
        </h1>
        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold text-slate-700 mb-3">
            Universities List
          </h2>
          <ul className="space-y-2">
            {universities.map((uni) => (
              <li
                key={uni.id}
                className="p-3 bg-slate-100 rounded-lg text-slate-700 border border-slate-200"
              >
                {uni.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
