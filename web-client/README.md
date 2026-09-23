# Wspólny interfejs Czatbox TT

Katalog `public` zawiera aktualne zasoby interfejsu ładowanego przez aplikację desktopową z Cloudflare. Minutnik, Giveaway i lewy panel narzędzi są aktywowane wyłącznie w trybie `platform=desktop`.

Ta kopia zapisuje stan interfejsu w repozytorium. Sam push nie wdraża zasobów na Cloudflare.

Backend Workera i konfiguracja wdrożenia znajdują się w `backend/`. Worker zapisuje bezpieczny dziennik prób rejestracji w tabeli `registration_events` (bez haseł i tokenów), a awaria audytu nie blokuje rejestracji.
