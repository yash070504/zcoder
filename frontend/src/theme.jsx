import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      "html, body": {
        bg: "#090d16",
        color: "#f8fafc",
      },
    },
  },
});

export default theme;
