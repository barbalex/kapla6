import { types, getParent } from 'mobx-state-tree'

import Interne from './Interne'
import Externe from './Externe'
import Aktenstandort from './Aktenstandort'
import Geschaeftsart from './Geschaeftsart'
import ParlVorstossTyp from './ParlVorstossTyp'
import RechtsmittelInstanz from './RechtsmittelInstanz'
import RechtsmittelErledigung from './RechtsmittelErledigung'
import Status from './Status'

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
        self[table] = self[table].filter((g) => g.id !== id)
      },
      async insert(table) {
        const location = store.location.toJSON()
        const activeLocation = location[0]
        const { addErrorMessage, setLocation } = store
        const { db } = store.app
        let result
        try {
          result = await db.select(`INSERT INTO ${table} (id) VALUES (NULL)`)
        } catch (error) {
          return addErrorMessage(error.message)
        }
        const id = result.lastInsertRowid
        // return full dataset
        let row
        try {
          row = await db.select(`SELECT * FROM ${table} WHERE id = ${id}`)[0]
        } catch (error) {
          return addErrorMessage(error.message)
        }
        self[table].unshift(row)
        store.table.toggleActivatedRow(row.id)
        if (activeLocation !== 'table') {
          setLocation(['table'])
        }
      },
    }
  })
