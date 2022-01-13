import { types, flow } from 'mobx-state-tree'
import uniq from 'lodash/uniq'

import App from './App'
import Geschaefte from './Geschaefte'
import GeschaefteKontakteIntern from './GeschaefteKontakteIntern'
import GeschaefteKontakteExtern from './GeschaefteKontakteExtern'
import Pages from './Pages'
import Table from './Table'
import getDropdownOptions from '../src/getDropdownOptions'

const store = () =>
  types
    .model({
      fetching: types.optional(types.boolean, false),
      app: types.optional(App, {}),
      dirty: types.optional(types.boolean, false),
      geschaefte: types.optional(Geschaefte, {}),
      geschaefteKontakteIntern: types.optional(GeschaefteKontakteIntern, {}),
      geschaefteKontakteExtern: types.optional(GeschaefteKontakteExtern, {}),
      pages: types.optional(Pages, {}),
      table: types.optional(Table, {}),
      location: types.optional(
        types.array(types.union(types.string, types.integer)),
        ['geschaefte'],
      ),
      errors: types.array(types.string),
    })
    .actions((self) => ({
      setFetching(val) {
        self.fetching = val
      },
      setLocation(location) {
        self.location = location
      },
      navigateToGeschaeftPdf() {
        self.location = ['geschaeftPdf']
      },
      /*
       * GESCHAEFT
       */
      rechtsmittelErledigungOptionsGet: flow(function* () {
        let rechtsmittelErledigungOptions = []
        try {
          rechtsmittelErledigungOptions = yield getDropdownOptions(
            self,
            'rechtsmittelErledigung',
          )
        } catch (error) {
          return
        }
        self.geschaefte.rechtsmittelErledigungOptions =
          rechtsmittelErledigungOptions
      }),
      parlVorstossTypOptionsGet: flow(function* () {
        let parlVorstossTypOptions = []
        try {
          parlVorstossTypOptions = yield getDropdownOptions(
            self,
            'parlVorstossTyp',
          )
        } catch (error) {
          return
        }
        self.geschaefte.parlVorstossTypOptions = parlVorstossTypOptions
      }),
      statusOptionsGet: flow(function* () {
        let statusOptions = []
        try {
          statusOptions = yield getDropdownOptions(self, 'status')
        } catch (error) {
          return
        }
        self.geschaefte.statusOptions = statusOptions
      }),
      faelligeStatiOptionsGet: flow(function* () {
        let options = []
        try {
          options = yield self.app.db.select(
            `
            SELECT
              status
            FROM
              status
            WHERE
              geschaeftKannFaelligSein = 1`,
          )
        } catch (error) {
          return self.addErrorMessage(error.message)
        }
        self.geschaefte.setFaelligeStatiOptions(
          options.map((res) => res.status),
        )
      }),
      geschaeftsartOptionsGet: flow(function* () {
        let geschaeftsartOptions = []
        try {
          geschaeftsartOptions = yield getDropdownOptions(self, 'geschaeftsart')
        } catch (error) {
          return
        }
        self.geschaefte.geschaeftsartOptions = geschaeftsartOptions
      }),
      aktenstandortOptionsGet: flow(function* () {
        let aktenstandortOptions = []
        try {
          aktenstandortOptions = yield getDropdownOptions(self, 'aktenstandort')
        } catch (error) {
          return
        }
        self.geschaefte.aktenstandortOptions = aktenstandortOptions
      }),
      interneOptionsGet: flow(function* () {
        let interneOptions = []
        try {
          interneOptions = yield self.app.db.select(
            'SELECT * FROM interne ORDER BY kurzzeichen',
          )
        } catch (error) {
          return self.addErrorMessage(error.message)
        }
        self.geschaefte.interneOptions = interneOptions
      }),
      externeOptionsGet: flow(function* () {
        let externeOptions = []
        try {
          externeOptions = yield self.app.db.select(
            `
            SELECT
              *
            FROM
              externe
            ORDER BY
              name,
              vorname`,
          )
        } catch (error) {
          return self.addErrorMessage(error.message)
        }
        self.geschaefte.externeOptions = externeOptions
      }),
      rechtsmittelInstanzOptionsGet: flow(function* () {
        let rechtsmittelInstanzOptions = []
        try {
          rechtsmittelInstanzOptions = yield getDropdownOptions(
            self,
            'rechtsmittelInstanz',
          )
        } catch (error) {
          return
        }
        self.geschaefte.rechtsmittelInstanzOptions = rechtsmittelInstanzOptions
      }),
      abteilungOptionsGet: flow(function* () {
        let abteilungOptions = []
        try {
          abteilungOptions = yield getDropdownOptions(self, 'abteilung')
        } catch (error) {
          return
        }
        self.geschaefte.abteilungOptions = abteilungOptions
      }),
      gekoNewCreate: flow(function* (idGeschaeft, gekoNr) {
        let geko
        try {
          yield self.app.db.execute(
            `INSERT INTO geko (idGeschaeft, gekoNr) VALUES (${idGeschaeft}, '${gekoNr}')`,
          )
        } catch (error) {
          return self.addErrorMessage(error.message)
        }
        // return full dataset
        try {
          geko = yield self.app.db.select(
            `
              SELECT
                *
              FROM
                geko
              WHERE
                idGeschaeft = ${idGeschaeft} AND
                gekoNr = '${gekoNr}'`,
          )[0]
        } catch (error) {
          return self.addErrorMessage(error.message)
        }
        self.geschaefte.geko.unshift(geko[0])
      }),
      gekoRemove: flow(function* (idGeschaeft, gekoNr) {
        try {
          yield self.app.db.execute(
            `
              DELETE FROM
                geko
              WHERE
                idGeschaeft = ${idGeschaeft} AND
                gekoNr = '${gekoNr}'`,
          )
        } catch (error) {
          return self.addErrorMessage(error.message)
        }
        self.geschaefte.geko = self.geschaefte.geko.filter(
          (g) => g.idGeschaeft !== idGeschaeft || g.gekoNr !== gekoNr,
        )
      }),
      changeGekoInDb(idGeschaeft, gekoNr, field, value) {
        // no need to do something on then
        // ui was updated on GEKO_CHANGE_STATE
        try {
          self.app.db.execute(
            `
            UPDATE
              geko
            SET
              ${field} = ${value === null ? null : `'${value}'`},
            WHERE
              idGeschaeft = ${idGeschaeft} AND
              gekoNr = '${gekoNr}'`,
          )
        } catch (error) {
          self.addErrorMessage(error.message)
        }
      },
      linkNewCreate: flow(function* (idGeschaeft, url) {
        try {
          yield self.app.db.execute(
            `
              INSERT INTO
                links (idGeschaeft, url)
              VALUES
                (${idGeschaeft}, '${url}')`,
          )
        } catch (error) {
          return self.addErrorMessage(error.message)
        }
        self.geschaefte.links.unshift({ idGeschaeft, url })
      }),
      linkRemove: flow(function* (idGeschaeft, url) {
        try {
          yield self.app.db.execute(
            `
              DELETE FROM
                links
              WHERE
                idGeschaeft = ${idGeschaeft} AND
                url = '${url}'`,
          )
        } catch (error) {
          return self.addErrorMessage(error.message)
        }
        self.linkDelete(idGeschaeft, url)
      }),
      linkDelete(idGeschaeft, url) {
        self.geschaefte.links = self.geschaefte.links.filter(
          (l) => l.idGeschaeft !== idGeschaeft || l.url !== url,
        )
      },
      getGeschaefteKontakteExtern: flow(function* () {
        const { app } = self
        let geschaefteKontakteExtern
        try {
          geschaefteKontakteExtern = yield app.db.select(
            'SELECT * FROM geschaefteKontakteExtern',
          )
        } catch (error) {
          self.addErrorMessage(error.message)
        }
        self.geschaefteKontakteExtern.geschaefteKontakteExtern =
          geschaefteKontakteExtern
      }),
      geschaeftKontaktExternNewCreate: flow(function* (idGeschaeft, idKontakt) {
        const { app } = self
        let geschaeftKontaktExtern
        try {
          yield app.db.execute(
            `
              INSERT INTO
                geschaefteKontakteExtern (idGeschaeft, idKontakt)
              VALUES
                (${idGeschaeft}, ${idKontakt})`,
          )
        } catch (error) {
          return self.addErrorMessage(error.message)
        }
        // return full object
        try {
          geschaeftKontaktExtern = yield app.db.select(
            `
              SELECT
                *
              FROM
                geschaefteKontakteExtern
              WHERE
                idGeschaeft = ${idGeschaeft}
                AND idKontakt = ${idKontakt}`,
          )[0]
        } catch (error) {
          return self.addErrorMessage(error.message)
        }
        self.geschaefteKontakteExtern.geschaefteKontakteExtern.push(
          geschaeftKontaktExtern,
        )
      }),
      geschaeftKontaktExternDelete(idGeschaeft, idKontakt) {
        self.geschaefteKontakteExtern.geschaefteKontakteExtern =
          self.geschaefteKontakteExtern.geschaefteKontakteExtern.filter(
            (g) => g.idGeschaeft !== idGeschaeft || g.idKontakt !== idKontakt,
          )
        self.geschaefteKontakteExtern.activeIdGeschaeft = null
        self.geschaefteKontakteExtern.activeIdKontakt = null
      },
      geschaeftKontaktExternRemove: flow(function* (idGeschaeft, idKontakt) {
        try {
          yield self.app.db.execute(
            `
              DELETE FROM
                geschaefteKontakteExtern
              WHERE
                idGeschaeft = ${idGeschaeft}
                AND idKontakt = ${idKontakt}`,
          )
        } catch (error) {
          return self.addErrorMessage(error.message)
        }
        self.geschaefteKontakteExtern.willDelete = false
        self.geschaeftKontaktExternDelete(idGeschaeft, idKontakt)
      }),
      getGeschaefteKontakteIntern: flow(function* () {
        const { app } = self
        let geschaefteKontakteIntern = []
        try {
          geschaefteKontakteIntern = yield app.db.select(
            'SELECT * FROM geschaefteKontakteIntern',
          )
        } catch (error) {
          return self.addErrorMessage(error.message)
        }
        self.geschaefteKontakteIntern.geschaefteKontakteIntern =
          geschaefteKontakteIntern
      }),
      geschaeftKontaktInternNewCreate: flow(function* (idGeschaeft, idKontakt) {
        const { app } = self
        try {
          yield app.db.execute(
            `
              INSERT INTO
                geschaefteKontakteIntern (idGeschaeft, idKontakt)
              VALUES
                (${idGeschaeft}, ${idKontakt})`,
          )
        } catch (error) {
          console.log({ error, idGeschaeft, idKontakt })
          return self.addErrorMessage(error.message)
        }
        // return full object
        let geschaeftKontaktIntern
        try {
          geschaeftKontaktIntern = yield app.db.select(
            `
              SELECT
                *
              FROM
                geschaefteKontakteIntern
              WHERE
                idGeschaeft = ${idGeschaeft}
                AND idKontakt = ${idKontakt}`,
          )[0]
        } catch (error) {
          console.log({ error, idGeschaeft, idKontakt })
          return self.addErrorMessage(error.message)
        }
        self.geschaefteKontakteIntern.geschaefteKontakteIntern.push(
          geschaeftKontaktIntern,
        )
      }),
      geschaeftKontaktInternDelete(idGeschaeft, idKontakt) {
        self.geschaefteKontakteIntern.geschaefteKontakteIntern =
          self.geschaefteKontakteIntern.geschaefteKontakteIntern.filter(
            (g) => g.idGeschaeft !== idGeschaeft || g.idKontakt !== idKontakt,
          )
        self.geschaefteKontakteIntern.activeIdGeschaeft = null
        self.geschaefteKontakteIntern.activeIdKontakt = null
      },
      geschaeftKontaktInternRemove: flow(function* (idGeschaeft, idKontakt) {
        try {
          yield self.app.db.execute(
            `
              DELETE FROM
                geschaefteKontakteIntern
              WHERE
                idGeschaeft = ${idGeschaeft}
                AND idKontakt = ${idKontakt}`,
          )
        } catch (error) {
          return self.addErrorMessage(error.message)
        }
        self.geschaefteKontakteIntern.willDelete = false
        self.geschaeftKontaktInternDelete(idGeschaeft, idKontakt)
      }),
      messageShow(showMessageModal, messageTextLine1, messageTextLine2) {
        self.app.showMessageModal = showMessageModal
        self.app.messageTextLine1 = messageTextLine1
        self.app.messageTextLine2 = messageTextLine2
      },
      addErrorMessage(message) {
        // use uniq in case multiple same messages arrive
        self.errors = uniq([...self.errors, message])
        setTimeout(() => self.popError(), 1000 * 20)
      },
      popError() {
        // eslint-disable-next-line no-unused-vars
        const [first, ...last] = self.errors
        self.errors = [...last]
      },
      setDirty(val) {
        self.dirty = val
      },
    }))

export default store
