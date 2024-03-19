import {
  Box,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";

import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { useMemo, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import { Button } from "@material-tailwind/react";

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: `${import.meta.env.VITE_GOOGLE_API_KEY}`,
    libraries: ["places"],
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [location, setlocation] = useState("You are in");
  const [center, setCenter] = useState({ lat: 42.8584, lng: 2.2945 });
  const originRef = useRef();

  const memoizedCenter = useMemo(() => center, [center]);

  if (!isLoaded) {
    return (
      <div
        style={{
          padding: "2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ClipLoader size={50} color="red" />
      </div>
    );
  }

  function clearRoute() {
    setlocation("");
    
  }

  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      h="100vh"
      w=""
    >
      <Box position="absolute" left={0} top={0} h="100%" w="100%">
        {/* Google Map Box */}
        <GoogleMap
          center={memoizedCenter}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker position={memoizedCenter} />
        </GoogleMap>
      </Box>
      <Box
        p={4}
        borderRadius="lg"
        m={4}
        bgColor="white"
        shadow="base"
        zIndex="1"
      >
        <HStack
          spacing={2}
          justifyContent="space-between"
          className="flex-wrap"
        >
          <ButtonGroup>
            <Button
              className="bg-[#00d870a0] text-md"
              type="submit"
              onClick={async () => {
                if ("geolocation" in navigator) {
                  navigator.geolocation.getCurrentPosition(async function (
                    position
                  ) {
                    const { latitude, longitude } = position.coords;

                    const apiKey = `${import.meta.env.VITE_GOOGLE_API_KEY}`;

                    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

                    setCenter({ lat: latitude, lng: longitude });

                    try {
                      const response = await fetch(url);
                      const data = await response.json();

                      if (data.status === "OK" && data.results.length > 0) {
                        const address = data.results[0].formatted_address;
                        setlocation("You are in: " + address);
                      } else {
                        alert("No address found for the provided coordinates");
                        return "No address found for the provided coordinates";
                      }
                    } catch (error) {
                      alert("Error fetching address:", error);
                      console.error("Error fetching address:", error);
                      return "Error";
                    }
                  });
                } else {
                  alert("Geolocation is not supported by this browser.");
                }
              }}
            >
              Get Your Location
            </Button>

            <IconButton
              aria-label="center back"
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>

        <HStack spacing={4} mt={2} justifyContent="space-between">
          <Text ref={originRef}>{location} </Text>
        </HStack>
      </Box>
    </Flex>
  );
}

export default App;
