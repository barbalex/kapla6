import { types, getParent } from 'mobx-state-tree'

import Interne from './Interne'
import Externe from './Externe'
import Aktenstandort from './Aktenstandort'
import Geschaeftsart from './Geschaeftsart'
import ParlVorstossTyp from './ParlVorstossTyp'
import RechtsmittelInstanz from './RechtsmittelInstanz'
import RechtsmittelErledigung from './RechtsmittelErledigung'
import Status from './Status'
import Abteilung from './Abteilung'

export default types
  .model('TableRows', {
    interne: types.array(Interne),
    externe: types.array(Externe),
    aktenstandort: types.array(Aktenstandort),
    geschaeftsart: types.array(Geschaeftsart),
    parlVorstossTyp: types.array(ParlVorstossTyp),
    rechtsmittelInstanz: types.array(RechtsmittelInstanz),
    rechtsmittelErledigung: types.array(RechtsmittelErledigung),
    status: types.array(Status),
    abteilung: types.array(Abteilung),
  })
  .actions((self) => {
    const store = getParent(self, 2)

    return {
      setRows(table, rows) {
        self[table] = rows
      },
      async delete(table, id) {
        const { app, addErrorMessage } = store
        try {
          await app.db.execute(
            `
              DELETE FROM
                ${table}
              WHERE
                id = ${id}`,
          )
        } catch (error) {
          return addErrorMessage(error.message)
        }
        store.table.toggleActivatedRow(id)
        switch (table) {
          case 'interne':
            self.deleteInterne(id)
            break
          case 'externe':
            self.deleteExterne(id)
            break
          case 'aktenstandort':
            self.deleteAktenstandort(id)
            break
          case 'geschaeftsart':
            self.deleteGeschaeftsart(id)
            break
          case 'parlVorstossTyp':
            self.deleteParlVorstossTyp(id)
            break
          case 'rechtsmittelInstanz':
            self.deleteRechtsmittelInstanz(id)
            break
          case 'rechtsmittelErledigung':
            self.deleteRechtsmittelErledigung(id)
            break
          case 'status':
            self.deleteStatus(id)
            break
          case 'abteilung':
            self.deleteAbteilung(id)
            break
          default:
            // abteilung, interne, externe
            self[table] = self[table].filter((g) => g.id !== id)
        }
      },
      deleteInterne(id) {
        self.interne = self.interne.filter((g) => g.id !== id)
      },
      deleteExterne(id) {
        self.externe = self.externe.filter((g) => g.id !== id)
      },
      deleteAktenstandort(id) {
        self.aktenstandort = self.aktenstandort.filter((g) => g.id !== id)
      },
      deleteGeschaeftsart(id) {
        self.geschaeftsart = self.geschaeftsart.filter((g) => g.id !== id)
      },
      deleteParlVorstossTyp(id) {
        self.parlVorstossTyp = self.parlVorstossTyp.filter((g) => g.id !== id)
      },
      deleteRechtsmittelInstanz(id) {
        self.rechtsmittelInstanz = self.rechtsmittelInstanz.filter(
          (g) => g.id !== id,
        )
      },
      deleteRechtsmittelErledigung(id) {
        self.rechtsmittelErledigung = self.rechtsmittelErledigung.filter(
          (g) => g.id !== id,
        )
      },
      deleteStatus(id) {
        self.status = self.status.filter((g) => g.id !== id)
      },
      deleteAbteilung(id) {
        self.abteilung = self.abteilung.filter((g) => g.id !== id)
      },
      async insert(table) {
        const location = store.location.toJSON()
        const activeLocation = location[0]
        const { addErrorMessage, setLocation } = store
        const { db } = store.app
        let result
        try {
          result = await db.execute(`INSERT INTO ${table} (id) VALUES (NULL)`)
        } catch (error) {
          return addErrorMessage(error.message)
        }
        const id = result.lastInsertId
        // return full dataset
        let rows
        try {
          rows = await db.select(`SELECT * FROM ${table} WHERE id = ${id}`)
        } catch (error) {
          return addErrorMessage(error.message)
        }
        const row = rows[0]
        switch (table) {
          case 'interne':
            self.insertInterne(row)
            break
          case 'externe':
            self.insertExterne(row)
            break
          case 'aktenstandort':
            self.insertAktenstandort(row)
            break
          case 'geschaeftsart':
            self.insertGeschaeftsart(row)
            break
          case 'parlVorstossTyp':
            self.insertParlVorstossTyp(row)
            break
          case 'rechtsmittelInstanz':
            self.insertRechtsmittelInstanz(row)
            break
          case 'rechtsmittelErledigung':
            self.insertRechtsmittelErledigung(row)
            break
          case 'status':
            self.insertStatus(row)
            break
          case 'abteilung':
            self.insertAbteilung(row)
            break
          default:
            // interne, externe
            self[table].unshift(row)
        }
        store.table.toggleActivatedRow(row.id)
        if (activeLocation !== 'table') {
          setLocation(['table'])
        }
      },
      insertInterne(val) {
        self.interne.unshift(val)
      },
      insertExterne(val) {
        self.externe.unshift(val)
      },
      insertAktenstandort(val) {
        self.aktenstandort.unshift(val)
      },
      insertGeschaeftsart(val) {
        self.geschaeftsart.unshift(val)
      },
      insertParlVorstossTyp(val) {
        self.parlVorstossTyp.unshift(val)
      },
      insertRechtsmittelInstanz(val) {
        self.rechtsmittelInstanz.unshift(val)
      },
      insertRechtsmittelErledigung(val) {
        self.rechtsmittelErledigung.unshift(val)
      },
      insertStatus(val) {
        self.status.unshift(val)
      },
      insertAbteilung(val) {
        self.abteilung.unshift(val)
      },
    }
  })
