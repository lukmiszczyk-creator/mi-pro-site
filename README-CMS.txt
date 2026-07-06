MI-PRO – wersja z panelem CMS

Panel edycji:
/admin

Co można edytować w panelu:
- tytuł strony i opis SEO
- hero: nagłówek, opis, napisy na przyciskach, punkty
- wartości/atuty
- sekcję usług
- sekcję realizacji
- sekcję opinii technicznych i optymalizacji
- dane kontaktowe
- opis w stopce
- teksty banera cookies

Jak to działa:
1. Treści są zapisane w pliku content/site.json.
2. Panel Decap CMS edytuje ten plik.
3. Strona wczytuje content/site.json i podmienia teksty bez ruszania kodu.

Wdrożenie rekomendowane:
- GitHub + Netlify
- w Netlify włączyć Identity oraz Git Gateway
- wtedy panel /admin pozwoli logować się i zapisywać zmiany

Test lokalny CMS:
1. Zainstaluj Node.js.
2. W folderze strony uruchom:
   npx decap-server
3. W drugim terminalu uruchom prosty serwer, np.:
   python3 -m http.server 8080
4. Wejdź na:
   http://localhost:8080/admin

Uwaga:
- Bez Netlify Identity/Git Gateway panel nie będzie zapisywał zmian online.
- Dokumenty prawne są robocze i warto je sprawdzić przed publikacją.
- Jeśli podepniesz Meta Pixel / GA4 / formularz, trzeba dopisać finalne skrypty z warunkiem zgody cookies.
