- [ ] EXTINF lines that have commas in their title will have a bad title because we are parsing the title based on the last comma. For example:
   `#EXTINF:-1 tvg-id="" tvg-name="LAT - Tangos, tequilas, y algunas mentiras (2023)" tvg-logo="" group-title="VOD - LATINO [ES]",LAT - Tangos, tequilas, y algunas mentiras (2023) `
   will be parsed as:
   `title: "y algunas mentiras (2023)"`

- [ ] Implement session and refactor settings page to use session
- [ ] Implement same playlist update ie check if entry exists and update or create
