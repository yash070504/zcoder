import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { LANGUAGE_VERSIONS } from "../../constants";
import { FiChevronDown } from "react-icons/fi";

const languages = Object.entries(LANGUAGE_VERSIONS);
const ACTIVE_COLOR = "#a5b4fc";

const LanguageSelector = ({ language, onSelect }) => {
  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Menu isLazy>
        <MenuButton
          as={Button}
          rightIcon={<FiChevronDown />}
          size="sm"
          bg="rgba(255, 255, 255, 0.08)"
          color="#f8fafc"
          border="1px solid rgba(255, 255, 255, 0.15)"
          borderRadius="8px"
          _hover={{ bg: "rgba(255, 255, 255, 0.14)", borderColor: "#6366f1" }}
          _active={{ bg: "rgba(99, 102, 241, 0.2)" }}
          textTransform="capitalize"
        >
          {language}
        </MenuButton>
        <MenuList 
          bg="#0f172a" 
          borderColor="rgba(255, 255, 255, 0.1)" 
          boxShadow="0 10px 30px rgba(0, 0, 0, 0.7)"
          zIndex="10"
          p={1}
          borderRadius="12px"
        >
          {languages.map(([lang, version]) => (
            <MenuItem
              key={lang}
              color={lang === language ? ACTIVE_COLOR : "#cbd5e1"}
              bg={lang === language ? "rgba(99, 102, 241, 0.2)" : "transparent"}
              borderRadius="6px"
              _hover={{
                color: "#fff",
                bg: "rgba(255, 255, 255, 0.08)",
              }}
              onClick={() => onSelect(lang)}
              fontSize="sm"
            >
              <Text as="span" textTransform="capitalize" fontWeight={lang === language ? "700" : "500"}>
                {lang}
              </Text>
              &nbsp;
              <Text as="span" color="gray.500" fontSize="xs">
                ({version})
              </Text>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default LanguageSelector;
