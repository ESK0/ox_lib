import { Box, Spacer, Flex, Stack, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useNuiEvent } from "../../../hooks/useNuiEvent";
import { debugData } from "../../../utils/debugData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface MenuSettings {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  title: string;
  items: Array<{ label: string; value: string | string[] }>;
}

debugData<MenuSettings>([
  {
    action: "setMenu",
    data: {
      //   position: "bottom-left",
      title: "Vehicle garage",
      items: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Vehicle class", value: ["Nice", "Super nice", "Extra nice"] },
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Vehicle class", value: ["Nice", "Super nice", "Extra nice"] },
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Vehicle class", value: ["Nice", "Super nice", "Extra nice"] },
      ],
    },
  },
]);

const ListMenu: React.FC = () => {
  const [menu, setMenu] = useState<MenuSettings>({
    position: "top-left",
    title: "",
    items: [],
  });
  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(false);
  const listRefs = useRef<Array<HTMLDivElement | null>>([]);

  const moveMenu = (e: KeyboardEvent) => {
    switch (e.code) {
      case "ArrowDown":
        setSelected((selected) => {
          if (selected >= menu.items.length - 1) return selected;
          listRefs.current[selected + 1]?.focus();
          return selected + 1;
        });
        break;
      case "ArrowUp":
        setSelected((selected) => {
          if (selected <= 0) return selected;
          listRefs.current[selected - 1]?.focus();
          return selected - 1;
        });
        break;
    }
  };

  useEffect(() => {
    if (!visible) return document.removeEventListener("keyup", moveMenu);

    document.addEventListener("keyup", moveMenu);
  }, [visible]);

  useNuiEvent("setMenu", (data: MenuSettings) => {
    if (!data.position) data.position = "top-left";
    setMenu(data);
    setVisible(true);
  });

  return (
    <>
      <Box
        width="sm"
        height="fit-content"
        maxHeight={480}
        overflow="hidden"
        borderRadius="md"
        bg="#141517"
        position="absolute"
        fontFamily="Nunito"
        mt={menu.position === "top-left" || menu.position === "top-right" ? 5 : 0}
        ml={menu.position === "top-left" || menu.position === "bottom-left" ? 5 : 0}
        mr={menu.position === "top-right" || menu.position === "bottom-right" ? 5 : 0}
        mb={menu.position === "bottom-left" || menu.position === "bottom-right" ? 5 : 0}
        right={menu.position === "top-right" ? 1 : undefined}
        left={menu.position === "bottom-left" ? 1 : undefined}
        bottom={menu.position === "bottom-left" || menu.position === "bottom-right" ? 1 : undefined}
      >
        <Box p={3} textAlign="center" borderTopLeftRadius="md" borderTopRightRadius="md" bg="#25262B">
          <Text fontSize={24} textTransform="uppercase" fontWeight={300} fontFamily="Poppins">
            {menu.title}
          </Text>
        </Box>
        <Stack direction="column" p={2} overflowY="scroll">
          {menu.items.map((item, index) => (
            <Box
              bg="#25262B"
              borderRadius="md"
              tabIndex={index}
              pointerEvents="none"
              p={2}
              height="60px"
              key={`item-${index}`}
              _focus={{ bg: "#373A40", outline: "none" }}
              ref={(element) => (listRefs.current = [...listRefs.current, element])}
            >
              {Array.isArray(item.value) ? (
                <Flex justifyContent="center" alignItems="center">
                  <Stack spacing={1}>
                    <Text color="#909296" textTransform="uppercase" fontSize={12} verticalAlign="middle">
                      {item.label}
                    </Text>
                    <Text>Nice cool</Text>
                  </Stack>
                  <Spacer />
                  <FontAwesomeIcon icon="arrows-left-right" fontSize={20} color="#909296" />
                </Flex>
              ) : (
                item.label
              )}
            </Box>
          ))}
        </Stack>
      </Box>
    </>
  );
};

export default ListMenu;