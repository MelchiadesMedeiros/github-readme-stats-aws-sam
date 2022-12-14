import * as dotenv from "dotenv";
import { renderWakatimeCard } from "../src/cards/wakatime-card.js";
import {
  clampValue,
  CONSTANTS,
  parseArray,
  parseBoolean,
  renderError,
} from "../src/common/utils.js";
import { fetchWakatimeStats } from "../src/fetchers/wakatime-fetcher.js";
import { isLocaleAvailable } from "../src/translations.js";

dotenv.config();

export default async (query) => {
  const {
    username,
    title_color,
    icon_color,
    hide_border,
    line_height,
    text_color,
    bg_color,
    theme,
    cache_seconds,
    hide_title,
    hide_progress,
    custom_title,
    locale,
    layout,
    langs_count,
    hide,
    api_domain,
    range,
    border_radius,
    border_color,
  } = query;

  if (locale && !isLocaleAvailable(locale)) {
    throw new Error(renderError("Something went wrong", "Language not found"));
  }

  try {
    const stats = await fetchWakatimeStats({ username, api_domain, range });

    let cacheSeconds = clampValue(
      parseInt(cache_seconds || CONSTANTS.FOUR_HOURS, 10),
      CONSTANTS.FOUR_HOURS,
      CONSTANTS.ONE_DAY,
    );

    if (!cache_seconds) {
      cacheSeconds = CONSTANTS.FOUR_HOURS;
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": `public, max-age=${cacheSeconds}`,
      },
      body: renderWakatimeCard(stats, {
        custom_title,
        hide_title: parseBoolean(hide_title),
        hide_border: parseBoolean(hide_border),
        hide: parseArray(hide),
        line_height,
        title_color,
        icon_color,
        text_color,
        bg_color,
        theme,
        hide_progress,
        border_radius,
        border_color,
        locale: locale ? locale.toLowerCase() : null,
        layout,
        langs_count,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": `no-cache, no-store, must-revalidate`,
      },
      body: renderError(err.message, err.secondaryMessage)
    };
  }
};
