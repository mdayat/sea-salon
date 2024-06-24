import { Poppins } from "next/font/google";
import { ChakraBaseProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";

import { Navbar } from "../components/Navbar";
import { theme } from "../libs/chakraui";
import "../styles/globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-poppins: ${poppins.style.fontFamily};
          }
        `}
      </style>

      <ChakraBaseProvider theme={theme}>
        <Navbar />

        <main className="font-poppins">
          <Component {...pageProps} />
        </main>
      </ChakraBaseProvider>
    </>
  );
}
