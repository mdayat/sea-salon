import { Poppins } from "next/font/google";
import { ChakraBaseProvider } from "@chakra-ui/react";
import type { ReactElement, ReactNode } from "react";
import type { AppProps } from "next/app";
import type { NextPage } from "next";

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

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  // eslint-disable-next-line no-unused-vars
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ??
    ((page: ReactElement) => {
      return (
        <>
          <Navbar />
          <main className="font-poppins">{page}</main>
        </>
      );
    });

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
        {getLayout(<Component {...pageProps} />)}
      </ChakraBaseProvider>
    </>
  );
}
