# Kanał postów Patreon dla Czatbox TT

Worker pośredniczy między aplikacją a oficjalnym API Patreon. Sekret dostępu pozostaje w Cloudflare i nie jest pakowany z aplikacją.

## Konfiguracja

1. Utwórz klienta API w panelu Patreon i uzyskaj token twórcy z uprawnieniem `campaigns.posts`.
2. Identyfikator kampanii Czatbox TT (`15802701`) jest zapisany jako `PATREON_CAMPAIGN_ID`.
3. W katalogu Workera uruchom `npx wrangler secret put PATREON_ACCESS_TOKEN` i wklej token w bezpiecznym pytaniu CLI.
4. Uruchom `npx wrangler deploy`.
5. Publiczny adres Workera jest wpisany w `web-client/public/patreon-feed-config.js`.

Nie wpisuj tokenu do `wrangler.jsonc`, plików aplikacji, historii Git ani wiadomości.
