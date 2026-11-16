const WeatherWidget = {
  config: {
    units: 'metric',
    cacheMinutes: 5,
    maxFractionDigits: 1,
    cookieName: 'user_weather_loc',
    cacheKey: 'user_weather_cache'
  },

  init() {
    this.container = document.getElementById('weather-widget');
    if (!this.container) return;

    this.container.style.position = 'relative';

    const savedLoc = this.getCookie(this.config.cookieName);
    if (savedLoc) {
      try {
        const loc = JSON.parse(savedLoc);
        this.currentLoc = loc;
        this.loadWeather(loc);
        return;
      } catch (e) {
        this.deleteCookie(this.config.cookieName);
      }
    }

    this.renderTrigger('[+ weather]');
  },

  renderTrigger(text, hourlyData = null) {
    const hasForecast = hourlyData && hourlyData.length > 0;
    const arrow = hasForecast ? ' <span id="weather-toggle-arrow">[▼]</span>' : '';

    this.container.innerHTML = `
      <div id="weather-main-row" style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
        <span id="weather-display" title="Klicken zum Ändern">${text}</span>
        ${arrow}
      </div>
      <div id="weather-dropdown" class="weather-dropdown" style="display: none;"></div>
    `;

    document.getElementById('weather-display').addEventListener('click', (e) => {
      e.stopPropagation();
      this.renderForm();
    });

    if (hasForecast) {
      const arrowEl = document.getElementById('weather-toggle-arrow');
      arrowEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleForecast(hourlyData);
      });
      
      document.getElementById('weather-main-row').addEventListener('click', (e) => {
        if (e.target.id === 'weather-display') return;
        this.toggleForecast(hourlyData);
      });
    }
  },

  toggleForecast(hourlyData) {
    const dropdown = document.getElementById('weather-dropdown');
    const arrowEl = document.getElementById('weather-toggle-arrow');
    
    if (dropdown.style.display === 'none') {
      let html = '<div class="forecast-title">24h forecast</div>';
      html += '<div class="forecast-grid">';
      
      hourlyData.forEach(item => {
        html += `
          <div class="forecast-item">
            <span class="forecast-time">${item.time}</span>
            <span class="forecast-temp">${item.temp}°</span>
            <span class="forecast-cond">${item.cond}</span>
          </div>
        `;
      });
      html += '</div>';

      dropdown.innerHTML = html;
      dropdown.style.display = 'block';
      if (arrowEl) arrowEl.textContent = '[▲]';
    } else {
      dropdown.style.display = 'none';
      if (arrowEl) arrowEl.textContent = '[▼]';
    }
  },

  renderForm() {
    const currentName = this.currentLoc ? this.currentLoc.name : '';
    this.container.innerHTML = `
      <div class="weather-form-wrapper">
        <form id="weather-form" class="weather-form">
          <input type="text" id="weather-city-input" value="${currentName}" placeholder="City..." autocomplete="off" required />
          <button type="submit" class="weather-btn">OK</button>
          <button type="button" id="weather-cancel" class="weather-btn">✕</button>
        </form>
        <div id="weather-suggestions" class="weather-suggestions" style="display: none;"></div>
      </div>
    `;

    const input = document.getElementById('weather-city-input');
    const suggestionsBox = document.getElementById('weather-suggestions');
    input.focus();
    input.select();

    let debounceTimer;
    input.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      clearTimeout(debounceTimer);

      if (query.length < 2) {
        suggestionsBox.style.display = 'none';
        suggestionsBox.innerHTML = '';
        return;
      }

      debounceTimer = setTimeout(() => {
        this.fetchSuggestions(query, suggestionsBox);
      }, 300); // 300ms Verzögerung beim Tippen
    });

    // Schließen bei Klick außerhalb
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        suggestionsBox.style.display = 'none';
      }
    }, { once: true });

    document.getElementById('weather-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const city = input.value.trim();
      if (city) {
        suggestionsBox.style.display = 'none';
        await this.searchCity(city);
      }
    });

    document.getElementById('weather-cancel').addEventListener('click', () => {
      if (this.currentLoc) {
        this.loadWeather(this.currentLoc);
      } else {
        this.renderTrigger('[+ weather]');
      }
    });
  },

  async fetchSuggestions(query, suggestionsBox) {
    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=de&format=json`;
      const res = await fetch(geoUrl);
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        suggestionsBox.style.display = 'none';
        return;
      }

      let html = '';
      data.results.forEach(place => {
        // Details wie Bundesland / Region und Land zusammenbauen
        const details = [place.admin1, place.country_code].filter(Boolean).join(', ');
        const label = details ? `${place.name} (${details})` : place.name;

        html += `<div class="suggestion-item" data-place='${JSON.stringify({
          name: place.name,
          country: place.country_code || place.country || '',
          lat: place.latitude,
          lon: place.longitude,
          timezone: place.timezone || 'auto'
        })}'>${label}</div>`;
      });

      suggestionsBox.innerHTML = html;
      suggestionsBox.style.display = 'block';

      // Klick-Event auf die Vorschläge
      suggestionsBox.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
          const locData = JSON.parse(item.getAttribute('data-place'));
          suggestionsBox.style.display = 'none';
          this.selectLocation(locData);
        });
      });
    } catch (err) {
      suggestionsBox.style.display = 'none';
    }
  },

  selectLocation(locData) {
    this.currentLoc = locData;
    this.setCookie(this.config.cookieName, JSON.stringify(locData), 365);
    this.deleteCookie(this.config.cacheKey);
    this.loadWeather(locData);
  },

  async searchCity(query) {
    this.container.innerHTML = `<span class="weather-status">searching...</span>`;

    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=de&format=json`;
      const res = await fetch(geoUrl);
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        this.renderTrigger('not found [retry]');
        return;
      }

      const place = data.results[0];
      const locData = {
        name: place.name,
        country: place.country_code || place.country || '',
        lat: place.latitude,
        lon: place.longitude,
        timezone: place.timezone || 'auto'
      };

      this.selectLocation(locData);
    } catch (err) {
      this.renderTrigger('err [retry]');
    }
  },

  async loadWeather(loc) {
    const cached = this.getCookie(this.config.cacheKey);
    if (cached) {
      try {
        const parsedCache = JSON.parse(cached);
        if (parsedCache.name === loc.name) {
          this.renderWeather(loc, parsedCache.temp, parsedCache.code, parsedCache.hourly);
          return;
        }
      } catch (e) {
        this.deleteCookie(this.config.cacheKey);
      }
    }

    this.container.innerHTML = `<span class="weather-status">loading...</span>`;
    try {
      const unitParam = this.config.units === 'imperial' ? '&temperature_unit=fahrenheit' : '';
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current_weather=true&hourly=temperature_2m,weathercode&timezone=${encodeURIComponent(loc.timezone)}${unitParam}`;

      const res = await fetch(weatherUrl);
      const data = await res.json();
      const current = data.current_weather;

      const hourlyList = this.processHourlyData(data.hourly);

      const cachePayload = {
        name: loc.name,
        temp: current.temperature,
        code: current.weathercode,
        hourly: hourlyList
      };
      this.setCookieMinutes(this.config.cacheKey, JSON.stringify(cachePayload), this.config.cacheMinutes);

      this.renderWeather(loc, current.temperature, current.weathercode, hourlyList);
    } catch (err) {
      this.renderTrigger('offline [retry]');
    }
  },

  processHourlyData(hourly) {
    if (!hourly || !hourly.time) return [];
    
    const now = new Date();
    const result = [];
    
    let startIndex = 0;
    for (let i = 0; i < hourly.time.length; i++) {
      const timeObj = new Date(hourly.time[i]);
      if (timeObj >= now) {
        startIndex = i;
        break;
      }
    }

    const formatter = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: this.config.maxFractionDigits,
      minimumFractionDigits: this.config.maxFractionDigits
    });

    for (let i = startIndex; i < startIndex + 24; i += 3) {
      if (i >= hourly.time.length) break;
      
      const timeStr = new Date(hourly.time[i]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const temp = formatter.format(hourly.temperature_2m[i]);
      const cond = this.decodeWeatherCode(hourly.weathercode[i]);

      result.push({ time: timeStr, temp, cond });
    }

    return result;
  },

  renderWeather(loc, temp, weatherCode, hourlyList) {
    const formatter = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: this.config.maxFractionDigits,
      minimumFractionDigits: this.config.maxFractionDigits
    });
    const unitSymbol = this.config.units === 'imperial' ? '°F' : '°C';
    const condition = this.decodeWeatherCode(weatherCode);
    
    const displayName = loc.country ? `${loc.name}, ${loc.country}` : loc.name;

    this.renderTrigger(`${displayName}: ${formatter.format(temp)}${unitSymbol} (${condition})`, hourlyList);
  },

  decodeWeatherCode(code) {
    if (code === 0) return 'clear';
    if (code <= 3) return 'cloudy';
    if (code <= 48) return 'fog';
    if (code <= 67) return 'rain';
    if (code <= 77) return 'snow';
    if (code <= 82) return 'showers';
    if (code >= 95) return 'storm';
    return 'mixed';
  },

  setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
  },

  setCookieMinutes(name, value, minutes) {
    const d = new Date();
    d.setTime(d.getTime() + (minutes * 60 * 1000));
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
  },

  getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  },

  deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
  }
};

document.addEventListener('DOMContentLoaded', () => WeatherWidget.init());