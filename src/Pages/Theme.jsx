
import { extendTheme } from "@chakra-ui/react";
import { inputAnatomy } from "@chakra-ui/anatomy";
import { selectAnatomy } from "@chakra-ui/anatomy"; // Thêm import cho selectAnatomy
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

// Tạo helpers từ inputAnatomy
const { definePartsStyle: defineInputPartsStyle, defineMultiStyleConfig: defineInputMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

// Tạo helpers từ selectAnatomy
const { definePartsStyle: defineSelectPartsStyle, defineMultiStyleConfig: defineSelectMultiStyleConfig } =
  createMultiStyleConfigHelpers(selectAnatomy.keys);

// Định nghĩa styles cho Stepper
const stepperTheme = {
  parts: ["step", "indicator", "separator", "title", "description"],
  baseStyle: {
    step: {
      display: "flex",
      alignItems: "center",
      color: "gray.800",
      _dark: {
        color: "white",
      },
    },
    indicator: {
      width: "32px",
      height: "32px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: "2px",
      borderColor: "var(--primary-color)",
      borderRadius: "50%",
      bg: "transparent",
      color: "gray.800",
      _activeStep: {
        bg: "var(--primary-color)",
        color: "var(--text-color)",
      },
      _completedStep: {
        bg: "var(--primary-color)",
        color: "var(--text-color)",
      },
      _dark: {
        borderColor: "gray.600",
        color: "white",
        _activeStep: {
          bg: "var(--primary-color)",
          color: "var(--text-color)",
        },
        _completedStep: {
          bg: "var(--primary-color)",
          color: "var(--text-color)",
        },
      },
    },
    separator: {
      flex: 1,
      borderBottomWidth: "2px",
      borderColor: "var(--primary-color)",
      mx: "4",
      _dark: {
        borderColor: "gray.600",
      },
    },
    title: {
      fontSize: "sm",
      fontWeight: "bold",
      color: "var(--primary-color)",
      _dark: {
        color: "white",
      },
    },
    description: {
      fontSize: "xs",
      color: "gray.600",
      _dark: {
        color: "gray.400",
      },
    },
  },
  defaultProps: {
    variant: "dark",
  },
};

// Định nghĩa base style cho Input
const inputTheme = defineInputMultiStyleConfig({
  baseStyle: defineInputPartsStyle({
    field: {
      border: "1px solid",
      borderColor: "var(--primary-color)",
      borderRadius: "md",
      bg: "transparent",
      color: "gray.800",
      _dark: {
        color: "var(--text-color)",
      },
      _hover: {
        borderColor: "var(--hover-color)",
      },
      _focus: {
        borderColor: "var(--primary-color)",
        boxShadow: `0 0 0 1px var(--primary-color)`,
      },
      _focusVisible: {
        borderColor: "var(--primary-color) !important",
        boxShadow: `0 0 0 1px var(--primary-color) !important`,
      },
      _placeholder: {
        color: "gray.500",
        _dark: {
          color: "var(--hover-color)",
        },
      },
    },
  }),
});

// Định nghĩa base style cho Select
const selectTheme = defineSelectMultiStyleConfig({
  baseStyle: defineSelectPartsStyle({
    field: {
      border: "1px solid var(--primary-color)", // Đặt border theo yêu cầu
      borderRadius: "0", // Đặt borderRadius = 0 theo yêu cầu
      bg: "transparent",
      color: "gray.800",
      _dark: {
        color: "var(--text-color)", // Màu chữ trắng trong dark mode
      },
      _hover: {
        borderColor: "var(--hover-color)", // Màu viền khi hover
      },
      _focus: {
        borderColor: "var(--primary-color)",
        boxShadow: `0 0 0 1px var(--primary-color)`, // Hiệu ứng focus
      },
      _focusVisible: {
        borderColor: "var(--primary-color) !important",
        boxShadow: `0 0 0 1px var(--primary-color) !important`,
      },
      _placeholder: {
        color: "gray.500",
        _dark: {
          color: "var(--hover-color)",
        },
      },
    },
    icon: {
      color: "gray.500",
      _dark: {
        color: "var(--hover-color)",
      },
    },
  }),
});

// Định nghĩa theme cho Tabs
const tabsTheme = {
  baseStyle: {
    tab: {
      color: "gray.600",
      fontWeight: "medium",
      transition: "all 0.3s ease",
      _hover: {
        color: "var(--hover-color)",
      },
      _dark: {
        color: "gray.300",
        _hover: {
          color: "white",
        },
      },
    },
    tablist: {
      borderBottom: "1px solid",
      borderColor: "gray.200",
      _dark: {
        borderColor: "gray.700",
      },
    },
    tabpanel: {
      p: 0,
    },
  },
  variants: {
    line: {
      tab: {
        _selected: {
          color: "var(--primary-color)",
          borderBottom: "2px solid",
          borderColor: "var(--primary-color)",
          bg: "transparent",
          boxShadow: "none",
        },
        _active: {
          color: "var(--primary-color)",
          borderBottom: "2px solid",
          borderColor: "var(--primary-color)",
          bg: "transparent",
        },
        _focus: {
          boxShadow: "none",
        },
      },
    },
  },
  defaultProps: {
    variant: "line",
  },
};

const theme = extendTheme({
  colors: {
    primary: {
      500: "#000000",
    },
    blue: {
      500: "#3182ce",
    },
    gray: {
      50: "#f7fafc",
      100: "#edf2f7",
      200: "#e2e8f0",
      300: "#cbd5e0",
      400: "#a0aec0",
      500: "#718096",
      600: "#4a5568",
      700: "#2d3748",
      800: "#1a202c",
      900: "#171923",
    },
  },
  fonts: {
    heading: "HelveticaNeue, sans-serif",
    body: "HelveticaNeue, sans-serif",
    mono: "Menlo, monospace",
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "none",
        fontWeight: "bold",
        color: "--primary-color",
      },
      variants: {
        outline: {
          border: "1px solid",
          borderColor: "var(--primary-color)",
          color: "var(--primary-color)",
          backgroundColor: "transparent",
          _hover: {
            backgroundColor: "var(--primary-color)",
            color: "var(--text-color)",
            transition: "all 0.3s ease",
          },
          _active: {
            backgroundColor: "var(--primary-color)",
            color: "var(--text-color)",
            transition: "all 0.2s ease",
          },
        },
        solid: {
          backgroundColor: "var(--primary-color)",
          color: "var(--text-color)",
          _hover: {
            backgroundColor: "var(--hover-color)",
            color: "var(--text-color)",
          },
          _active: {
            backgroundColor: "var(--primary-color)",
          },
        },
        bordered: {
          border: "2px solid var(--primary-color)",
          borderColor: "var(--primary-color)",
          color: "var(--primary-color)",
          backgroundColor: "transparent",
          _hover: {
            backgroundColor: "var(--primary-color)",
            color: "var(--text-color)",
          },
          _active: {
            backgroundColor: "var(--primary-color)",
            color: "var(--text-color)",
          },
        },
        ghost: {
          color: "gray.600",
          _hover: {
            bg: "gray.100",
            color: "gray.800",
          },
          _active: {
            bg: "gray.200",
            color: "gray.900",
          },
          _dark: {
            color: "gray.300",
            _hover: {
              bg: "gray.700",
              color: "white",
            },
            _active: {
              bg: "gray.600",
              color: "white",
            },
          },
        },
        icon: {
          backgroundColor: "transparent",
          border: "none",
          color: "gray.600",
          svg: {
            fontSize: "1.25rem",
          },
          _hover: {
            color: "gray.800",
          },
          _active: {
            color: "var(--primary-color)",
          },
          _dark: {
            color: "gray.300",
            _hover: {
              color: "white",
            },
            _active: {
              color: "var(--primary-color)",
            },
          },
        },
      },
    },
    Checkbox: {
      baseStyle: {
        control: {
          border: "1px solid",
          borderColor: "gray.300",
          _checked: {
            bg: "var(--primary-color)",
            borderColor: "var(--primary-color)",
            color: "var(--text-color)",
          },
          _hover: {
            borderColor: "var(--hover-color)",
          },
          _dark: {
            borderColor: "gray.600",
            _checked: {
              bg: "var(--primary-color)",
              borderColor: "var(--primary-color)",
              color: "var(--text-color)",
            },
          },
        },
        label: {
          color: "gray.800",
          _dark: {
            color: "white",
          },
        },
      },
    },
    MenuItem: {
      baseStyle: {
        color: "gray.800",
        _active: {
          backgroundColor: "var(--primary-color)",
          color: "var(--text-color)",
        },
        _hover: {
          bg: "gray.100",
          color: "gray.900",
        },
        _dark: {
          color: "gray.300",
          _hover: {
            bg: "gray.700",
            color: "white",
          },
        },
      },
    },
    Stepper: stepperTheme,
    Input: inputTheme,
    Select: selectTheme, // Thêm selectTheme vào components
    Tabs: tabsTheme,
    Link: {
      baseStyle: {
        color: "blue.500",
        textDecoration: "none",
        _hover: {
          textDecoration: "underline",
          color: "blue.600",
        },
        _focus: {
          outline: "none",
        },
        _dark: {
          color: "blue.400",
          _hover: {
            color: "blue.300",
          },
        },
      },
    },
  },
  styles: {
    global: {
      ":root": {
        "--primary-color": "#000000",
        "--hover-color": "#333333",
        "--text-color": "#FFFFFF",
        "--link-nav": "#f5a623",
      },
      body: {
        bg: "gray.50",
        color: "--primary-color",
        _dark: {
          bg: "gray.900",
          color: "white",
        },
      },
      ".swiper-pagination-bullet": {
        bg: "var(--primary-color)",
        w: "12px",
        h: "12px",
        borderRadius: "50%",
        transition: "background-color 0.3s ease",
      },
      ".swiper-pagination-bullet-active": {
        bg: "var(--hover-color)",
      },
    },
    config: {
      toastPosition: "top-right",
    },
  },
});

export default theme;