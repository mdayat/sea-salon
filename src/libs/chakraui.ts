import { extendBaseTheme, theme as chakraTheme } from "@chakra-ui/react";

const {
  Button,
  Input,
  FormLabel,
  FormError,
  Form,
  Container,
  Heading,
  Avatar,
  Alert,
  Drawer,
  Card,
  Divider,
} = chakraTheme.components;

export const theme = extendBaseTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  components: {
    Button,
    Input,
    FormLabel,
    FormError,
    Form,
    Container,
    Heading,
    Avatar,
    Alert,
    Drawer,
    Card,
    Divider,
  },
});
