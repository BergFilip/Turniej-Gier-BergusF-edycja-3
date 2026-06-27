# Grafa Stream Overlay

Responsywna aplikacja webowa inspirowana overlayem teleturnieju gamingowego. Ma czarno-czerwony neonowy motyw, pikselowe ramki, widok główny dla streamu oraz panel administracyjny zapisujący stan w `localStorage`.

## Technologie

- React + TypeScript + Vite
- Tailwind CSS
- Zustand
- localStorage

## Uruchomienie

```bash
npm install
npm run dev
```

Widoki:

- `http://127.0.0.1:5173/` - overlay teleturnieju
- `http://127.0.0.1:5173/admin` - panel administracyjny

`npm run dev` buduje aplikację i serwuje statyczny `dist`, dzięki czemu widok jest taki sam jak produkcyjny. Surowy serwer Vite jest dostępny jako `npm run vite:dev`.

## Panel administracyjny

Panel pozwala edytować nazwy drużyn, wyniki, graczy, avatar/kamera URL, rundę, timer, kategorie, pytanie, odpowiedzi, poprawną odpowiedź, aktywną drużynę oraz nagłówek gry. Zmiany zapisują się w `localStorage` i są od razu widoczne w drugim oknie lub karcie przeglądarki.

## Produkcja

```bash
npm run build
```
