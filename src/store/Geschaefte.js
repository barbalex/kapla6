import { types, getParent, flow } from 'mobx-state-tree'
import _ from 'lodash'
import moment from 'moment'

import filterGeschaefte from '../src/filterGeschaefte'
import sortGeschaefteFiltered from '../src/sortGeschaefteFiltered'
import getHistoryOfGeschaeft from '../src/getHistoryOfGeschaeft'
import Geschaeft from './Geschaeft'
import Links from './Links'
import Geko from './Geko'
// seems these are not used
//import AbteilungOptions from './Abteilung'
//import RechtsmittelErledigungOptions from './RechtsmittelErledigung'
//import ParlVorstossTypOptions from './ParlVorstossTyp'
//import StatusOptions from './Status'
//import AktenstandortOptions from './Aktenstandort'
import InterneOptions from './Interne'
import ExterneOptions from './Externe'
import FilterFields from './FilterFields'
import SortFields from './SortFields'
import isDateField from '../src/isDateField'
import convertDateToDdMmYyyy from '../src/convertDateToDdMmYyyy'
import geschaefteSortByFieldsGetSortFields from '../src/geschaefteSortByFieldsGetSortFields'

export default types
  .model('Geschaefte', {
    filterFulltext: types.optional(types.string, ''),
    filterFulltextIds: types.optional(types.array(types.number), []),
    filterType: types.maybeNull(types.string),
    activeId: types.maybeNull(types.number),
    willDelete: types.optional(types.boolean, false),
    geko: types.array(Geko),
    geschaefte: types.array(Geschaeft),
    links: types.array(Links),
    abteilungOptions: types.array(types.union(types.string, types.null)),
    rechtsmittelErledigungOptions: types.array(
      types.union(types.string, types.null),
    ),
    parlVorstossTypOptions: types.array(types.union(types.string, types.null)),
    statusOptions: types.array(types.union(types.string, types.null)),
    faelligeStatiOptions: types.array(types.union(types.string, types.null)),
    geschaeftsartOptions: types.array(types.union(types.string, types.null)),
    aktenstandortOptions: types.array(types.union(types.string, types.null)),
    interneOptions: types.array(InterneOptions),
    externeOptions: types.array(ExterneOptions),
    filterFields: types.array(FilterFields),
    sortFields: types.array(SortFields),
  })
  .volatile(() => ({
    error: [],
  }))
  .views((self) => {
    const store = getParent(self, 1)

    return {
      get geschaeftePlusFiltered() {
        return filterGeschaefte(store)
      },
      get geschaefteFilteredAndSorted() {
        return sortGeschaefteFiltered(store)
      },
      get historyOfActiveId() {
        return getHistoryOfGeschaeft(self.geschaefte, self.activeId)
      },
      get gekoOfActiveId() {
        return self.geko.filter((g) => g.idGeschaeft === self.activeId)
      },
      get isFiltered() {
        const existsFilterFulltext = !!self.filterFulltext
        const existsFilterFields = self.filterFields.length > 0
        return existsFilterFields || existsFilterFulltext
      },
    }
  })
  .actions((self) => {
    const store = getParent(self, 1)

    return {
      setFaelligeStatiOptions(val) {
        self.faelligeStatiOptions = val
      },
      sortByFields(field, direction) {
        const { reportType, initiate } = store.pages
        const sortFields = geschaefteSortByFieldsGetSortFields(
          store,
          field,
          direction,
        )
        self.sortFields = sortFields
        /**
         * if pages are active,
         * initiate with new data
         */
        const location = store.location.toJSON()
        const activeLocation = location[0]
        if (activeLocation === 'pages') {
          initiate(reportType)
        }
      },
      resetSort() {
        self.sortFields = []
      },
      filterByFields(filterFields, filterType = 'nach Feldern') {
        const { reportType, initiate } = store.pages
        const { geschaefteFilteredAndSorted } = store.geschaefte
        store.geschaefte.filterFields = filterFields
        store.geschaefte.filterFulltext = ''
        store.geschaefte.filterType = filterType || null
        store.geschaefte.activeId = null
        /**
         * if pages are active,
         * initiate with new data
         */
        const location = store.location.toJSON()
        const activeLocation = location[0]
        if (activeLocation === 'pages') {
          initiate(reportType)
        } else if (geschaefteFilteredAndSorted.length === 1) {
          self.toggleActivatedById(geschaefteFilteredAndSorted[0].idGeschaeft)
        }
      },
      setFilterFulltext(val) {
        self.filterFulltext = val
      },
      filterByFulltext: flow(function* (value) {
        const location = store.location.toJSON()
        const activeLocation = location[0]
        const { geschaefte, setLocation } = store
        const { initiate, reportType } = store.pages
        const { geschaefteFilteredAndSorted } = geschaefte

        self.filterType = 'nach Volltext'
        self.filterFields = []
        self.activeId = null
        yield self.fetchFilterFulltextIds(value)
        /**
         * if pages are active,
         * initiate with new data
         */
        if (activeLocation === 'pages') {
          initiate(reportType)
        } else {
          if (activeLocation !== 'geschaefte') {
            setLocation(['geschaefte'])
          }
          if (geschaefteFilteredAndSorted.length === 1) {
            self.toggleActivatedById(geschaefteFilteredAndSorted[0].idGeschaeft)
          }
        }
      }),
      fetchFilterFulltextIds: flow(function* (filter) {
        // convert to lower case if possible
        let filterValue = filter.toLowerCase ? filter.toLowerCase() : filter
        if (filterValue.toString) {
          // a number is queried
          // convert to string to also find 7681 when filtering for 681
          filterValue = filterValue.toString()
        }
        let result = []
        try {
          result = yield store.app.db.select(
            `select idGeschaeft from fts where value match '"${filterValue}"*'`,
          )
        } catch (error) {
          store.addErrorMessage(error.message)
          self.filterFulltextIds = []
          return
        }
        const filterFulltextIds = result.map((o) => o.idGeschaeft)
        /*console.log('fetchFilterFulltextIds', {
          filter,
          filterFulltextIds,
          result,
        })*/
        self.filterFulltextIds = filterFulltextIds
      }),
      removeFilters() {
        self.GefilterteIds = _.sortBy(self.geschaefte, (g) => g.idGeschaeft)
          .reverse()
          .map((g) => g.idGeschaeft)
        self.filterFields = []
        self.filterType = null
        self.filterFulltext = ''
        self.sortFields = []
      },
      toggleActivatedById(idGeschaeft) {
        self.activeId =
          self.activeId && self.activeId === idGeschaeft ? null : idGeschaeft
      },
      fetchFaellige: flow(function* () {
        const location = store.location.toJSON()
        const activeLocation = location[0]
        const { app, addErrorMessage, setLocation } = store
        try {
          // querying all fields stopps execution with error:
          // thread 'tokio-runtime-worker' panicked at 'called `Result::unwrap()` on an `Err` value: ColumnDecode { index: "20", source: "mismatched types; Rust type `i64` (as SQL type `INTEGER`) is not compatible with SQL type `TEXT`" }', C:\Users\alexa\.cargo\registry\src\github.com-1ecc6299db9ec823\sqlx-core-0.5.10\src\row.rs:73:37
          // https://github.com/launchbadge/sqlx/issues/1629
          // if some idVorgeschaeft contain empty strings
          // prevent this
          yield app.db.execute(
            `UPDATE geschaefte SET idVorgeschaeft = NULL WHERE cast(cast(idVorgeschaeft AS integer) AS text) != idVorgeschaeft;`,
          )
        } catch (error) {
          console.log(
            'error removing empty values from geschaefte.idVorgeschaeft:',
            error,
          )
        }
        let geschaefte = []
        try {
          geschaefte = yield app.db.select(
            `
            SELECT geschaefte.* FROM geschaefte
            inner join status
            on geschaefte.status = status.status
            where 
              status.geschaeftKannFaelligSein = 1
              and geschaefte.fristMitarbeiter <= Date()
            ORDER BY idGeschaeft DESC`,
          )
        } catch (error) {
          addErrorMessage(error)
        }
        // TODO: above execution stopps
        /**
         * convert date fields
         * from YYYY-MM-DD to DD.MM.YYYY
         */
        geschaefte.forEach((g) => {
          const geschaeft = g
          Object.keys(geschaeft).forEach((field) => {
            if (isDateField(field)) {
              geschaeft[field] = convertDateToDdMmYyyy(geschaeft[field])
            }
          })
        })
        self.geschaefte = geschaefte
        if (activeLocation !== 'geschaefte') {
          setLocation(['geschaefte'])
        }
      }),
      fetchRest: flow(function* () {
        const location = store.location.toJSON()
        const activeLocation = location[0]
        const { app, addErrorMessage, setLocation } = store
        let geschaefte = []
        try {
          geschaefte = yield app.db.select(
            `
            SELECT * FROM geschaefte
            where idGeschaeft not in (
              SELECT geschaefte.idGeschaeft FROM geschaefte
              inner join status
              on geschaefte.status = status.status
              where 
                status.geschaeftKannFaelligSein = 1
                and geschaefte.fristMitarbeiter <= Date()
            )
            ORDER BY idGeschaeft DESC`,
          )
        } catch (error) {
          addErrorMessage(error)
        }
        // TODO: above execution stopps
        /**
         * convert date fields
         * from YYYY-MM-DD to DD.MM.YYYY
         */
        geschaefte.forEach((g) => {
          const geschaeft = g
          Object.keys(geschaeft).forEach((field) => {
            if (isDateField(field)) {
              geschaeft[field] = convertDateToDdMmYyyy(geschaeft[field])
            }
          })
        })
        self.geschaefte = [...self.geschaefte.slice(), ...geschaefte]
        if (activeLocation !== 'geschaefte') {
          setLocation(['geschaefte'])
        }
      }),
      fetchAllGeko: flow(function* () {
        const { app, addErrorMessage } = store
        let geko = []
        try {
          geko = yield app.db.select(
            'SELECT * FROM geko ORDER BY idGeschaeft, gekoNr',
          )
        } catch (error) {
          addErrorMessage(error.message)
        }
        self.geko = geko
      }),
      fetchLinks: flow(function* () {
        const { app, addErrorMessage } = store
        let links = []
        try {
          links = yield app.db.select(
            'SELECT * FROM links ORDER BY idGeschaeft, url',
          )
        } catch (error) {
          return addErrorMessage(error.message)
        }
        self.links = links
      }),
      geschaeftInsert: flow(function* () {
        const location = store.location.toJSON()
        const activeLocation = location[0]
        const { app, setLocation } = store
        const { username } = app
        const now = moment().format('YYYY-MM-DD HH:mm:ss')
        let result
        try {
          result = yield app.db.execute(
            `
              INSERT INTO
                geschaefte (mutationsdatum, mutationsperson)
              VALUES
                ('${now}', '${username}')`,
          )
        } catch (error) {
          return self.addErrorMessage(error.message)
        }
        const idGeschaeft = result.lastInsertRowid

        // return full dataset
        let geschaefte
        try {
          geschaefte = yield app.db.select(
            `
              SELECT
                *
              FROM
                geschaefte
              WHERE
                idGeschaeft = ${idGeschaeft}`,
          )
        } catch (error) {
          return self.addErrorMessage(error.message)
        }
        const geschaeft = geschaefte?.[0]
        self.geschaefte.unshift(geschaeft)
        // need to remove filters
        self.filterFields = []
        self.filterType = null
        self.filterFulltext = ''
        self.sortFields = []
        self.toggleActivatedById(geschaeft.idGeschaeft)
        if (activeLocation !== 'geschaefte') {
          setLocation(['geschaefte'])
        }
      }),
      geschaeftDelete: flow(function* (idGeschaeft) {
        const {
          app,
          geschaefteKontakteIntern,
          geschaefteKontakteExtern,
          addErrorMessage,
          geschaeftKontaktInternDelete,
        } = store
        try {
          yield app.db.execute(
            `
              DELETE FROM
                geschaefte
              WHERE
                idGeschaeft = ${idGeschaeft}`,
          )
        } catch (error) {
          console.log('geschaeftDelete error', error)
          return addErrorMessage(error.message)
        }
        self.geschaeftRemoveDeleteIntended(idGeschaeft)
        self.geschaefte = self.geschaefte.filter(
          (g) => g.idGeschaeft !== idGeschaeft,
        )
        // need to delete geschaefteKontakteIntern in self
        const geschaefteKontakteInternToDelete =
          geschaefteKontakteIntern.geschaefteKontakteIntern.filter(
            (g) => g.idGeschaeft === idGeschaeft,
          )
        geschaefteKontakteInternToDelete.forEach((g) =>
          geschaeftKontaktInternDelete(idGeschaeft, g.idKontakt),
        )
        // need to delete geschaefteKontakteExtern in self
        const geschaefteKontakteExternToDelete =
          geschaefteKontakteExtern.geschaefteKontakteExtern.filter(
            (g) => g.idGeschaeft === idGeschaeft,
          )
        geschaefteKontakteExternToDelete.forEach((g) =>
          store.geschaeftKontaktExternDelete(idGeschaeft, g.idKontakt),
        )
        // need to delete geKo in self
        const gekoToRemove = self.geko.filter(
          (g) => g.idGeschaeft === idGeschaeft,
        )
        gekoToRemove.forEach((g) => store.gekoRemove(idGeschaeft, g.gekoNr))
        // need to delete links in self
        const linkselfmove = self.links.filter(
          (l) => l.idGeschaeft === idGeschaeft,
        )
        linkselfmove.forEach((l) => store.linkDelete(idGeschaeft, l.url))
      }),
      geschaeftSetDeleteIntended() {
        self.willDelete = true
      },
      geschaeftRemoveDeleteIntended() {
        self.willDelete = false
      },
    }
  })
