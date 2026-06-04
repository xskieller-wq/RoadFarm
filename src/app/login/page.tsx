import { Suspense } from "react";

import LoginForm from "./LoginForm";

import FreshDropPageShell from "@/components/layout/FreshDropPageShell";



export default function LoginPage() {

  return (

    <Suspense

      fallback={

        <FreshDropPageShell width="narrow">

          <p className="text-center text-sm text-warm-600">Loading login…</p>

        </FreshDropPageShell>

      }

    >

      <LoginForm />

    </Suspense>

  );

}


