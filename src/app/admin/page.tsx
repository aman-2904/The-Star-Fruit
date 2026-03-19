"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // The AdminLayout handles the actual authentication logic.
    // This page just serves as a mounting point for /admin.
    router.push("/admin/dashboard");
  }, [router]);

  return null;
}
