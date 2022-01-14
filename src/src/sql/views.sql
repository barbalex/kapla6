-- this view ensures integer columns NEVER contain string values
-- instead they are replaced with null
-- reason: prevent rust/sqlx erroring on query
-- https://github.com/launchbadge/sqlx/issues/1629
DROP VIEW IF EXISTS v_geschaefte;

CREATE VIEW v_geschaefte AS
SELECT
  abteilung,
  aktennummer,
  aktenstandort,
  ausloeser,
  datumAusgangAwel,
  datumEingangAwel,
  details,
  entscheidAwel,
  entscheidBdv,
  entscheidBvv,
  entscheidKr,
  entscheidRrb,
  fristAbteilung,
  fristAmtschef,
  fristAwel,
  fristDirektion,
  fristMitarbeiter,
  gegenstand,
  geschaeftsart,
  idGeschaeft,
  CASE WHEN cast(cast(idVorgeschaeft AS integer) AS text) != idVorgeschaeft THEN
    NULL
  ELSE
    idVorgeschaeft
  END AS idVorgeschaeft,
  mutationsdatum,
  mutationsperson,
  naechsterSchritt,
  ort,
  parlVorstossStufe,
  parlVorstossTyp,
  parlVorstossZustaendigkeitAwel,
  rechtsmittelInstanz,
  rechtsmittelErledigung,
  rechtsmittelEntscheidNr,
  rechtsmittelEntscheidDatum,
  rechtsmittelTxt,
  status,
  verantwortlich,
  vermerk,
  vermerkIntern,
  zustaendigeDirektion
FROM
  geschaefte
ORDER BY
  idGeschaeft DESC;

-- does not work because sqlx sets integer column values to null
