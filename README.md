# Grafa Stream Overlay

Grafa Stream Overlay to responsywny overlay do prowadzenia gamingowego teleturnieju na streamie. Projekt jest inspirowany turniejem o grach „Grafa” youtubera Grafa, ale nie kopiuje go bezpośrednio: tworzy własną, czarno-czerwoną wersję oprawy z neonowym klimatem, pikselowymi ramkami i estetyką sceny esportowej.

Strona została pomyślana jako gotowy ekran do OBS-a lub przeglądarki pokazanej na transmisji. Z boku są drużyny, gracze, kamerki i duże wyniki, a w centrum pojawia się aktualny etap gry. Wszystko można kontrolować z panelu administratora, a zmiany od razu zapisują się lokalnie i są widoczne na overlayu.

## Klimat

Całość stawia na ciemne tło, czerwone światło, bordowe akcenty i mocny gamingowy charakter. UI ma wyglądać jak profesjonalna oprawa teleturnieju o grach: czytelna dla widzów, efektowna na streamie i wygodna dla prowadzącego.

## Etapy

### Etap 1: plansza 4x4

Pierwszy etap to plansza z czterema kategoriami i czterema poziomami punktów. Każde pole może zostać przypisane do lewej albo prawej drużyny, co pozwala szybko zaznaczać poprawne odpowiedzi kolorem drużyny. Etap obsługuje też kradzieże pytań, bonus bingo oraz timery drużyn.

Dodatkowo jedno wybrane pole może być pytaniem specjalnym spoza kategorii. Na planszy wygląda normalnie, ale po wyświetleniu pokazuje inną, przygotowaną wcześniej treść.

### Etap 2: podpowiedzi

Drugi etap opiera się na zgadywaniu gry po czterech kolejnych podpowiedziach. Podpowiedzi mogą zawierać tekst, zdjęcia albo filmy z URL-a. Im więcej wskazówek zostanie odsłoniętych, tym mniej punktów można zdobyć.

### Etap 3: draft gier

Trzeci etap to draft 12 kart z grami. Drużyny banują po jednej karcie, a potem wybierają pozostałe naprzemiennie. Po wyborze karty prowadzący może przypisać jej punktację i wyświetlić pytanie przygotowane specjalnie do tej gry.

## Panel prowadzącego

Panel administracyjny pozwala sterować całym teleturniejem bez backendu. Można zmieniać nazwy drużyn, wyniki, graczy, kamerki, aktualny etap, pytania, podpowiedzi, punktację, bany, wybory kart i widoczność pytań. Wszystko działa lokalnie w przeglądarce, więc nadaje się do prowadzenia wydarzenia bez dodatkowej infrastruktury.

## Widoki

- `/` - overlay dla streamu
- `/admin` - panel prowadzącego

## Uruchomienie

```bash
npm install
npm run dev
```

Po uruchomieniu overlay jest dostępny pod adresem `http://127.0.0.1:5173/`, a panel prowadzącego pod `http://127.0.0.1:5173/admin`.
