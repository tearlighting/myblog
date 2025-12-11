import { auroraPalette, cyberPalette, monoPalette, sakuraPalette, sunsetPalette } from "@/constants";
import { createThemeManager } from "./css-in-js";

export const themeManager = createThemeManager()
    .register({
        value: "aurora",
        palette: auroraPalette,
        labelKey: "theme.aurora",
    })
    .register({
        value: "sakura",
        palette: sakuraPalette,
        labelKey: "theme.sakura",
    }).register({
        value: "cyber",
        palette: cyberPalette,
        labelKey: "theme.cyber",
    }).register({
        value: "sunset",
        palette: sunsetPalette,
        labelKey: "theme.sunset",
    })
    .register({
        value: "mono",
        palette: monoPalette,
        labelKey: "theme.mono",
    })
