import { createGetInitialProps } from "@mantine/next";
import Document, { Head, Html, Main, NextScript } from "next/document";

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html>
        <Head />
        <script
          async
          defer
          data-website-id="3b77bd4a-0e2a-4f03-b03e-ca47c99725e4"
          src="https://slayalytics.mmattdonk.com/umami.js"
        ></script>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
