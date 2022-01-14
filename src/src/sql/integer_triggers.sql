-- ensure only integers are inserted
-- to prevent rust from crashing (https://github.com/launchbadge/sqlx/issues/1629)
-- https://til.simonwillison.net/sqlite/text-value-is-integer-or-float
--
-- TODO: extend to all integer fields in all tables?
CREATE TRIGGER IF NOT EXISTS geschaefte_idVorgeschaeft_insert
  AFTER INSERT ON geschaefte
  WHEN cast (cast(new.idVorgeschaeft AS integer
) AS text) != new.idVorgeschaeft
BEGIN
  UPDATE geschaefte SET idVorgeschaeft = NULL
WHERE
  idGeschaeft = new.idGeschaeft;

END;

CREATE TRIGGER IF NOT EXISTS geschaefte_idVorgeschaeft_update
  AFTER UPDATE ON geschaefte
  WHEN cast (cast(new.idVorgeschaeft AS integer
) AS text) != new.idVorgeschaeft
BEGIN
  UPDATE geschaefte SET idVorgeschaeft = NULL
WHERE
  idGeschaeft = new.idGeschaeft;

END;

