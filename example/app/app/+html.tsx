import { ScrollViewStyleReset } from "expo-router/html";
import { WebProvider } from "@/store/WebProvider";

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1"
        />

        {/* This CSP used to control which domain could embed this App. For now, we're using this App in doc site. */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="frame-ancestors 'self' https://app.rn-carousel.dev http://localhost:8002"
        />

        {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Using raw CSS styles as an escape-hatch to ensure the background color never flickers in dark-mode. */}
        <style
          dangerouslySetInnerHTML={{
            __html: ``,
          }}
        />

        {/* Add any additional <head> elements that you want globally available on web... */}
      </head>
      <body>
        <WebProvider>{children}</WebProvider>
      </body>
    </html>
  );
}