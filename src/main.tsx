import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ConfigProvider } from "antd";
import { ThemeProvider } from "./theme/ThemeContext";
import { px2remTransformer, StyleProvider } from "@ant-design/cssinjs";
import { AuthProvider } from "./context/AuthContext";

const px2rem = px2remTransformer({
  rootValue: 16,
  precision: 5,
  mediaQuery: true,
});

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

root.render(
  <StyleProvider hashPriority="high" transformers={[px2rem]}>
    <StrictMode>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "Inter, sans-serif",
            colorPrimary: "#fe6000",
            colorBgBase: "#0f172a",
            colorTextBase: "#ffffff",
            colorBgContainer: "#1e293b",
          },
        }}
      >
        <AuthProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </AuthProvider>
      </ConfigProvider>
    </StrictMode>
  </StyleProvider>
)
