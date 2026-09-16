# Lönekoll – media

Lägg appens annonsfilm här så visas den automatiskt i "annonsspelaren" på
`/lonekoll/` och `/sv/lonekoll/`:

- `promo.mp4` – vertikal (9:16) MP4 med H.264. Håll den under ~25 MB.
- `promo-poster.jpg` – valfri stillbild som visas innan uppspelning.

Sidan gör ett HEAD-anrop mot `promo.mp4`; finns filen visas spelaren, annars
döljs hela sektionen. Ingen kod behöver ändras.
