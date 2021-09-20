import * as React from "react"
import {
  ChakraProvider,
  Box,
  VStack,
  Grid,
  theme,
  Button,
  useDisclosure,
  Collapse,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import GlobalContext, { initialState, reducer } from "./context/globalContext";
import Timer from "./components/Timer";
import MapComponent from "./components/MapComponent";

export const App = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { isOpen, onToggle } = useDisclosure();
  return (
    <GlobalContext.Provider value={{ dispatch, state }}>
      <ChakraProvider theme={theme}>
        <Box textAlign="center" fontSize="xl">
          <Grid minH="100vh" p={3}>
            <ColorModeSwitcher justifySelf="flex-end" />
            <VStack spacing={8}>
              <Timer />
              <Button onClick={onToggle}>Show Map</Button>
              {isOpen && (
                <Box w="%">
                  <MapComponent />
                </Box>
              )}
            </VStack>
          </Grid>
        </Box>
      </ChakraProvider>
    </GlobalContext.Provider>
  );
};

