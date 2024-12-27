import { SidebarProvider } from "@/config/context";
import "@/styles/globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"], 
  weight: ["400","500", "700"], 
});

export default function App({ Component, pageProps }) {
  return (
    <SidebarProvider>
      <main className={poppins.className}>
        <Component {...pageProps} />
      </main>
    </SidebarProvider>
  );
}
