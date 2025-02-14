import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import Router from "@/config/router.tsx";
import "@/styles/global.css";
import { ApolloProvider } from "@apollo/client";
import { client } from "@/config/client.tsx";
import { AuthProvider } from "@/contexts/AuthContextProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
        <AuthProvider>
          <Router />
          <Toaster position="bottom-right" />
        </AuthProvider>
    </ApolloProvider>
  </StrictMode>
);