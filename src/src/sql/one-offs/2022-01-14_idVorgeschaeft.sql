SELECT
  idVorgeschaeft
FROM
  geschaefte
ORDER BY
  idVorgeschaeft;

-- contains null values and empty strings!
-- list non integers: https://til.simonwillison.net/sqlite/text-value-is-integer-or-float
SELECT
  idVorgeschaeft
FROM
  geschaefte
WHERE
  cast(cast(idVorgeschaeft AS integer) AS text) != idVorgeschaeft;

-- create test data
INSERT INTO geschaefte (idVorgeschaeft)
  VALUES (''), ('test');

-- 12 datasets
-- remove values that are not integers
-- TODO: do this before updating to tauri or do it on every app start?
UPDATE
  geschaefte
SET
  idVorgeschaeft = NULL
WHERE
  cast(cast(idVorgeschaeft AS integer) AS text) != idVorgeschaeft;

