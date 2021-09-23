import * as React from "react"
import {
  Box,
  VStack,
  Grid,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import GlobalContext, { initialState, reducer } from "./context/globalContext";
import Timer from "./components/Timer";
import MapComponent from "./components/MapComponent";

export const App = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { isOpen, onToggle } = useDisclosure();
  const toast = useToast();

  const loadRoute = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "application/json";
    fileInput.onchange = (ev) => {
      if (fileInput.files && fileInput.files[0].type === "application/json") {
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const data = JSON.parse(ev.target!.result as string);
            if (Array.isArray(data)) {
              dispatch({ type: "SAVE_TRACKS", payload: data });
            } else throw new Error("data is not JSON array");
          } catch (err) {
            toast({
              title: "Invalid route file",
              status: "error",
              duration: 2000,
              isClosable: false,
            });
          }
        };
        reader.readAsText(fileInput.files[0]);
      } else {
        toast({
          title: "Invalid route file",
          status: "error",
          duration: 2000,
          isClosable: false,
        });
      }
    };
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  return (
    <GlobalContext.Provider value={{ dispatch, state }}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <VStack spacing={8}>
            <Timer />
            <Button onClick={loadRoute}>Load Route from File</Button>
            <Button onClick={onToggle}>Show Map</Button>
            {isOpen && (
              <Box>
                <MapComponent />
              </Box>
            )}
          </VStack>
        </Grid>
      </Box>
    </GlobalContext.Provider>
  );
};

